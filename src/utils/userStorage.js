export const userStorage = {
  setSession(id, data, type) {
    localStorage.setItem('userId', id);
    localStorage.setItem('userData', JSON.stringify(data));
    localStorage.setItem('userType', type);
  },

  getUserId() {
    return localStorage.getItem('userId');
  },

  getUserData() {
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
  },

  getUserType() {
    return localStorage.getItem('userType') || '';
  },

  isAuthenticated() {
    return !!localStorage.getItem('userId');
  },

  isPrestador() {
    const type = this.getUserType().toLowerCase();
    const data = this.getUserData() || {};
    
    return (
      type === 'prestador' || 
      type === 'provider' || 
      type === 'professional' || 
      !!data.id_prestador || 
      !!data.prestadorId
    );
  },

  isCliente() {
    const type = this.getUserType().toLowerCase();
    const data = this.getUserData() || {};
    
    return (
      type === 'cliente' || 
      type === 'client' || 
      !!data.id_cliente || 
      !!data.clienteId
    );
  },

  clear() {
    localStorage.removeItem('userId');
    localStorage.removeItem('userData');
    localStorage.removeItem('userType');
  }
};