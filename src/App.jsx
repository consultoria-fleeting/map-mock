import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { FleetMap } from './components/FleetMap';
import { MapControls } from './components/MapControls';
import { FleetListSidebar } from './components/FleetListSidebar';
import { VehicleDrawer } from './components/VehicleDrawer';
import { BRAZIL_STATES, TOTAL_FLEET_VEHICLES } from './data/brazilStates';
import { simulateNewDailySnapshot, generateVehiclesForState } from './data/mockTelemetryApi';

export default function App() {
  const [zoomLevel, setZoomLevel] = useState(4);
  const [tileStyle, setTileStyle] = useState('osm');
  const [selectedState, setSelectedState] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('07/10/2026 às 06:45 (Diário)');
  const [visibleCount, setVisibleCount] = useState(TOTAL_FLEET_VEHICLES);
  const [mapCenterTrigger, setMapCenterTrigger] = useState(null);

  // Totais agregados calculados para a barra de topo
  const stats = useMemo(() => {
    return {
      inTransit: Math.round(TOTAL_FLEET_VEHICLES * 0.48),
      parked: Math.round(TOTAL_FLEET_VEHICLES * 0.44),
      maintenance: Math.round(TOTAL_FLEET_VEHICLES * 0.08)
    };
  }, []);

  // Lista de veículos amostrais do estado selecionado ou SP (padrão) para o sidebar
  const currentSidebarVehicles = useMemo(() => {
    const targetState = selectedState || BRAZIL_STATES.find(s => s.uf === 'SP');
    const vehicles = generateVehiclesForState(targetState, 50);

    return vehicles.filter(v => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!v.plate.toLowerCase().includes(q) && 
            !v.driver.toLowerCase().includes(q) &&
            !v.model.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (selectedStatus !== 'all' && v.status !== selectedStatus) return false;
      if (selectedCategory !== 'all' && v.category !== selectedCategory) return false;
      return true;
    });
  }, [selectedState, searchQuery, selectedStatus, selectedCategory]);

  // Simulação de novo payload diário com posições atualizadas
  const handleTriggerDailySync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const result = simulateNewDailySnapshot();
      setLastSyncTime(`Hoje às ${result.syncTimestamp} (GET OK)`);
      setIsSyncing(false);
    }, 1200);
  };

  // Reseta visualização para o Brasil completo
  const handleResetToBrazil = () => {
    setSelectedState(null);
    setMapCenterTrigger({
      lat: -14.235,
      lng: -51.925,
      zoom: 4
    });
  };

  // Centraliza no veículo no mapa
  const handleCenterOnVehicle = (lat, lng) => {
    setMapCenterTrigger({
      lat,
      lng,
      zoom: 17
    });
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 1, 19));
    setMapCenterTrigger(prev => ({
      lat: prev?.lat || -23.5505,
      lng: prev?.lng || -46.6333,
      zoom: Math.min((prev?.zoom || zoomLevel) + 1, 19)
    }));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 1, 3));
    setMapCenterTrigger(prev => ({
      lat: prev?.lat || -14.235,
      lng: prev?.lng || -51.925,
      zoom: Math.max((prev?.zoom || zoomLevel) - 1, 3)
    }));
  };

  return (
    <div className="app-layout">
      {/* Barra de Topo com KPIs e Status do GET diário */}
      <Header
        totalVehicles={TOTAL_FLEET_VEHICLES}
        stats={stats}
        isSyncing={isSyncing}
        onTriggerDailySync={handleTriggerDailySync}
        lastSyncTime={lastSyncTime}
        zoomLevel={zoomLevel}
        activeState={selectedState}
      />

      {/* Barra de Busca e Filtros Avançados */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedState={selectedState}
        onStateSelect={(st) => {
          setSelectedState(st);
          if (st) {
            setMapCenterTrigger({
              lat: st.lat,
              lng: st.lng,
              zoom: st.zoom || 8
            });
          } else {
            handleResetToBrazil();
          }
        }}
        visibleCount={visibleCount}
        totalCount={TOTAL_FLEET_VEHICLES}
        zoomLevel={zoomLevel}
      />

      {/* Área Central: Mapa e Painel Lateral */}
      <main className="main-content-area">
        <FleetMap
          tileStyle={tileStyle}
          zoomLevel={zoomLevel}
          setZoomLevel={setZoomLevel}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          onSelectVehicle={setSelectedVehicle}
          searchQuery={searchQuery}
          selectedStatus={selectedStatus}
          selectedCategory={selectedCategory}
          onVisibleCountChange={setVisibleCount}
          mapCenterTrigger={mapCenterTrigger}
        />

        {/* Controles Flutuantes do Mapa */}
        <MapControls
          currentTileLayer={tileStyle}
          onTileLayerChange={setTileStyle}
          zoomLevel={zoomLevel}
          onResetToBrazil={handleResetToBrazil}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
        />

        {/* Sidebar com Lista Rápida de Veículos */}
        <FleetListSidebar
          vehicles={currentSidebarVehicles}
          selectedVehicle={selectedVehicle}
          onSelectVehicle={setSelectedVehicle}
          onCenterVehicle={handleCenterOnVehicle}
          zoomLevel={zoomLevel}
          activeState={selectedState}
        />
      </main>

      {/* Drawer Lateral com Telemetria e Posição Específica na Rua */}
      {selectedVehicle && (
        <VehicleDrawer
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
          onCenterOnMap={handleCenterOnVehicle}
        />
      )}
    </div>
  );
}
