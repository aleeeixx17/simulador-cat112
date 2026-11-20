// Reloj en tiempo real
setInterval(() => {
  document.getElementById('clock').textContent = new Date().toLocaleTimeString('es-ES');
}, 1000);

// ==========================================
// BANCO DE ESCENARIOS ALEATORIOS CAT112
// ==========================================
const ESCENARIOS_CAT112 = [
  {
    coords: [41.3888, 2.1590],
    radius: 30,
    amlAddress: 'Carrer d’Aragó / Balmes, Eixample, Barcelona',
    exactAddress: 'Carrer d’Aragó número 245, esquina Balmes, Barcelona',
    intro: '¡Hola, por favor rápido! Un hombre de unos sesenta años se acaba de desplomar en medio de la acera y no responde.',
    qa: {
      estado: 'Está tumbado boca arriba, no abre los ojos cuando le hablo y parece que no respira bien, hace como boqueadas.',
      ubicacion: 'Estamos justo delante de la farmacia de Carrer d’Aragó 245, casi esquina con calle Balmes, en Barcelona.',
      riesgos: 'Ningún riesgo alrededor, estamos en la acera, pero hay mucha gente mirando alrededor.'
    }
  },
  {
    coords: [41.4820, 2.0320],
    radius: 65,
    amlAddress: 'Autopista AP-7 PK 154, Sant Cugat del Vallès',
    exactAddress: 'Autopista AP-7, kilómetro 154 sentido Girona, altura Sant Cugat',
    intro: 'Buenas, llamo desde la AP-7, acaba de haber un choque muy fuerte entre un camión y dos turismos, hay coches cruzados.',
    qa: {
      estado: 'En el coche gris hay una chica atrapada que grita de dolor en la pierna, en el otro coche el conductor ha salido por su pie.',
      ubicacion: 'Es en la AP-7, justo pasado el cartel del kilómetro 154 dirección Girona, antes de la salida de Sant Cugat.',
      riesgos: 'Está saliendo humo blanco del motor del coche gris y el tráfico viene muy rápido, hay riesgo de alcance.'
    }
  },
  {
    coords: [41.9818, 2.8237],
    radius: 25,
    amlAddress: 'Carrer Nou, Barri Vell, Girona',
    exactAddress: 'Carrer Nou número 14, tercero segunda, Girona',
    intro: '¡Socorro! Sale muchísimo humo negro por debajo de la puerta del piso de mi vecina y huele a quemado.',
    qa: {
      estado: 'Vive una señora mayor sola, he picado al timbre pero no abre ni contesta nadie desde dentro.',
      ubicacion: 'Carrer Nou número 14, tercer piso puerta segunda, en el centro de Girona.',
      riesgos: 'La escalera del edificio se está empezando a llenar de humo y tenemos gas ciudad en la finca.'
    }
  },
  {
    coords: [41.1165, 1.2540],
    radius: 40,
    amlAddress: 'Plaça de la Font, Tarragona',
    exactAddress: 'Plaça de la Font número 18, terraza bar, Tarragona',
    intro: 'Oiga, manden a la policía urgente, hay una pelea multitudinaria entre seis o siete personas con botellas rotas.',
    qa: {
      estado: 'Uno de los chicos tiene un corte profundo en el brazo y está sangrando bastante, los demás siguen pegándose.',
      ubicacion: 'En la Plaça de la Font de Tarragona, justo frente al número 18, cerca del Ayuntamiento.',
      riesgos: 'Llevan botellas de cristal rotas y están tirando sillas de la terraza a la gente que pasa.'
    }
  },
  {
    coords: [41.6148, 0.6267],
    radius: 35,
    amlAddress: 'Carrer Major, Lleida',
    exactAddress: 'Carrer Major número 52, interior joyería, Lleida',
    intro: 'Hablo bajito porque estoy escondido en la trastienda... acaban de entrar dos encapuchados a robar en la tienda.',
    qa: {
      estado: 'De momento no han herido a nadie, tienen a mi compañera retenida en el mostrador.',
      ubicacion: 'Joyería del Carrer Major número 52, zona peatonal de Lleida.',
      riesgos: 'Uno de ellos lleva lo que parece una pistola o un cuchillo grande en la mano, están muy nerviosos.'
    }
  },
  {
    coords: [41.5463, 2.1086],
    radius: 30,
    amlAddress: 'Rambla de Sabadell, Sabadell',
    exactAddress: 'Rambla de Sabadell número 88, Sabadell',
    intro: 'Por favor una ambulancia, mi hijo de cuatro años se ha atragantado con un trozo de bocadillo y se está poniendo morado.',
    qa: {
      estado: 'No puede toser ni llorar, hace un ruido muy raro al intentar coger aire y está muy asustado.',
      ubicacion: 'Estamos en la Rambla de Sabadell número 88, delante de una cafetería.',
      riesgos: 'Ningún riesgo externo, estamos en la calle esperando ayuda.'
    }
  },
  {
    coords: [41.5632, 2.0089],
    radius: 50,
    amlAddress: 'Carretera de Matadepera, Terrassa',
    exactAddress: 'Carretera de Matadepera esquina Avinguda Abat Marcet, Terrassa',
    intro: 'Acaba de pasar un coche saltándose el semáforo en rojo y ha atropellado a un ciclista, el coche se ha dado a la fuga.',
    qa: {
      estado: 'El ciclista está consciente en el suelo pero no se puede mover y se queja mucho de la cadera y la cabeza, llevaba casco.',
      ubicacion: 'En el cruce de Carretera de Matadepera con Avinguda Abat Marcet, en Terrassa.',
      riesgos: 'El herido está en medio del carril izquierdo, estamos desviando los coches como podemos.'
    }
  },
  {
    coords: [41.1558, 1.1069],
    radius: 80,
    amlAddress: 'Urbanització Blancafort / Zona boscosa, Reus',
    exactAddress: 'Camí de la Pedrera, junto a Urbanització Blancafort, Reus',
    intro: 'Llamo porque veo una columna de humo gris muy densa y llamas saliendo de unos matorrales pegados a unos chalets.',
    qa: {
      estado: 'De momento no veo personas heridas, los vecinos están saliendo de las casas con mangueras.',
      ubicacion: 'Es en el Camí de la Pedrera, justo detrás de la Urbanització Blancafort de Reus.',
      riesgos: 'Hace bastante viento y el fuego avanza muy rápido hacia los pinos y las vallas de las casas.'
    }
  }
];

