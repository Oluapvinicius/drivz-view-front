// Simple mock emergency helper for frontend-only testing
export function emitMockEmergency(emergency) {
  console.log('[mockEmergency] Disparando evento drivez:mock-emergency com payload:', emergency);
  const ev = new CustomEvent('drivez:mock-emergency', { detail: emergency });
  window.dispatchEvent(ev);
  console.log('[mockEmergency] ✅ Evento disparado');
}

export function emitMockAccept(pedidoId, prestadorId) {
  const payload = { pedidoId, prestadorId, timestamp: Date.now() };
  const ev = new CustomEvent('drivez:mock-accept', { detail: payload });
  try {
    window.dispatchEvent(ev);
    console.log('[mockEmergency] ✅ Evento drivez:mock-accept dispatchEvent', payload);
  } catch (e) {
    console.warn('[mockEmergency] Erro dispatchEvent mock-accept', e);
  }

  try {
    localStorage.setItem('drivez:mock-accept', JSON.stringify(payload));
    console.log('[mockEmergency] ✅ Gravado drivez:mock-accept no localStorage');
  } catch (e) {
    console.warn('[mockEmergency] Não foi possível gravar mock-accept no localStorage', e);
  }

  try {
    const bc = new BroadcastChannel('drivez-channel');
    bc.postMessage({ type: 'mock-accept', payload });
    bc.close();
    console.log('[mockEmergency] ✅ BroadcastChannel mock-accept enviado');
  } catch (e) {
    console.warn('[mockEmergency] BroadcastChannel não disponível para mock-accept', e);
  }
}

export default {
  emitMockEmergency,
  emitMockAccept
};
