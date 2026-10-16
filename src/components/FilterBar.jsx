import React from 'react';
import { IconSearch, IconX, IconFilter, IconTruck, IconCar, IconVan } from './Icons';
import { BRAZIL_STATES } from '../data/brazilStates';

export function FilterBar({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedCategory,
  onCategoryChange,
  selectedState,
  onStateSelect,
  visibleCount,
  totalCount,
  zoomLevel
}) {
  const isMicro = zoomLevel >= 6;

  return (
    <div className="filter-bar-container">
      {/* Busca Rápida */}
      <div className="search-input-wrap">
        <IconSearch size={16} color="#94a3b8" className="search-icon" />
        <input
          id="input-search-vehicles"
          type="text"
          className="search-input"
          placeholder="Buscar por Placa (ex: BRA2E19), Motorista ou Modelo..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button 
            className="search-clear-btn" 
            onClick={() => onSearchChange('')}
            title="Limpar busca"
          >
            <IconX size={14} />
          </button>
        )}
      </div>

      {/* Seletor Rápido de Estado */}
      <div className="state-select-wrap">
        <label className="filter-label">ESTADO / UF:</label>
        <select
          id="select-state-filter"
          className="state-select"
          value={selectedState?.uf || ''}
          onChange={(e) => {
            const uf = e.target.value;
            if (!uf) {
              onStateSelect(null);
            } else {
              const found = BRAZIL_STATES.find(s => s.uf === uf);
              onStateSelect(found);
            }
          }}
        >
          <option value="">Brasil Completo (Macro)</option>
          {BRAZIL_STATES.map(st => (
            <option key={st.uf} value={st.uf}>
              {st.uf} - {st.name} ({st.vehicleCount} veículos)
            </option>
          ))}
        </select>
      </div>

      {/* Filtro de Status */}
      <div className="status-filter-group">
        <button
          className={`filter-chip ${selectedStatus === 'all' ? 'active' : ''}`}
          onClick={() => onStatusChange('all')}
        >
          Todos
        </button>
        <button
          className={`filter-chip chip-emerald ${selectedStatus === 'in_transit' ? 'active' : ''}`}
          onClick={() => onStatusChange('in_transit')}
        >
          <span className="dot dot-emerald" />
          Em Rota
        </button>
        <button
          className={`filter-chip chip-indigo ${selectedStatus === 'parked' ? 'active' : ''}`}
          onClick={() => onStatusChange('parked')}
        >
          <span className="dot dot-indigo" />
          Parado
        </button>
        <button
          className={`filter-chip chip-amber ${selectedStatus === 'maintenance' ? 'active' : ''}`}
          onClick={() => onStatusChange('maintenance')}
        >
          <span className="dot dot-amber" />
          Manutenção
        </button>
      </div>

      {/* Filtro de Categoria */}
      <div className="category-filter-group">
        <button
          className={`cat-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => onCategoryChange('all')}
          title="Todos os veículos"
        >
          Geral
        </button>
        <button
          className={`cat-btn ${selectedCategory === 'truck' ? 'active' : ''}`}
          onClick={() => onCategoryChange('truck')}
          title="Caminhões pesados"
        >
          <IconTruck size={14} />
          Caminhões
        </button>
        <button
          className={`cat-btn ${selectedCategory === 'van' ? 'active' : ''}`}
          onClick={() => onCategoryChange('van')}
          title="Vans e Utilitários"
        >
          <IconVan size={14} />
          Vans
        </button>
        <button
          className={`cat-btn ${selectedCategory === 'car' ? 'active' : ''}`}
          onClick={() => onCategoryChange('car')}
          title="Carros e Pickups"
        >
          <IconCar size={14} />
          Leves
        </button>
      </div>

      {/* Contador de Veículos Filtrados */}
      <div className="filter-count-badge">
        <span className="count-label">
          {isMicro ? 'No Campo Visual:' : 'Mapeados:'}
        </span>
        <span className="count-number">
          {visibleCount.toLocaleString('pt-BR')}
        </span>
        <span className="count-sub">/ {totalCount.toLocaleString('pt-BR')}</span>
      </div>
    </div>
  );
}