function generarTelefonoAleatorio() {
  const prefijo = Math.random() > 0.3 ? '6' : '7';
  const resto = Math.floor(10000000 + Math.random() * 90000000).toString();
  return `+34 ${prefijo}${resto.slice(0, 2)} ${resto.slice(2, 5)} ${resto.slice(5, 8)}`;
}

// ==========================================
// SINTETIZADOR DE TONO DE LLAMADA (WEB AUDIO)
// ==========================================
let audioCtx = null;
let ringInterval = null;

function startRingtone() {
  stopRingtone();
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const playTone = () => {
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(425, audioCtx.currentTime); // Tono estándar europeo 425Hz
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.1);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.1);
    };
    playTone();
    ringInterval = setInterval(playTone, 2500);
  } catch (e) {
    console.warn('AudioContext bloqueado hasta interacción:', e);
  }
}

function stopRingtone() {
  if (ringInterval) {
    clearInterval(ringInterval);
    ringInterval = null;
  }
  if (audioCtx) {
    audioCtx.close().catch(() => {});
    audioCtx = null;
  }
}

// ==========================================
// SÍNTESIS DE VOZ DEL ALERTANTE (WEB SPEECH)
// ==========================================
function hablarAlertante(texto) {
  const subBox = document.getElementById('sim-subtitle-box');
  subBox.textContent = `🗣️ Alertante: "${texto}"`;

  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = 'es-ES';
  utterance.rate = 1.06; // Ritmo ligeramente acelerado por urgencia
  utterance.pitch = 1.05;

  const voices = window.speechSynthesis.getVoices();
  const esVoice = voices.find(v => v.lang.includes('es-ES')) || voices.find(v => v.lang.includes('es'));
  if (esVoice) utterance.voice = esVoice;

  window.speechSynthesis.speak(utterance);
}

// ==========================================
// SINCRONIZACIÓN Y ESTADO GLOBAL
// ==========================================
const channel = new BroadcastChannel('cat112_sala');
let incidents = JSON.parse(localStorage.getItem('cat112_incidents') || '[]');
let lastIncidentId = null;

const randomSuffix = Math.floor(100 + Math.random() * 900);
const myPeerId = `cat112-${randomSuffix}`;
const peer = new Peer(myPeerId);

let myLocalStream = null;
let currentMetadata = null;
let alertanteCall = null;
let demandaCall = null;
let respuestaCall = null;

// Variables de llamada simulada
let activeCallType = null; // 'webrtc' | 'simulated' | null
let pendingSimScenario = null;
let activeSimScenario = null;
let callTimerInterval = null;
let callSeconds = 0;
let autoCallTimeout = null;

peer.on('open', id => {
  document.getElementById('peer-status').textContent = '🟢 Centralita VoIP Online';
  document.getElementById('my-peer-id').textContent = id;
  document.getElementById('demanda-id').textContent = id;
  document.getElementById('respuesta-id').textContent = id;
});

// Cambio de vistas por rol
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

