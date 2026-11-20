// Reloj en tiempo real
setInterval(() => {
  document.getElementById('clock').textContent = new Date().toLocaleTimeString('es-ES');
}, 1000);

// Canal de sincronización entre pestañas (incidentes y autodetección de puestos)
const channel = new BroadcastChannel('cat112_sala');
let incidents = JSON.parse(localStorage.getItem('cat112_incidents') || '[]');
let lastIncidentId = null;

// Configuración PeerJS (Voz y Señalización WebRTC gratuita)
const randomSuffix = Math.floor(100 + Math.random() * 900);
const myPeerId = `cat112-${randomSuffix}`;
const peer = new Peer(myPeerId);

let myLocalStream = null;
let currentMetadata = null;
let alertanteCall = null;
let demandaCall = null;
let respuestaCall = null;

peer.on('open', id => {
  document.getElementById('peer-status').textContent = '🟢 Centralita VoIP Online';
  document.getElementById('my-peer-id').textContent = id;
  document.getElementById('demanda-id').textContent = id;
  document.getElementById('respuesta-id').textContent = id;
});

// Cambio de vistas por rol + anuncio automático de ID en pruebas locales
document.querySelectorAll('.role-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    btn.classList.add('active');
    const role = btn.dataset.role;
    document.getElementById(`view-${role}`).classList.add('active');

    if (role === 'demanda') setTimeout(() => map.invalidateSize(), 200);
    if (role === 'respuesta') {
      channel.postMessage({ type: 'RESPUESTA_READY', peerId: myPeerId });
    }
  });
});

// Mapa Leaflet para AML
const map = L.map('map').setView([41.3874, 2.1686], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);
let amlCircle = null;

// ==========================================
// 1. LÓGICA DEL ALERTANTE (LLAMAR Y CONMUTAR)
// ==========================================
document.getElementById('btn-call-112').addEventListener('click', async () => {
  const targetId = document.getElementById('target-operator-id').value.trim();
  if (!targetId) return alert('Introduce el ID del Operador de Demanda');

  const [coords, address] = document.getElementById('sim-location').value.split('|');
  currentMetadata = { coords, address, transferred: false };

  myLocalStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  iniciarLlamadaSaliente(targetId, currentMetadata, '📞 Llamando al 112...');
});

function iniciarLlamadaSaliente(targetId, metadata, statusText) {
  alertanteCall = peer.call(targetId, myLocalStream, { metadata });
  document.getElementById('call-state').textContent = statusText;
  document.getElementById('btn-hangup').classList.remove('hidden');

  alertanteCall.on('stream', remoteStream => {
    document.getElementById('call-state').textContent = metadata.transferred
      ? '🟢 En comunicación con Op. Respuesta (Transferida)'
      : '🟢 En comunicación con Op. Demanda';
    document.getElementById('remote-audio').srcObject = remoteStream;
  });

  alertanteCall.on('close', () => {
    document.getElementById('call-state').textContent = 'Llamada finalizada por el operador';
    document.getElementById('btn-hangup').classList.add('hidden');
  });
}

// Escuchar orden de transferencia enviada por el Operador de Demanda
peer.on('connection', conn => {
  conn.on('data', data => {
    if (data.type === 'TRANSFER_CALL' && data.targetPeerId) {
      // Cerramos el tramo actual con Demanda sin apagar el micrófono
      if (alertanteCall) alertanteCall.close();

      currentMetadata = {
        ...currentMetadata,
        transferred: true,
        incidentId: data.incidentId || ''
      };

      // Llamamos automáticamente al Operador de Respuesta
      iniciarLlamadaSaliente(
        data.targetPeerId,
        currentMetadata,
        '📲 Transfiriendo llamada a Sala de Respuesta...'
      );
    }
  });
});

