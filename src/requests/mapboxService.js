import mapboxgl from 'mapbox-gl';

export class MapboxService {
  constructor() {
    this.map = null;
  }

  initMap(containerId, originCoords, destinationCoords, onRouteCalculated) {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

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

      // Passa o callback para a função que calcula a rota
      this.drawRoute(originCoords, destinationCoords, onRouteCalculated);
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

  destroyMap() {
    if (this.map) {
      this.map.remove();
    }
  }
}