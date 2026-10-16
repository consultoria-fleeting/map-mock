import React from 'react';
import { IconTruck, IconRefresh, IconCompass, IconShield } from './Icons';

export function Header({
  totalVehicles,
  stats,
  isSyncing,
  onTriggerDailySync,
  lastSyncTime,
  zoomLevel,
  activeState
}) {
  const isMicroView = zoomLevel >= 6;

  return (
    <header className="header-container">
      <div className="header-left">
        <div className="logo-badge">
          <div className="logo-icon-wrap">
            <IconTruck size={22} color="#38bdf8" />
          </div>
          <div>
            <div className="logo-title">
              <span className="brand-accent">MASTER</span> MOBILITY
              <span className="badge-tag">FROTAS</span>
            </div>
            <div className="logo-subtitle">
              Monitoramento Georreferenciado Diário (Sem Google Maps)
            </div>
          </div>
        </div>

        {/* Indicador do Modo de Visão */}
        <div className={`view-mode-pill ${isMicroView ? 'mode-micro' : 'mode-macro'}`}>
          <div className="status-dot-pulse" />
          <div>
            <span className="view-mode-label">
              {isMicroView ? 'VISÃO MICRO: NÍVEL DE RUA' : 'VISÃO MACRO: ESTADOS (BRASIL)'}
            </span>
            <span className="view-mode-sub">
              {isMicroView
                ? (activeState ? `Foco no Estado: ${activeState.uf} (${activeState.name})` : 'Exibindo veículos em vias públicas')
                : 'Contagem agregada por UF • Clique ou dê zoom'}
            </span>
          </div>
        </div>
      </div>

      {/* KPIs da Frota */}
      <div className="header-kpis">
        <div className="kpi-card">
          <span className="kpi-label">TOTAL FROTA</span>
          <span className="kpi-value text-sky">{totalVehicles.toLocaleString('pt-BR')}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">EM TRÂNSITO</span>
          <span className="kpi-value text-emerald">{stats.inTransit.toLocaleString('pt-BR')}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">CLIENTE / PÁTIO</span>
          <span className="kpi-value text-indigo">{stats.parked.toLocaleString('pt-BR')}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">MANUTENÇÃO</span>
          <span className="kpi-value text-amber">{stats.maintenance.toLocaleString('pt-BR')}</span>
        </div>
      </div>

      {/* Ações e Status da Sincronização Diária */}
      <div className="header-right">
        <div className="sync-info">
          <span className="sync-title">TELEMETRIA DIÁRIA (GET)</span>
          <span className="sync-timestamp">{lastSyncTime}</span>
        </div>

        <button
          id="btn-trigger-sync"
          className={`btn-sync ${isSyncing ? 'btn-syncing' : ''}`}
          onClick={onTriggerDailySync}
          disabled={isSyncing}
          title="Simular recebimento do novo payload diário com LAT/LNG dos veículos"
        >
          <IconRefresh size={16} className={isSyncing ? 'spin-anim' : ''} />
          <span>{isSyncing ? 'Processando GET...' : 'Simular Novo GET'}</span>
        </button>
      </div>
    </header>
  );
}
