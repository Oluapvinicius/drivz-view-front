<template>
  <div class="app-container">
    
    <aside class="sidebar" :class="{ active: sidebarOpen }">
      <div class="sidebar__header">
        <img src="../assets/profile.svg" alt="Logo" class="sidebar__logo">
        <span class="sidebar__title">CLOTHILDE</span>
      </div>

      <div class="sidebar__contact">
        <p class="sidebar__phone">(11) 96663-7777</p>
        <p class="sidebar__location">Jandira - SP</p>
      </div>

      <nav class="sidebar__menu">
        <button class="sidebar__item" @click="handleSidebarAction('messages')">
          <img src="../assets/mensage.svg" alt="Mensagens" class="sidebar__icon">
          <span class="sidebar__label">Mensagens</span>
        </button>
        <button class="sidebar__item" @click="handleSidebarAction('profile')">
          <img src="../assets/profile.svg" alt="Perfil" class="sidebar__icon">
          <span class="sidebar__label">Editar Perfil</span>
        </button>
      </nav>

      <button class="sidebar__settings" @click="handleSidebarAction('settings')">
        <img src="../assets/config.svg" alt="Configurações" class="sidebar__icon">
      </button>
    </aside>

    
    <div class="overlay" :class="{ active: sidebarOpen }" @click="closeSidebar"></div>

 
    <main class="main-content">
   
      <header class="header">
        <div class="header__top">
          <button class="header__menu-toggle" @click="toggleSidebar">
            <img src="../assets/nav-bar-icon.svg" alt="Menu" class="header__menu-icon">
          </button>

          <div class="header__logo-container">
            <img src="../assets/logo.svg" alt="DriveZ" class="header__logo">
          </div>

          <div class="header__spacer"></div>
        </div>

        <div class="header__bottom">
          <div class="header__search-wrapper">
            <div class="header__search">
              <input 
                type="text" 
                class="header__search-input" 
                placeholder="Buscar serviços"
                v-model="searchQuery"
                @input="filterServices"
              >
              <div class="header__search-divider">
              <button class="header__search-btn">
                <img src="../assets/lupa.svg" alt="Buscar" class="header__search-icon">
              </button>
              </div>
            </div>

            <button class="header__refresh" @click="refreshServices">
              <img src="../assets/Refresh.svg" alt="Atualizar" class="header__refresh-icon">
            </button>
          </div>
        </div>
      </header>

     
      <section class="services">
        <div class="services__container">
          <div class="services__grid">
            <div 
              v-for="service in filteredServices" 
              :key="service.id"
              class="service-card"
              @click="handleServiceClick(service)"
            >
              <img :src="service.image" :alt="service.title" class="service-card__image">
              <div class="service-card__content">
                <div class="service-card__header">
                  <h3 class="service-card__title">{{ service.title }}</h3>
                  <div class="service-card__rating">
                    <span v-for="i in 5" :key="i" class="service-card__star">
                      {{ i <= service.rating ? '★' : '☆' }}
                    </span>
                  </div>
                </div>
                <p class="service-card__description">{{ service.description }}</p>
                <div class="service-card__location">
                  <span>{{ service.location }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

  
      <button class="call-button" @click="handleCallButtonClick">
        <span>SOCORRO</span>
      </button>
    </main>
  </div>
</template>

<script>
export default {
  name: 'HomeCliente',
  data() {
    return {
      sidebarOpen: false,
      searchQuery: '',
      services: [
      {
      id: 1,
     title: "RIMBERIO - GUINCHO",
      description: "Eu ofereço um serviço de guincho rápido, seguro e disponível 24 horas.",
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=200&h=200", 
     rating: 4,
     location: "Cotia - SP"
     },
     {
      id: 2,
     title: "RIMBERIO - GUINCHO",
      description: "Eu ofereço um serviço de guincho rápido, seguro e disponível 24 horas.",
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=200&h=200", 
     rating: 4,
     location: "Cotia - SP"
     },
     {
      id: 3,
     title: "RIMBERIO - GUINCHO",
      description: "Eu ofereço um serviço de guincho rápido, seguro e disponível 24 horas.",
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=200&h=200", 
     rating: 4,
     location: "Cotia - SP"
     },
     {
      id: 4,
     title: "RIMBERIO - GUINCHO",
      description: "Eu ofereço um serviço de guincho rápido, seguro e disponível 24 horas.",
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=200&h=200", 
     rating: 4,
     location: "Cotia - SP"
     },
     {
      id: 5,
     title: "Claudio - GUINCHO",
      description: "Eu ofereço um serviço de guincho rápido, seguro e disponível 24 horas.",
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=200&h=200", 
     rating: 4,
     location: "Cotia - SP"
     },
     {
      id: 6,
     title: "RIMBERIO - GUINCHO",
      description: "Eu ofereço um serviço de guincho rápido, seguro e disponível 24 horas.",
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=200&h=200", 
     rating: 4,
     location: "Cotia - SP"
     },
     {
      id: 7,
     title: "RIMBERIO - GUINCHO",
      description: "Eu ofereço um serviço de guincho rápido, seguro e disponível 24 horas.",
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=200&h=200", 
     rating: 4,
     location: "Cotia - SP"
     },
     {
      id: 8,
     title: "RIMBERIO - GUINCHO",
      description: "Eu ofereço um serviço de guincho rápido, seguro e disponível 24 horas.",
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=200&h=200", 
     rating: 1,
     location: "Cotia - SP"
     },
     {
      id: 9,
     title: "RIMBERIO - GUINCHO",
      description: "Eu ofereço um serviço de guincho rápido, seguro e disponível 24 horas.",
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=200&h=200", 
     rating: 1,
     location: "Cotia - SP"
     },
     {
      id: 10,
     title: "RIMBERIO - GUINCHO",
      description: "Eu ofereço um serviço de guincho rápido, seguro e disponível 24 horas.",
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=200&h=200", 
     rating: 1,
     location: "Cotia - SP"
     },{
      id: 11,
     title: "RIMBERIO - GUINCHO",
      description: "Eu ofereço um serviço de guincho rápido, seguro e disponível 24 horas.",
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=200&h=200", 
     rating: 1,
     location: "Cotia - SP"
     }
     ,{
      id: 12,
     title: "RIMBERIO - GUINCHO",
      description: "Eu ofereço um serviço de guincho rápido, seguro e disponível 24 horas.",
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=200&h=200", 
     rating: 1,
     location: "Cotia - SP"
     }
    
      ]
    };
  },
  computed: {
    filteredServices() {
      if (!this.searchQuery.trim()) {
        return this.services;
      }
      
      return this.services.filter(service =>
        service.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        service.location.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    closeSidebar() {
      this.sidebarOpen = false;
    },
    openSidebar() {
      this.sidebarOpen = true;
    },
    handleSidebarAction(action) {
      console.log('Action:', action);
      this.closeSidebar();
      
      
    },
    handleServiceClick(service) {
      console.log('Service clicked:', service);
     
      this.$emit('service-selected', service);
    },
    handleCallButtonClick() {
      console.log('Emergency button pressed');
      
      this.$emit('emergency-call');
    },
    filterServices() {
      
    },
    refreshServices() {
      console.log('Services refreshed');
     
    }
  },
  mounted() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.sidebarOpen) {
        this.closeSidebar();
      }
    });
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-container {
  display: flex;
  width: 100%;
  height: 100vh;
  background-color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}


.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 280px;
  height: 100vh;
  background: linear-gradient(135deg, #E63946 0%, #D62828 100%);
  color: white;
  padding: 24px 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar.active {
  transform: translateX(0);
}

.sidebar__header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
}

.sidebar__logo {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.sidebar__title {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 1px;
}

.sidebar__contact {
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  padding-bottom: 24px;
  margin-bottom: 32px;
}

.sidebar__phone {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.sidebar__location {
  font-size: 14px;
  opacity: 0.9;
}

.sidebar__menu {
  display: flex;
  flex-direction: column;
  gap: 0;
  flex: 1;
  list-style: none;
}

.sidebar__item {
  display: flex;
  align-items: center;
  gap: 16px;
  background: none;
  border: none;
  color: white;
  padding: 16px 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.2s ease;
  border-radius: 8px;
}

.sidebar__item:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.sidebar__icon {
  width: 24px;
  height: 24px;
}


.sidebar__label {
  flex: 1;
  text-align: left;
}

.sidebar__settings {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.sidebar__settings:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.sidebar__settings .sidebar__icon {
  width: 28px;
  height: 28px;
}


.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.overlay.active {
  opacity: 1;
  pointer-events: auto;
}


.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
}


.header {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
}

.header__top,
.header__bottom {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.header__top {
  justify-content: space-arround;
}

.header__bottom {
  justify-content: center;
}

.header__search-wrapper {
  position: relative;
  width: 100%;
  max-width: 760px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header__search {
  margin: 0 auto;
}

.header_divider {
  width: 1px;
  height: 24px;
  gap: 14px;
  background-color: #e0e0e0;
}

.header__menu-toggle, 

.header__refresh {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header__menu-toggle {
  padding: 15px;
  min-width: 52px;
  min-height: 52px;
  align-self: flex-start;
  
}
.header__menu-toggle img{
  width: 50px;
  height: 50px;
}

.header__refresh {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}


.header__refresh-icon {
  width: 34px;
  height: 34px;
}


.header__logo {
  height: 170px;
  width: 350px;
}

.header__search {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border: 2px solid #e0e0e0;
  border-radius: 28px;
  padding: 10px 18px;
  width: 100%;
  max-width: 560px;
  gap: 10px;
  transition: border-color 0.2s ease;
}



.header__search-input {
  flex: 1;
  background: none;
  border: none;
  font-size: 14px;
  outline: none;
  color: #000000;
}

.header__search-input::placeholder {
  color: #999;
}

.header__search-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header__search-icon {
  width: 20px;
  height: 20px;
}

.header__refresh {
  background: none;
  border: none;
  cursor: pointer;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header__refresh-icon {
  width: 32px;
  height: 32px;
}

.header__menu-hamburger {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}


.services {
  flex: 1;
  padding: 32px 24px;
  overflow-y: auto;
}

.services__container {
  max-width: 1520px;
  margin: 0 auto;
}

.services__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(460px, 1fr));
  gap: 24px;
  justify-content: center;
}

@media (max-width: 1220px) {
  .services__grid {
    grid-template-columns: repeat(2, minmax(360px, 1fr));
  }
}

.service-card {
  background: white;
  border: 1px solid #6D6D6D;  
  border-radius: 20px;
  padding: 18px 20px;
  display: flex;
  align-items: flex-start;
  gap: 24px;
  transition: all 0.3s ease;
  cursor: pointer;
  
}

.service-card:hover {
  border-color: black;
  box-shadow: 0 8px 16px rgba(45, 44, 44, 0.15);
  transform: translateY(-2px);
}

.service-card__image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.service-card__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.service-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.service-card__title {
  font-size: 14px;
  font-weight: 700;
  color: #E63946;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100% - 72px);
}

.service-card__description {
  font-size: 13px;
  color: #4F4F4F;
  line-height: 1.5;
}

.service-card__rating {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.service-card__star {
  color: #FFC107;
  font-size: 14px;
}

.service-card__location {
  position: relative;
  padding-left: 12px;
  font-size: 12px;
  color: #27AE60;
}

.service-card__location::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #27AE60;
}

.call-button {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  width: min(420px, calc(100% - 120px));
  min-height: 72px;
  padding: 0 40px;
  background: #E63946;
  color: white;
  border: none;
  border-radius: 18px;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  z-index: 100;
}

.call-button:hover {
  transform: translateX(-50%) scale(1.02);
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.16);
}

.call-button:active {
  transform: translateX(-50%) scale(0.98);
}

@media (max-width: 1024px) {
  .services__grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .header {
    gap: 12px;
    padding: 12px 16px;
  }

  .header__search {
    max-width: 250px;
  }

  .services {
    padding: 20px 16px;
  }

  .services__grid {
    gap: 16px;
    grid-template-columns: 1fr;
  }

  .call-button {
    width: 64px;
    height: 64px;
    bottom: 20px;
    right: 20px;
  }
}

@media (max-width: 480px) {
  .header__search {
    display: none;
  }

  .header__logo {
    height: 32px;
  }

  .services {
    padding: 16px;
  }

  .call-button {
    width: 56px;
    height: 56px;
    padding: 0;
    bottom: 12px;
    right: 12px;
  }
}
</style>