document.getElementById('btn-hangup').addEventListener('click', () => {
  if (alertanteCall) alertanteCall.close();
  if (myLocalStream) {
    myLocalStream.getTracks().forEach(t => t.stop());
    myLocalStream = null;
  }
  document.getElementById('call-state').textContent = 'Llamada finalizada';
  document.getElementById('btn-hangup').classList.add('hidden');
});

// ==========================================
// 2. RECEPCIÓN DE LLAMADAS (DEMANDA Y RESPUESTA)
// ==========================================
peer.on('call', call => {
  const meta = call.metadata || {};

  if (meta.transferred) {
    // Es una llamada transferida -> Mostrar en Operador de Respuesta
    respuestaCall = call;
    document.getElementById('respuesta-incoming-alert').classList.remove('hidden');
    document.getElementById('transfer-inc-badge').textContent = meta.incidentId
      ? `(${meta.incidentId})`
      : '';
  } else {
    // Es una llamada nueva del ciudadano -> Mostrar en Operador de Demanda
    demandaCall = call;
    document.getElementById('incoming-alert').classList.remove('hidden');

    if (meta.coords) {
      const [lat, lng] = meta.coords.split(',').map(Number);
      map.setView([lat, lng], 16);
      if (amlCircle) map.removeLayer(amlCircle);
      amlCircle = L.circle([lat, lng], { radius: 35, color: '#ef4444' }).addTo(map);
      document.getElementById('aml-box').textContent = `AML recibido: ${meta.address} (Radio precisión: 35m)`;
      document.getElementById('f-direccion').value = meta.address;
    }
  }
});

// Descolgar en Demanda
document.getElementById('btn-answer').addEventListener('click', async () => {
  if (!demandaCall) return;
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  demandaCall.answer(stream);
  document.getElementById('incoming-alert').classList.add('hidden');
  document.getElementById('demanda-active-call').classList.remove('hidden');

  demandaCall.on('stream', remoteStream => {
    document.getElementById('remote-audio').srcObject = remoteStream;
  });

  demandaCall.on('close', () => {
    document.getElementById('demanda-active-call').classList.add('hidden');
    demandaCall = null;
  });
});

// BOTÓN DE TRANSFERENCIA (DEMANDA -> RESPUESTA)
document.getElementById('btn-transfer').addEventListener('click', () => {
  if (!demandaCall) return alert('No hay ninguna llamada activa para transferir.');
  const respuestaTargetId = document.getElementById('transfer-target-id').value.trim();
  if (!respuestaTargetId) return alert('Introduce el ID del Puesto de Respuesta.');

  const callerPeerId = demandaCall.peer;
  const dataConn = peer.connect(callerPeerId);

  dataConn.on('open', () => {
    dataConn.send({
      type: 'TRANSFER_CALL',
      targetPeerId: respuestaTargetId,
      incidentId: lastIncidentId
    });

    // Registrar en el historial del incidente si ya se creó la carta
    if (lastIncidentId) {
      const inc = incidents.find(i => i.id === lastIncidentId);
      if (inc) {
        const now = new Date().toLocaleTimeString('es-ES');
        inc.logs.push(`${now} - Llamada de voz transferida a Op. Respuesta (${respuestaTargetId})`);
        saveAndSync();
      }
    }

    // Cerrar el audio en Demanda
    setTimeout(() => {
      if (demandaCall) demandaCall.close();
      document.getElementById('demanda-active-call').classList.add('hidden');
    }, 300);
  });
});

document.getElementById('btn-demanda-hangup').addEventListener('click', () => {
  if (demandaCall) demandaCall.close();
  document.getElementById('demanda-active-call').classList.add('hidden');
});

// Descolgar en Respuesta (Llamada transferida)
document.getElementById('btn-respuesta-answer').addEventListener('click', async () => {
  if (!respuestaCall) return;
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  respuestaCall.answer(stream);
  document.getElementById('respuesta-incoming-alert').classList.add('hidden');
  document.getElementById('respuesta-active-call').classList.remove('hidden');

  respuestaCall.on('stream', remoteStream => {
    document.getElementById('remote-audio').srcObject = remoteStream;
  });

  respuestaCall.on('close', () => {
    document.getElementById('respuesta-active-call').classList.add('hidden');
    respuestaCall = null;
  });
});

