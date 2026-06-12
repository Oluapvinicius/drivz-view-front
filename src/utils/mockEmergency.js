// Simple mock emergency helper for frontend-only testing
export function emitMockEmergency(emergency) {
  const ev = new CustomEvent('drivez:mock-emergency', { detail: emergency });
  window.dispatchEvent(ev);
}

export function emitMockAccept(pedidoId, prestadorId) {
  const ev = new CustomEvent('drivez:mock-accept', { detail: { pedidoId, prestadorId } });
  window.dispatchEvent(ev);
}

export default {
  emitMockEmergency,
  emitMockAccept
};
