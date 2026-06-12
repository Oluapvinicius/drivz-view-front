// Simple mock emergency helper for frontend-only testing
export function emitMockEmergency(emergency) {
  console.log('[mockEmergency] Disparando evento drivez:mock-emergency com payload:', emergency);
  const ev = new CustomEvent('drivez:mock-emergency', { detail: emergency });
  window.dispatchEvent(ev);
  console.log('[mockEmergency] ✅ Evento disparado');
}

export function emitMockAccept(pedidoId, prestadorId) {
  const ev = new CustomEvent('drivez:mock-accept', { detail: { pedidoId, prestadorId } });
  window.dispatchEvent(ev);
}

export default {
  emitMockEmergency,
  emitMockAccept
};