function mostrarAML(lat, lng, radius, address) {
  map.setView([lat, lng], 16);
  if (amlCircle) map.removeLayer(amlCircle);
  amlCircle = L.circle([lat, lng], { radius, color: '#ef4444' }).addTo(map);
  document.getElementById('aml-box').textContent = `AML recibido: ${address} (Radio precisión: ${radius}m)`;
  document.getElementById('f-direccion').value = address;
}

function iniciarCronometroLlamada() {
  detenerCronometroLlamada();
  callSeconds = 0;
  document.getElementById('call-timer').textContent = '00:00';
  callTimerInterval = setInterval(() => {
    callSeconds++;
    const mins = String(Math.floor(callSeconds / 60)).padStart(2, '0');
    const secs = String(callSeconds % 60).padStart(2, '0');
    document.getElementById('call-timer').textContent = `${mins}:${secs}`;
  }, 1000);
}

function detenerCronometroLlamada() {
  if (callTimerInterval) {
    clearInterval(callTimerInterval);
    callTimerInterval = null;
  }
}

// ==========================================
// GENERADOR DE LLAMADAS ALEATORIAS EN DEMANDA
// ==========================================
function dispararLlamadaSimulada() {
  if (activeCallType || pendingSimScenario || demandaCall) {
    return alert('Ya tienes una llamada sonando o en curso.');
  }

  const base = ESCENARIOS_CAT112[Math.floor(Math.random() * ESCENARIOS_CAT112.length)];
  pendingSimScenario = {
    ...base,
    telefono: generarTelefonoAleatorio()
  };

  document.getElementById('caller-number').textContent = pendingSimScenario.telefono;
  document.getElementById('incoming-type-tag').textContent = 'Simulada IA';
  document.getElementById('incoming-type-tag').classList.remove('hidden');
  document.getElementById('incoming-alert').classList.remove('hidden');

  mostrarAML(
    pendingSimScenario.coords[0],
    pendingSimScenario.coords[1],
    pendingSimScenario.radius,
    pendingSimScenario.amlAddress
  );
  document.getElementById('f-telefono').value = pendingSimScenario.telefono;
  startRingtone();
}

document.getElementById('btn-sim-call').addEventListener('click', dispararLlamadaSimulada);

// Modo Guardia Automático
document.getElementById('toggle-auto-calls').addEventListener('change', e => {
  if (e.target.checked) {
    programarSiguienteLlamadaAuto();
  } else {
    clearTimeout(autoCallTimeout);
  }
});

function programarSiguienteLlamadaAuto() {
  clearTimeout(autoCallTimeout);
  if (!document.getElementById('toggle-auto-calls').checked) return;

  const delayMs = Math.floor(20000 + Math.random() * 20000); // Entre 20 y 40 segundos
  autoCallTimeout = setTimeout(() => {
    if (!activeCallType && !pendingSimScenario && !demandaCall) {
      dispararLlamadaSimulada();
    }
    programarSiguienteLlamadaAuto();
  }, delayMs);
}

// Botones de interrogatorio rápido al alertante simulado
document.getElementById('btn-repeat').addEventListener('click', () => {
  if (activeSimScenario) hablarAlertante(activeSimScenario.intro);
});
document.getElementById('btn-ask-estado').addEventListener('click', () => {
  if (activeSimScenario) hablarAlertante(activeSimScenario.qa.estado);
});
document.getElementById('btn-ask-ubicacion').addEventListener('click', () => {
  if (activeSimScenario) {
    hablarAlertante(activeSimScenario.qa.ubicacion);
    document.getElementById('f-direccion').value = activeSimScenario.exactAddress;
  }
});
document.getElementById('btn-ask-riesgos').addEventListener('click', () => {
  if (activeSimScenario) hablarAlertante(activeSimScenario.qa.riesgos);
});
document.getElementById('btn-toggle-subs').addEventListener('click', () => {
  document.getElementById('sim-subtitle-box').classList.toggle('hidden');
});

// ==========================================
// 1. LÓGICA DEL ALERTANTE MANUAL (WEBRTC)
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

