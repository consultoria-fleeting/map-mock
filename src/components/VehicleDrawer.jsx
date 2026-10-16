import React, { useState } from 'react';
import { 
  IconX, IconMapPin, IconGauge, IconFuel, IconBattery, 
  IconClock, IconCalendar, IconTruck, IconCar, IconVan, 
  IconCopy, IconNavigation, IconShield, IconInfo 
} from './Icons';

export function VehicleDrawer({ vehicle, onClose, onCenterOnMap }) {
  const [copied, setCopied] = useState(false);

  if (!vehicle) return null;

  const handleCopyCoords = () => {
    const text = `${vehicle.lat}, ${vehicle.lng}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'in_transit':
        return <span className="status-pill pill-emerald">Em Rota / Trânsito</span>;
      case 'parked':
        return <span className="status-pill pill-indigo">Estacionado no Cliente</span>;
      case 'depot':
        return <span className="status-pill pill-purple">No Pátio / Garagem</span>;
      case 'maintenance':
        return <span className="status-pill pill-amber">Em Manutenção</span>;
      default:
        return <span className="status-pill">{status}</span>;
    }
  };

  const getVehicleIcon = (category) => {
    switch (category) {
      case 'truck': return <IconTruck size={20} color="#38bdf8" />;
      case 'van': return <IconVan size={20} color="#818cf8" />;
      default: return <IconCar size={20} color="#34d399" />;
    }
  };

  return (
    <div className="vehicle-drawer-overlay" onClick={onClose}>
      <aside 
        className="vehicle-drawer" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header da Placa / Modelo */}
        <div className="drawer-header">
          <div className="drawer-vehicle-title">
            <div className="plate-mercosul">
              <div className="plate-header">
                <span className="plate-country">BRASIL</span>
                <span className="plate-br-flag">🇧🇷</span>
              </div>
              <div className="plate-number">{vehicle.plate}</div>
            </div>

            <div className="vehicle-meta">
              <div className="model-name">{vehicle.model}</div>
              <div className="meta-sub">
                <span className="vehicle-category-badge">
                  {getVehicleIcon(vehicle.category)}
                  {vehicle.category === 'truck' ? 'Caminhão Pesado' : vehicle.category === 'van' ? 'Utilitário / Van' : 'Automóvel'}
                </span>
                <span className="bullet-sep">•</span>
                <span className="vehicle-id-tag">{vehicle.id}</span>
              </div>
            </div>
          </div>

          <button 
            id="btn-close-drawer"
            className="drawer-close-btn" 
            onClick={onClose}
            title="Fechar detalhes"
          >
            <IconX size={20} />
          </button>
        </div>

        {/* Status e Último Snapshot Diário */}
        <div className="drawer-section status-section">
          <div className="status-row">
            <div>
              <span className="field-label">ESTADO OPERACIONAL</span>
              <div className="mt-1">{getStatusBadge(vehicle.status)}</div>
            </div>
            <div className="text-right">
              <span className="field-label">TRANSMISSÃO TELEMETRIA</span>
              <div className="timestamp-badge">
                <IconClock size={13} color="#94a3b8" />
                <span>{vehicle.lastTransmission}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Localização Específica na Rua */}
        <div className="drawer-section location-section">
          <div className="section-title">
            <IconMapPin size={17} color="#38bdf8" />
            <span>Posição no Último GET (Nível de Rua)</span>
          </div>

          <div className="street-highlight-card">
            <div className="street-label">ENDEREÇO IDENTIFICADO</div>
            <div className="street-name">{vehicle.address}</div>
            
            <div className="coordinates-row">
              <div className="coords-text">
                <span className="coords-tag">LAT:</span> {vehicle.lat.toFixed(6)}
                <span className="coords-sep">|</span>
                <span className="coords-tag">LNG:</span> {vehicle.lng.toFixed(6)}
              </div>
              
              <button 
                id="btn-copy-coords"
                className={`btn-copy-coords ${copied ? 'copied' : ''}`}
                onClick={handleCopyCoords}
                title="Copiar coordenadas"
              >
                <IconCopy size={13} />
                <span>{copied ? 'Copiado!' : 'Copiar Lat/Lng'}</span>
              </button>
            </div>
          </div>

          <div className="osm-actions">
            <button 
              id="btn-center-vehicle"
              className="btn-action-primary"
              onClick={() => onCenterOnMap(vehicle.lat, vehicle.lng)}
            >
              <IconNavigation size={15} />
              <span>Centralizar neste Veículo no Mapa</span>
            </button>
            
            <a 
              href={`https://www.openstreetmap.org/?mlat=${vehicle.lat}&mlon=${vehicle.lng}#map=18/${vehicle.lat}/${vehicle.lng}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-action-secondary"
              title="Abrir no OpenStreetMap diretamente (sem Google Maps)"
            >
              <IconInfo size={15} />
              <span>Abrir no OpenStreetMap (Web)</span>
            </a>
          </div>
        </div>

        {/* Telemetria e Sensores de Bordo */}
        <div className="drawer-section">
          <div className="section-title">
            <IconGauge size={17} color="#38bdf8" />
            <span>Telemetria de Bordo e Odometria</span>
          </div>

          <div className="telemetry-grid">
            <div className="telemetry-card">
              <span className="card-label">VELOCIDADE ÚLTIMO GET</span>
              <div className="card-value-group">
                <span className="card-big-value">{vehicle.speed}</span>
                <span className="card-unit">km/h</span>
              </div>
              <span className="card-foot">
                {vehicle.speed > 0 ? 'Veículo em movimento' : 'Parado / Ignição ligada'}
              </span>
            </div>

            <div className="telemetry-card">
              <span className="card-label">ODÔMETRO ACUMULADO</span>
              <div className="card-value-group">
                <span className="card-big-value">{vehicle.odometer.toLocaleString('pt-BR')}</span>
                <span className="card-unit">km</span>
              </div>
              <span className="card-foot">Registrado às 23:59</span>
            </div>

            <div className="telemetry-card">
              <div className="flex-between">
                <span className="card-label">COMBUSTÍVEL</span>
                <span className="card-percent">{vehicle.fuelLevel}%</span>
              </div>
              <div className="progress-bar-bg">
                <div 
                  className={`progress-bar-fill ${vehicle.fuelLevel < 25 ? 'fill-amber' : 'fill-sky'}`} 
                  style={{ width: `${vehicle.fuelLevel}%` }}
                />
              </div>
              <span className="card-foot">{vehicle.fuelType}</span>
            </div>

            <div className="telemetry-card">
              <div className="flex-between">
                <span className="card-label">BATERIA PRINCIPAL</span>
                <span className="card-percent">{vehicle.batteryLevel}%</span>
              </div>
              <div className="progress-bar-bg">
                <div 
                  className="progress-bar-fill fill-emerald" 
                  style={{ width: `${vehicle.batteryLevel}%` }}
                />
              </div>
              <span className="card-foot">Tensão: 24.2V (Ideal)</span>
            </div>
          </div>

          {vehicle.temperatureCargo && (
            <div className="cargo-temp-banner">
              <span className="temp-label">BAÚ REFRIGERADO (SENSOR CARGA):</span>
              <span className="temp-value">{vehicle.temperatureCargo} (Faixa Segura)</span>
            </div>
          )}
        </div>

        {/* Dados do Motorista e Contrato */}
        <div className="drawer-section">
          <div className="section-title">
            <IconShield size={17} color="#38bdf8" />
            <span>Condutor Responsável e Gestão</span>
          </div>

          <div className="driver-info-box">
            <div className="driver-avatar">
              {vehicle.driver.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div>
              <div className="driver-name">{vehicle.driver}</div>
              <div className="driver-contact">{vehicle.driverPhone} • CNH Categoria E</div>
              <div className="driver-state">Base Operacional: {vehicle.state}</div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
