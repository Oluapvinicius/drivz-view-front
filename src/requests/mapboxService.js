import mapboxgl from 'mapbox-gl';

export class MapboxService {
  constructor() {
    this.map = null;
    this.markers = {};
  }

  initPresenterMap(containerId, initialCenter = [-46.6558, -23.5615]) {
    try {
      mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    } catch (e) {
      console.warn('VITE_MAPBOX_TOKEN não disponível');
    }

    if (!mapboxgl.accessToken) {
      console.error("⚠️ Token do Mapbox não encontrado. Verifique seu arquivo .env");
      return null;
    }

    this.map = new mapboxgl.Map({
      container: containerId,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: initialCenter,
      zoom: 13
    });

    this.map.on('load', () => {
      this.map.addControl(new mapboxgl.NavigationControl());
    });

    return this.map;
  }

  addMarker(id, lng, lat, options = {}) {
    if (!this.map) {
      console.warn('Mapa não inicializado');
      return null;
    }

    if (this.markers[id]) {
      this.markers[id].remove();
    }

    const defaultOptions = {
      color: '#0066CC',
      popupHTML: null,
      ...options
    };

    const marker = new mapboxgl.Marker({
      color: defaultOptions.color,
      anchor: 'bottom'
    });

    marker.setLngLat([lng, lat]).addTo(this.map);

    if (defaultOptions.popupHTML) {
      const popup = new mapboxgl.Popup({ offset: 40 }).setHTML(defaultOptions.popupHTML);
      marker.setPopup(popup);
    }

    this.markers[id] = marker;
    return marker;
  }

  removeMarker(id) {
    if (this.markers[id]) {
      this.markers[id].remove();
      delete this.markers[id];
    }
  }

  clearAllMarkers() {
    Object.keys(this.markers).forEach((id) => {
      this.removeMarker(id);
    });
  }

  fitToBounds(coordinates, options = {}) {
    if (!this.map || coordinates.length === 0) {
      console.warn('Mapa não inicializado ou sem coordenadas');
      return;
    }

    const bounds = new mapboxgl.LngLatBounds();

    coordinates.forEach((coord) => {
      bounds.extend(coord);
    });

    const defaultOptions = {
      padding: { top: 100, bottom: 150, left: 100, right: 100 },
      duration: 1500,
      maxZoom: 16,
      ...options
    };

    this.map.fitBounds(bounds, defaultOptions);
  }

  // COLOQUE ESTE MÉTODO LOGO ABAIXO DO SEU initMap ATUAL:
  initMap(containerId, originCoords, destinationCoords, onRouteCalculated) {
    try {
      mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    } catch (e) {
      console.warn('VITE_MAPBOX_TOKEN não disponível');
    }

    if (!mapboxgl.accessToken) {
      console.error("⚠️ Token do Mapbox não encontrado. Verifique seu arquivo .env");
      return;
    }

    this.map = new mapboxgl.Map({
      container: containerId,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: originCoords,
      zoom: 14
    });

    this.map.on('load', () => {
      this.fitMapToPoints(originCoords, destinationCoords);

      // --- ADICIONADO: Insere os marcadores visuais de Origem e Destino automaticamente ---
      this.addMarker('ponto-origem', originCoords[0], originCoords[1], { color: '#2563eb' }); // Azul para Origem
      this.addMarker('ponto-destino', destinationCoords[0], destinationCoords[1], { color: '#dc2626' }); // Vermelho para Destino

      this.drawRoute(originCoords, destinationCoords, onRouteCalculated);
    });

    return this.map;
  }

  initMapApenasOrigem(containerId, originCoords, onMapLoaded) {
    try {
      mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    } catch (e) {
      console.warn('VITE_MAPBOX_TOKEN não disponível');
    }

    if (!mapboxgl.accessToken) {
      console.error("⚠️ Token do Mapbox não encontrado. Verifique seu arquivo .env");
      return;
    }

    this.map = new mapboxgl.Map({
      container: containerId,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: originCoords,
      zoom: 15
    });

    this.map.on('load', () => {
      this.addMarker('ponto-origem', originCoords[0], originCoords[1], { color: '#2563eb' });
      
      if (typeof onMapLoaded === 'function') {
        onMapLoaded();
      }
    });

    return this.map;
  }

  fitMapToPoints(originCoords, destinationCoords) {
    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend(originCoords);
    bounds.extend(destinationCoords);

    this.map.fitBounds(bounds, {
      padding: { top: 70, bottom: 350, left: 70, right: 70 },
      duration: 1800
    });
  }

  async drawRoute(origin, destination, onRouteCalculated) {
    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!data.routes || data.routes.length === 0) {
        console.warn("Nenhuma rota encontrada.");
        return;
      }

      const primaryRoute = data.routes[0];
      const routeCoordinates = primaryRoute.geometry.coordinates;

      const durationInMinutes = Math.round(primaryRoute.duration / 60);
      const distanceInKm = (primaryRoute.distance / 1000).toFixed(1);

      if (typeof onRouteCalculated === 'function') {
        onRouteCalculated({
          tempo: `${durationInMinutes} min`,
          distancia: `${distanceInKm} km`
        });
      }

      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: routeCoordinates
        }
      };

      this.map.addSource('route', {
        type: 'geojson',
        data: geojson
      });

      this.map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#dc2626',
          'line-width': 5.5,
          'line-opacity': 0.9
        }
      });

      this.map.addLayer({
        id: 'route-casing',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#ffffff',
          'line-width': 8,
          'line-opacity': 0.4
        }
      }, 'route');

    } catch (error) {
      console.error('Erro ao processar o trajeto no Mapbox:', error);
    }
  }
  async forwardGeocode(address, proximityCoords = null) {
    try {
      const token = import.meta.env.VITE_MAPBOX_TOKEN;

      let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${token}`;

      url += `&country=br`;

      if (proximityCoords && Array.isArray(proximityCoords)) {
        url += `&proximity=${proximityCoords[0]},${proximityCoords[1]}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        return data.features[0].center; // Retorna [lng, lat]
      }
      return null;
    } catch (error) {
      console.error("Erro no forwardGeocode do MapboxService:", error);
      return null;
    }
  }

  destroyMap() {
    this.clearAllMarkers();
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}