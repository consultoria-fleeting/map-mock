import React from 'react';
import { IconLayers, IconCompass } from './Icons';

export function MapControls({
  currentTileLayer,
  onTileLayerChange,
  zoomLevel,
  onResetToBrazil,
  onZoomIn,
  onZoomOut
}) {
  return (
    <div className="map-controls-overlay">
      {/* Botão de Centralizar Brasil */}
      <button 
        id="btn-reset-brasil"
        className="control-fab-btn"
        onClick={onResetToBrazil}
        title="Retornar à visão Macro (Todo o Brasil)"
      >
        <IconCompass size={18} />
        <span className="fab-tooltip">Visão Brasil Macro</span>
      </button>

      {/* Controles de Zoom Manual */}
      <div className="zoom-btn-group">
        <button 
          id="btn-zoom-in"
          className="zoom-btn"
          onClick={onZoomIn}
          title="Aproximar (Zoom-In até nível de rua)"
        >
          +
        </button>
        <div className="zoom-display" title="Nível de zoom atual">
          z{Math.round(zoomLevel)}
        </div>
        <button 
          id="btn-zoom-out"
          className="zoom-btn"
          onClick={onZoomOut}
          title="Afastar (Zoom-Out)"
        >
          −
        </button>
      </div>

      {/* Seletor de Mapa Base (Sem Google Maps) */}
      <div className="tile-selector-card">
        <div className="tile-title">
          <IconLayers size={14} color="#38bdf8" />
          <span>CAMADA BASE</span>
        </div>
        <div className="tile-options">
          <button
            className={`tile-chip ${currentTileLayer === 'osm' ? 'active' : ''}`}
            onClick={() => onTileLayerChange('osm')}
            title="OpenStreetMap Padrão - 100% Gratuito e Aberto"
          >
            Ruas OSM (Padrão)
          </button>
          <button
            className={`tile-chip ${currentTileLayer === 'dark' ? 'active' : ''}`}
            onClick={() => onTileLayerChange('dark')}
            title="OpenStreetMap Dark Cyber (Filtro CSS sem chaves)"
          >
            Dark Cyber
          </button>
          <button
            className={`tile-chip ${currentTileLayer === 'osmfr' ? 'active' : ''}`}
            onClick={() => onTileLayerChange('osmfr')}
            title="OpenStreetMap Alta Legibilidade de Rodovias"
          >
            Vias & Rodovias
          </button>
        </div>
      </div>

      {/* Legenda de Status */}
      <div className="map-legend-card">
        <div className="legend-title">LEGENDA DO MAPA</div>
        <div className="legend-item">
          <span className="legend-color-dot dot-emerald" />
          <span>Em Rota / Trânsito</span>
        </div>
        <div className="legend-item">
          <span className="legend-color-dot dot-indigo" />
          <span>Estacionado / Cliente</span>
        </div>
        <div className="legend-item">
          <span className="legend-color-dot dot-amber" />
          <span>Manutenção / Alerta</span>
        </div>
        <div className="legend-item">
          <span className="legend-cluster-badge">12</span>
          <span>Cluster Inteligente</span>
        </div>
      </div>
    </div>
  );
}
