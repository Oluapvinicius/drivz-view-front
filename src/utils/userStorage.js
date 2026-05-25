export const userStorage = {
  setClienteId(id) {
    localStorage.setItem('clienteId', id);
  },

  getClienteId() {
    return localStorage.getItem('clienteId');
  },

  setClienteData(data) {
    localStorage.setItem('clienteData', JSON.stringify(data));
  },

  getClienteData() {
    const data = localStorage.getItem('clienteData');
    return data ? JSON.parse(data) : null;
  },

  clearClienteData() {
    localStorage.removeItem('clienteId');
    localStorage.removeItem('clienteData');
  },

  isAuthenticated() {
    return !!localStorage.getItem('clienteId');
  }
};
