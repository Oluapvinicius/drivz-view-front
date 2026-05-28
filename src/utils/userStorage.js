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

  setUserType(type) {
    if (type) {
      localStorage.setItem('userType', type);
    }
  },

  getUserType() {
    return localStorage.getItem('userType');
  },

  clearClienteData() {
    localStorage.removeItem('clienteId');
    localStorage.removeItem('clienteData');
    localStorage.removeItem('userType');
  },

  isAuthenticated() {
    return !!localStorage.getItem('clienteId');
  },

  setPrestadorId(id) {
    localStorage.setItem('prestadorId', id);
  },

  getPrestadorId() {
    return localStorage.getItem('prestadorId');
  },

  setPrestadorData(data) {
    localStorage.setItem('prestadorData', JSON.stringify(data));
  },

  getPrestadorData() {
    const data = localStorage.getItem('prestadorData');
    return data ? JSON.parse(data) : null;
  },

  clearPrestadorData() {
    localStorage.removeItem('prestadorId');
    localStorage.removeItem('prestadorData');
    localStorage.removeItem('userType');
  },

};