document.getElementById('btn-respuesta-hangup').addEventListener('click', () => {
  if (respuestaCall) respuestaCall.close();
  document.getElementById('respuesta-active-call').classList.add('hidden');
});

// ==========================================
// 3. CARTA DE LLAMADA Y SINCRONIZACIÓN
// ==========================================
document.getElementById('carta-form').addEventListener('submit', e => {
  e.preventDefault();
  const now = new Date().toLocaleTimeString('es-ES');
  const newId = `INC-${Date.now().toString().slice(-5)}`;
  lastIncidentId = newId;

  const newIncident = {
    id: newId,
    hora: now,
    telefono: document.getElementById('f-telefono').value,
    prioridad: document.getElementById('f-prioridad').value,
    direccion: document.getElementById('f-direccion').value,
    grupo: document.getElementById('f-grupo').value,
    subtipo: document.getElementById('f-subtipo').value,
    relato: document.getElementById('f-relato').value,
    agencias: [],
    logs: [`${now} - Carta creada y enviada por Op. Demanda`]
  };

  incidents.unshift(newIncident);
  saveAndSync();
  e.target.reset();
  alert(`Carta ${newIncident.id} enviada a Sala de Respuesta. Ya puedes transferir la llamada si sigue activa.`);
});

function saveAndSync() {
  localStorage.setItem('cat112_incidents', JSON.stringify(incidents));
  channel.postMessage({ type: 'SYNC', incidents });
  renderIncidents();
}

channel.onmessage = e => {
  if (e.data.type === 'SYNC') {
    incidents = e.data.incidents;
    renderIncidents();
  }
  // Si abres Respuesta en otra pestaña, rellena su ID automáticamente en Demanda
  if (e.data.type === 'RESPUESTA_READY') {
    document.getElementById('transfer-target-id').value = e.data.peerId;
  }
};

function renderIncidents() {
  const container = document.getElementById('incidents-list');
  if (!incidents.length) {
    container.innerHTML = '<p class="empty-msg">No hay incidentes despachados todavía.</p>';
    return;
  }

  const cuerpos = ['SEM', "Mossos d'Esquadra", 'Bombers Gen.', 'Policia Local', 'Agents Rurals'];

  container.innerHTML = incidents.map((inc, idx) => `
    <div class="incident-card">
      <div style="display:flex; justify-content:space-between;">
        <strong>${inc.id} · [${inc.prioridad}] ${inc.grupo}</strong>
        <span>${inc.hora}</span>
      </div>
      <p><strong>Subtipo:</strong> ${inc.subtipo}</p>
      <p><strong>Lugar:</strong> ${inc.direccion}</p>
      <p><strong>Relato:</strong> ${inc.relato}</p>
      <div class="agencies-bar">
        ${cuerpos.map(c => `
          <button class="agency-btn ${inc.agencias.includes(c) ? 'active' : ''}"
            onclick="toggleAgency(${idx}, '${c}')">${c}</button>
        `).join('')}
      </div>
      <ul class="log-list">
        ${inc.logs.map(l => `<li>${l}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

window.toggleAgency = (idx, agency) => {
  const inc = incidents[idx];
  const now = new Date().toLocaleTimeString('es-ES');
  if (!inc.agencias.includes(agency)) {
    inc.agencias.push(agency);
    inc.logs.push(`${now} - Activado recurso: ${agency}`);
  } else {
    inc.agencias = inc.agencias.filter(a => a !== agency);
    inc.logs.push(`${now} - Desactivado recurso: ${agency}`);
  }
  saveAndSync();
};

renderIncidents();