peer.on('connection', conn => {
  conn.on('data', data => {
    if (data.type === 'TRANSFER_CALL' && data.targetPeerId) {
      if (alertanteCall) alertanteCall.close();
      currentMetadata = { ...currentMetadata, transferred: true, incidentId: data.incidentId || '' };
      iniciarLlamadaSaliente(data.targetPeerId, currentMetadata, '📲 Transfiriendo llamada a Sala de Respuesta...');
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
    respuestaCall = call;
    document.getElementById('respuesta-incoming-alert').classList.remove('hidden');
    document.getElementById('transfer-inc-badge').textContent = meta.incidentId ? `(${meta.incidentId})` : '';
    startRingtone();
  } else {
    demandaCall = call;
    document.getElementById('caller-number').textContent = '+34 600 112 999';
    document.getElementById('incoming-type-tag').classList.add('hidden');
    document.getElementById('incoming-alert').classList.remove('hidden');
    startRingtone();

    if (meta.coords) {
      const [lat, lng] = meta.coords.split(',').map(Number);
      mostrarAML(lat, lng, 35, meta.address);
    }
  }
});

// Descolgar en Demanda (Soporta tanto llamada Simulada como WebRTC real)
document.getElementById('btn-answer').addEventListener('click', async () => {
  stopRingtone();
  document.getElementById('incoming-alert').classList.add('hidden');

  if (pendingSimScenario) {
    activeCallType = 'simulated';
    activeSimScenario = pendingSimScenario;
    pendingSimScenario = null;

    document.getElementById('demanda-active-call').classList.remove('hidden');
    document.getElementById('sim-caller-controls').classList.remove('hidden');
    iniciarCronometroLlamada();
    hablarAlertante(activeSimScenario.intro);
    return;
  }

  if (demandaCall) {
    activeCallType = 'webrtc';
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    demandaCall.answer(stream);
    document.getElementById('demanda-active-call').classList.remove('hidden');
    document.getElementById('sim-caller-controls').classList.add('hidden');
    iniciarCronometroLlamada();

    demandaCall.on('stream', remoteStream => {
      document.getElementById('remote-audio').srcObject = remoteStream;
    });

    demandaCall.on('close', cerrarLlamadaDemanda);
  }
});

function cerrarLlamadaDemanda() {
  stopRingtone();
  detenerCronometroLlamada();
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  if (demandaCall) {
    demandaCall.close();
    demandaCall = null;
  }
  activeCallType = null;
  activeSimScenario = null;
  document.getElementById('demanda-active-call').classList.add('hidden');
  document.getElementById('sim-caller-controls').classList.add('hidden');
}

document.getElementById('btn-demanda-hangup').addEventListener('click', cerrarLlamadaDemanda);

// BOTÓN DE TRANSFERENCIA (DEMANDA -> RESPUESTA)
document.getElementById('btn-transfer').addEventListener('click', () => {
  if (!activeCallType) return alert('No hay ninguna llamada activa para transferir.');

  // Si es llamada simulada, la transferimos por el canal de sala a Respuesta
  if (activeCallType === 'simulated') {
    const scenarioToPass = { ...activeSimScenario };
    const incId = lastIncidentId || '';

    if (lastIncidentId) {
      const inc = incidents.find(i => i.id === lastIncidentId);
      if (inc) {
        const now = new Date().toLocaleTimeString('es-ES');
        inc.logs.push(`${now} - Llamada simulada transferida a Sala de Respuesta`);
        saveAndSync();
      }
    }

    channel.postMessage({
      type: 'TRANSFER_SIM_CALL',
      scenario: scenarioToPass,
      incidentId: incId
    });
    cerrarLlamadaDemanda();
    alert('Llamada simulada transferida a la pestaña de Op. Respuesta.');
    return;
  }

  // Si es llamada WebRTC real entre dos ordenadores
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

    if (lastIncidentId) {
      const inc = incidents.find(i => i.id === lastIncidentId);
      if (inc) {
        const now = new Date().toLocaleTimeString('es-ES');
        inc.logs.push(`${now} - Llamada de voz transferida a Op. Respuesta (${respuestaTargetId})`);
        saveAndSync();
      }
    }

    setTimeout(cerrarLlamadaDemanda, 300);
  });
});

// Descolgar en Respuesta (Llamada transferida)
let pendingRespuestaSim = null;

document.getElementById('btn-respuesta-answer').addEventListener('click', async () => {
  stopRingtone();
  document.getElementById('respuesta-incoming-alert').classList.add('hidden');

  if (pendingRespuestaSim) {
    document.getElementById('respuesta-active-call').classList.remove('hidden');
    hablarAlertante(`Hola, me han pasado con ustedes. ${pendingRespuestaSim.intro} ${pendingRespuestaSim.qa.estado}`);
    pendingRespuestaSim = null;
    return;
  }

  if (!respuestaCall) return;
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  respuestaCall.answer(stream);
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
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
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
  alert(`Carta ${newIncident.id} enviada a Sala de Respuesta.`);
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
  if (e.data.type === 'RESPUESTA_READY') {
    document.getElementById('transfer-target-id').value = e.data.peerId;
  }
  if (e.data.type === 'TRANSFER_SIM_CALL') {
    pendingRespuestaSim = e.data.scenario;
    document.getElementById('respuesta-incoming-alert').classList.remove('hidden');
    document.getElementById('transfer-inc-badge').textContent = e.data.incidentId ? `(${e.data.incidentId})` : '';
    startRingtone();
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
