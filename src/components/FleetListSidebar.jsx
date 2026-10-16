import React, { useState } from 'react';
import { IconTruck, IconCar, IconVan, IconNavigation, IconChevronRight, IconMapPin } from './Icons';

export function FleetListSidebar({
  vehicles,
  selectedVehicle,
  onSelectVehicle,
  onCenterVehicle,
  zoomLevel,
  activeState
}) {
  const [collapsed, setCollapsed] = useState(false);
  const isMicro = zoomLevel >= 6;

  const getVehicleIcon = (cat) => {
    switch (cat) {
      case 'truck': return <IconTruck size={15} color="#38bdf8" />;
      case 'van': return <IconVan size={15} color="#818cf8" />;
      default: return <IconCar size={15} color="#34d399" />;
    }
  };

  const getStatusDot = (st) => {
    switch (st) {
      case 'in_transit': return 'dot-emerald';
      case 'parked': return 'dot-indigo';
      case 'depot': return 'dot-purple';
      case 'maintenance': return 'dot-amber';
      default: return 'dot-slate';
    }
  };

  return (
    <aside className={`fleet-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-title-group">
          <span className="sidebar-title">
            {isMicro 
              ? `Veículos em ${activeState ? activeState.name : 'Área Visível'}` 
              : 'Estados do Brasil'}
          </span>
          <span className="sidebar-count-badge">
            {vehicles.length}
          </span>
        </div>

        <button 
          id="btn-toggle-sidebar"
          className="btn-toggle-sidebar"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expandir lista' : 'Recolher lista'}
        >
          <IconChevronRight size={16} className={collapsed ? '' : 'rotate-180'} />
        </button>
      </div>

      {!collapsed && (
        <div className="sidebar-list-content">
          {!isMicro ? (
            <div className="sidebar-macro-info">
              <p>O mapa está na <strong>Visão Macro</strong>.</p>
              <p>Clique em um estado no mapa ou selecione no filtro para listar e detalhar os veículos na rua.</p>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="sidebar-empty">
              <span>Nenhum veículo encontrado com os filtros atuais.</span>
            </div>
          ) : (
            vehicles.map((v) => {
              const isSelected = selectedVehicle?.id === v.id;
              return (
                <div
                  key={v.id}
                  className={`fleet-item-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    onSelectVehicle(v);
                    onCenterVehicle(v.lat, v.lng);
                  }}
                >
                  <div className="item-top">
                    <div className="item-plate-group">
                      <span className={`status-mini-dot ${getStatusDot(v.status)}`} />
                      <span className="item-plate">{v.plate}</span>
                      <span className="item-category-icon">{getVehicleIcon(v.category)}</span>
                    </div>
                    <span className="item-speed">
                      {v.speed > 0 ? `${v.speed} km/h` : '0 km/h'}
                    </span>
                  </div>

                  <div className="item-model">{v.model}</div>

                  <div className="item-address">
                    <IconMapPin size={12} color="#64748b" className="inline-icon" />
                    <span>{v.address}</span>
                  </div>

                  <div className="item-footer">
                    <span className="item-driver">{v.driver}</span>
                    <button
                      className="btn-item-focus"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectVehicle(v);
                        onCenterVehicle(v.lat, v.lng);
                      }}
                      title="Focar no mapa"
                    >
                      <IconNavigation size={12} />
                      <span>Focar</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </aside>
  );
}
