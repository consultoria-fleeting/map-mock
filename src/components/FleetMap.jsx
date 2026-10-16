import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { BRAZIL_STATES } from '../data/brazilStates';
import { clusterVehicles } from '../utils/clustering';
import { fetchVehiclesByState, fetchVehiclesByMultipleStates } from '../data/mockTelemetryApi';

const TILE_CONFIGS = {
  osm: {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  },
  dark: {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors (CSS Dark)',
    maxZoom: 19
  },
  osmfr: {
    url: 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abc',
    maxZoom: 19
  }
};

// Funções auxiliares para detecção espacial dos estados na visão atual
function getStatesInViewport(map) {
  if (!map) return [];
  const bounds = map.getBounds();
  return BRAZIL_STATES.filter((st) => {
    const stBounds = L.latLngBounds(st.bounds[0], st.bounds[1]);
    return bounds.intersects(stBounds) || bounds.contains([st.lat, st.lng]);
  });
}

function getNearestState(map) {
  if (!map) return null;
  const center = map.getCenter();
  let nearest = null;
  let minDistance = Infinity;

  for (const st of BRAZIL_STATES) {
    const dist = Math.hypot(st.lat - center.lat, st.lng - center.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = st;
    }
  }

  return nearest;
}

export function FleetMap({
  tileStyle,
  zoomLevel,
  setZoomLevel,
  selectedState,
  setSelectedState,
  onSelectVehicle,
  searchQuery,
  selectedStatus,
  selectedCategory,
  onVisibleCountChange,
  mapCenterTrigger
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const macroLayerRef = useRef(null);
  const microLayerRef = useRef(null);
  const stateBoundariesLayerRef = useRef(null);

  // Armazena veículos já baixados por estado via GET
  const [loadedVehicles, setLoadedVehicles] = useState([]);
  const [isLoadingTelemetry, setIsLoadingTelemetry] = useState(false);
  const [activeUfInFocus, setActiveUfInFocus] = useState(null);

  // Inicialização única do Leaflet
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const leafletLib = L || window.L;
    if (!leafletLib) {
      console.error('Leaflet não foi encontrado');
      return;
    }

    // Centro geográfico do Brasil
    const initialCenter = [-14.235, -51.925];
    const initialZoom = 4;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      minZoom: 3,
      maxZoom: 19,
      zoomControl: false // usamos nossos controles customizados
    });

    // Camada de Tiles (100% OpenStreetMap - Sem chaves de API nem custos)
    const cfg = TILE_CONFIGS[tileStyle] || TILE_CONFIGS.osm;
    const tileLayer = L.tileLayer(cfg.url, {
      attribution: cfg.attribution,
      subdomains: cfg.subdomains || 'abc',
      maxZoom: cfg.maxZoom,
      className: tileStyle === 'dark' ? 'leaflet-dark-tiles' : ''
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Camadas de marcadores
    stateBoundariesLayerRef.current = L.layerGroup().addTo(map);
    macroLayerRef.current = L.layerGroup().addTo(map);
    microLayerRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    // Força cálculo de dimensões de tela do mapa
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    // Listeners de evento de zoom e movimento
    const handleMapMovementOrZoom = () => {
      const z = map.getZoom();
      setZoomLevel(z);

      const nearest = getNearestState(map);
      if (nearest) {
        setActiveUfInFocus(nearest.uf);
        // Quando o usuário der zoom-in (z >= 6), detecta e sincroniza o estado sob a visão
        if (z >= 6) {
          setSelectedState(nearest);
        }
      }
    };

    map.on('zoomend', handleMapMovementOrZoom);
    map.on('moveend', handleMapMovementOrZoom);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Atualização da Camada de Tiles quando o usuário troca o estilo
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const cfg = TILE_CONFIGS[tileStyle] || TILE_CONFIGS.osm;
    tileLayerRef.current = L.tileLayer(cfg.url, {
      attribution: cfg.attribution,
      subdomains: cfg.subdomains || 'abc',
      maxZoom: cfg.maxZoom,
      className: tileStyle === 'dark' ? 'leaflet-dark-tiles' : ''
    }).addTo(map);
  }, [tileStyle]);

  // Carregamento reativo de telemetria dos veículos via GET quando usuário entra no modo MICRO (zoom >= 6)
  useEffect(() => {
    const isMicro = zoomLevel >= 6;
    if (!isMicro) return;

    const map = mapInstanceRef.current;
    // Pega todos os estados que estão visíveis no campo de visão (viewport)
    const visibleStates = getStatesInViewport(map);
    let ufsToLoad = visibleStates.map((s) => s.uf);

    if (ufsToLoad.length === 0) {
      ufsToLoad = [selectedState?.uf || activeUfInFocus || 'SP'];
    }

    let isMounted = true;
    setIsLoadingTelemetry(true);

    fetchVehiclesByMultipleStates(ufsToLoad)
      .then((data) => {
        if (!isMounted) return;
        setLoadedVehicles(data);
        setIsLoadingTelemetry(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar telemetria diária:', err);
        if (isMounted) setIsLoadingTelemetry(false);
      });

    return () => {
      isMounted = false;
    };
  }, [zoomLevel, selectedState, activeUfInFocus]);

  // Efeito para centralizar mapa em coordenadas arbitrárias
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapCenterTrigger) return;

    map.flyTo([mapCenterTrigger.lat, mapCenterTrigger.lng], mapCenterTrigger.zoom || 17, {
      duration: 1.1
    });
  }, [mapCenterTrigger]);

  // Renderização dos Marcadores (Macro vs Micro com Clustering)
  const renderMapLayers = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const isMicro = zoomLevel >= 6;

    // 1. MODO MACRO (Zoom < 6): Exibe estados do Brasil com contagem de veículos
    if (!isMicro) {
      if (microLayerRef.current) microLayerRef.current.clearLayers();
      if (macroLayerRef.current) macroLayerRef.current.clearLayers();
      if (stateBoundariesLayerRef.current) stateBoundariesLayerRef.current.clearLayers();

      BRAZIL_STATES.forEach((st) => {
        // Marcador em forma de badge/bolinha com contagem de veículos
        const customIcon = L.divIcon({
          className: 'macro-state-marker-container',
          html: `
            <div class="macro-state-bubble" data-uf="${st.uf}">
              <div class="bubble-uf">${st.uf}</div>
              <div class="bubble-count">${st.vehicleCount >= 1000 ? (st.vehicleCount / 1000).toFixed(1) + 'k' : st.vehicleCount}</div>
              <div class="bubble-pulse"></div>
            </div>
          `,
          iconSize: [54, 54],
          iconAnchor: [27, 27]
        });

        const marker = L.marker([st.lat, st.lng], { icon: customIcon });

        // Tooltip informativo
        marker.bindTooltip(
          `<div class="state-tooltip">
            <strong>${st.name} (${st.uf})</strong><br/>
            <span>Frota: ${st.vehicleCount.toLocaleString('pt-BR')} veículos</span><br/>
            <small style="color: #38bdf8;">Clique para dar zoom-in</small>
          </div>`,
          { direction: 'top', offset: [0, -28] }
        );

        // Ao clicar no estado, realiza zoom-in e ativa o modo micro
        marker.on('click', () => {
          setSelectedState(st);
          map.flyToBounds(st.bounds, {
            duration: 1.2,
            padding: [40, 40]
          });
        });

        macroLayerRef.current.addLayer(marker);
      });

      onVisibleCountChange(
        BRAZIL_STATES.reduce((acc, curr) => acc + curr.vehicleCount, 0)
      );

      return;
    }

    // 2. MODO MICRO (Zoom >= 8): Exibe veículos nas ruas com inteligência de densidade / clustering
    if (macroLayerRef.current) macroLayerRef.current.clearLayers();
    if (microLayerRef.current) microLayerRef.current.clearLayers();

    // Filtra os veículos carregados de acordo com os filtros de UI
    let filtered = loadedVehicles.filter((v) => {
      // Filtro de Busca (Placa, Motorista, Modelo, Endereço)
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesPlate = v.plate.toLowerCase().includes(q);
        const matchesDriver = v.driver.toLowerCase().includes(q);
        const matchesModel = v.model.toLowerCase().includes(q);
        const matchesAddress = v.address.toLowerCase().includes(q);
        if (!matchesPlate && !matchesDriver && !matchesModel && !matchesAddress) {
          return false;
        }
      }

      // Filtro de Status
      if (selectedStatus !== 'all' && v.status !== selectedStatus) {
        return false;
      }

      // Filtro de Categoria
      if (selectedCategory !== 'all' && v.category !== selectedCategory) {
        return false;
      }

      return true;
    });

    onVisibleCountChange(filtered.length);

    // Agrupamento Inteligente (Clustering) para evitar lag em capitais densas
    const clustersAndSingles = clusterVehicles(filtered, zoomLevel, 60);

    clustersAndSingles.forEach((item) => {
      if (item.isCluster) {
        // Renderiza Marcador de Cluster Inteligente
        const clusterSize = item.count > 100 ? 56 : item.count > 30 ? 48 : 40;
        const clusterIcon = L.divIcon({
          className: 'custom-cluster-marker',
          html: `
            <div class="cluster-bubble status-${item.dominantStatus}" style="width: ${clusterSize}px; height: ${clusterSize}px;">
              <span class="cluster-count">${item.count}</span>
              <span class="cluster-ring"></span>
            </div>
          `,
          iconSize: [clusterSize, clusterSize],
          iconAnchor: [clusterSize / 2, clusterSize / 2]
        });

        const clusterMarker = L.marker([item.lat, item.lng], { icon: clusterIcon });

        clusterMarker.bindTooltip(
          `<div class="cluster-tooltip">
            <strong>${item.count} Veículos nesta região</strong><br/>
            <span>• Em rota: ${item.statusCounts.in_transit}</span><br/>
            <span>• Parados: ${item.statusCounts.parked + item.statusCounts.depot}</span><br/>
            <small style="color: #38bdf8;">Clique para expandir</small>
          </div>`,
          { direction: 'top', offset: [0, -clusterSize / 2] }
        );

        clusterMarker.on('click', () => {
          map.flyToBounds(item.bounds, {
            duration: 0.8,
            padding: [50, 50],
            maxZoom: Math.min(map.getZoom() + 3, 17)
          });
        });

        microLayerRef.current.addLayer(clusterMarker);
      } else {
        // Renderiza Veículo Individual na Rua com Orientação e Categoria
        const vehicle = item.data;
        const colorClass = `status-${vehicle.status}`;
        const isStreetZoom = zoomLevel >= 15;

        // Ícone customizado de veículo
        const vehicleIcon = L.divIcon({
          className: 'street-vehicle-marker-wrapper',
          html: `
            <div class="vehicle-pin ${colorClass} ${isStreetZoom ? 'street-zoom-pin' : ''}">
              <div class="vehicle-pin-body" style="transform: rotate(${vehicle.heading}deg);">
                <div class="vehicle-heading-arrow"></div>
                <div class="vehicle-center-dot"></div>
              </div>
              ${isStreetZoom ? `<div class="vehicle-plate-pill">${vehicle.plate}</div>` : ''}
            </div>
          `,
          iconSize: isStreetZoom ? [44, 44] : [32, 32],
          iconAnchor: isStreetZoom ? [22, 22] : [16, 16]
        });

        const vehicleMarker = L.marker([vehicle.lat, vehicle.lng], { icon: vehicleIcon });

        // Tooltip ao passar o mouse
        vehicleMarker.bindTooltip(
          `<div class="vehicle-tooltip">
            <div class="tooltip-header">
              <span class="tooltip-plate">${vehicle.plate}</span>
              <span class="tooltip-speed">${vehicle.speed} km/h</span>
            </div>
            <div class="tooltip-model">${vehicle.model}</div>
            <div class="tooltip-address">${vehicle.address}</div>
            <div class="tooltip-driver">Condutor: ${vehicle.driver}</div>
          </div>`,
          { direction: 'top', offset: [0, -18] }
        );

        // Ao clicar no veículo, abre o Drawer lateral com a telemetria completa
        vehicleMarker.on('click', () => {
          onSelectVehicle(vehicle);
        });

        microLayerRef.current.addLayer(vehicleMarker);
      }
    });
  }, [
    zoomLevel,
    loadedVehicles,
    searchQuery,
    selectedStatus,
    selectedCategory,
    onVisibleCountChange,
    onSelectVehicle,
    setSelectedState
  ]);

  // Re-renderiza marcadores quando os filtros ou dados mudam
  useEffect(() => {
    renderMapLayers();
  }, [renderMapLayers]);

  return (
    <div className="fleet-map-wrapper">
      {/* Contêiner onde o Leaflet renderiza */}
      <div 
        ref={mapContainerRef} 
        id="map-container"
        className="leaflet-map-canvas"
      />

      {/* Alerta Visual de Carregamento da Telemetria GET */}
      {isLoadingTelemetry && (
        <div className="telemetry-loading-toast">
          <div className="spinner-border" />
          <div className="toast-text">
            <strong>Requisitando GET diário...</strong>
            <span>Baixando coordenadas LAT/LNG dos veículos</span>
          </div>
        </div>
      )}

      {/* Dica de Usabilidade de Transição Zoom */}
      <div className="zoom-hint-banner">
        {zoomLevel < 6 ? (
          <span>
            📍 <strong>Visão Macro (Estados):</strong> Dê zoom-in ou clique em um estado para ver os veículos nas ruas.
          </span>
        ) : (
          <span>
            🗺️ <strong>Visão Micro (Ruas):</strong> Zoom atual: {Math.round(zoomLevel)}. Mostrando veículos nas vias públicas.
          </span>
        )}
      </div>
    </div>
  );
}
