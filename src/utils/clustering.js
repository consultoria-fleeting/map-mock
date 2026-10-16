/**
 * Algoritmo de Clustering Espacial em Grade (Grid-based Spatial Clustering)
 * Otimizado para processar milhares de pontos em milissegundos sem travar o navegador.
 */

// Converte latitude/longitude em coordenadas de projeção esférica de Mercator normalizadas (0 a 1)
function latLngToPoint(lat, lng) {
  const sin = Math.sin((lat * Math.PI) / 180);
  const y = 0.5 - (0.25 * Math.log((1 + sin) / (1 - sin))) / Math.PI;
  const x = (lng + 180) / 360;
  return { x, y };
}

/**
 * Agrupa veículos próximos com base no nível de zoom atual e raio de agrupamento em pixels
 * @param {Array} vehicles Lista de veículos com { lat, lng }
 * @param {number} zoom Nível de zoom do Leaflet (ex: 4 a 18)
 * @param {number} radius Raio de cluster em pixels (padrão: 60)
 * @returns {Array} Array misto de clusters e veículos individuais
 */
export function clusterVehicles(vehicles, zoom, radius = 55) {
  if (!vehicles || vehicles.length === 0) return [];
  
  // Em zoom muito detalhado (nível de rua: zoom >= 15), desativa clustering para mostrar cada veículo na sua rua
  if (zoom >= 15) {
    return vehicles.map(v => ({
      isCluster: false,
      data: v,
      lat: v.lat,
      lng: v.lng
    }));
  }

  // Tamanho do mundo em pixels neste zoom (256 * 2^zoom)
  const worldSize = 256 * Math.pow(2, zoom);
  const gridSize = radius; // tamanho da célula em pixels

  // Dicionário de células da grade: "col_row" -> Cluster
  const grid = new Map();

  for (let i = 0; i < vehicles.length; i++) {
    const v = vehicles[i];
    const { x, y } = latLngToPoint(v.lat, v.lng);
    const pixelX = x * worldSize;
    const pixelY = y * worldSize;

    const col = Math.floor(pixelX / gridSize);
    const row = Math.floor(pixelY / gridSize);
    const key = `${col}_${row}`;

    let cell = grid.get(key);
    if (!cell) {
      cell = {
        col,
        row,
        vehicles: [],
        sumLat: 0,
        sumLng: 0,
        statusCounts: {
          in_transit: 0,
          parked: 0,
          depot: 0,
          maintenance: 0
        }
      };
      grid.set(key, cell);
    }

    cell.vehicles.push(v);
    cell.sumLat += v.lat;
    cell.sumLng += v.lng;
    if (cell.statusCounts[v.status] !== undefined) {
      cell.statusCounts[v.status]++;
    }
  }

  const results = [];

  for (const cell of grid.values()) {
    const count = cell.vehicles.length;
    if (count === 1) {
      // Veículo isolado
      const singleVehicle = cell.vehicles[0];
      results.push({
        isCluster: false,
        data: singleVehicle,
        lat: singleVehicle.lat,
        lng: singleVehicle.lng
      });
    } else {
      // Cluster com múltiplos veículos
      const avgLat = cell.sumLat / count;
      const avgLng = cell.sumLng / count;
      
      // Calcula bounds do cluster para auto-zoom ao clicar
      let minLat = cell.vehicles[0].lat;
      let maxLat = cell.vehicles[0].lat;
      let minLng = cell.vehicles[0].lng;
      let maxLng = cell.vehicles[0].lng;

      for (let j = 1; j < count; j++) {
        const v = cell.vehicles[j];
        if (v.lat < minLat) minLat = v.lat;
        if (v.lat > maxLat) maxLat = v.lat;
        if (v.lng < minLng) minLng = v.lng;
        if (v.lng > maxLng) maxLng = v.lng;
      }

      results.push({
        isCluster: true,
        count,
        lat: avgLat,
        lng: avgLng,
        bounds: [[minLat, minLng], [maxLat, maxLng]],
        vehicles: cell.vehicles,
        statusCounts: cell.statusCounts,
        dominantStatus: getDominantStatus(cell.statusCounts)
      });
    }
  }

  return results;
}

function getDominantStatus(counts) {
  let max = -1;
  let dominant = 'in_transit';
  for (const [st, num] of Object.entries(counts)) {
    if (num > max) {
      max = num;
      dominant = st;
    }
  }
  return dominant;
}
