'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { navItems, roles } from '../data';
import type { Role, RoleId, ViewId } from '../types';

type ShellProps = {
  children: ReactNode;
  currentView: ViewId;
  role: Role;
  toast: string;
  onLogout: () => void;
  onNavigate: (view: ViewId) => void;
  onRoleChange: (role: RoleId) => void;
};

export function Shell({ children, currentView, role, toast, onLogout, onNavigate, onRoleChange }: ShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  function handleNav(view: ViewId) {
    onNavigate(view);
    setMenuOpen(false);
  }

  return (
    <div className="app-shell">
      {toast && <div className="toast-message">{toast}</div>}

      {/* Desktop Sidebar */}
      <aside className="desktop-sidebar">
        <Brand />
        <Nav currentView={currentView} onNavigate={onNavigate} />
        <div className="sidebar-footer">
          <RoleSelect roleId={role.id} onRoleChange={onRoleChange} />
          <button className="logout-button" type="button" onClick={onLogout}>
            <i className="bi bi-box-arrow-left" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Mobile / Tablet Top Header */}
      <header className="tablet-header">
        <button
          className="hamburger-button"
          type="button"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <i className={`bi ${menuOpen ? 'bi-x-lg' : 'bi-list'}`} />
        </button>
        <Brand compact />
      </header>

      {/* Mobile Drawer Overlay */}
      {menuOpen && (
        <div className="mobile-drawer-backdrop" onClick={() => setMenuOpen(false)}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-head">
              <Brand />
              <button
                className="drawer-close-btn"
                type="button"
                aria-label="Fechar menu"
                onClick={() => setMenuOpen(false)}
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>

            <div className="mobile-drawer-body">
              <Nav currentView={currentView} onNavigate={handleNav} />
            </div>

            <div className="mobile-drawer-footer">
              <RoleSelect roleId={role.id} onRoleChange={onRoleChange} />
              <button className="logout-button" type="button" onClick={onLogout}>
                <i className="bi bi-box-arrow-left" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="app-content">{children}</main>

      {/* Mobile Bottom Navigation */}
      <nav className="bottom-nav" aria-label="Navegação principal">
        {navItems.map((item) => (
          <button
            className={currentView === item.id ? 'active' : ''}
            key={item.id}
            type="button"
            onClick={() => handleNav(item.id)}
          >
            <i className={`bi ${item.icon}`} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

function Brand({ compact }: { compact?: boolean }) {
  return (
    <div className={`nav-brand ${compact ? 'compact' : ''}`}>
      <img
        src="/classconecta-wordmark.png"
        alt="CLASSCONECTA"
        className="sidebar-wordmark-img"
      />
    </div>
  );
}

function Nav({ currentView, onNavigate }: { currentView: ViewId; onNavigate: (view: ViewId) => void }) {
  return (
    <nav className="side-nav" aria-label="Navegação principal">
      {navItems.map((item) => (
        <button
          className={currentView === item.id ? 'active' : ''}
          key={item.id}
          type="button"
          onClick={() => onNavigate(item.id)}
        >
          <i className={`bi ${item.icon}`} />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

function RoleSelect({
  compact,
  roleId,
  onRoleChange,
}: {
  compact?: boolean;
  roleId: RoleId;
  onRoleChange: (role: RoleId) => void;
}) {
  return (
    <label className={compact ? 'role-select compact' : 'role-select'}>
      {!compact && <span>Perfil para teste</span>}
      <select
        value={roleId}
        onChange={(event) => onRoleChange(event.target.value as RoleId)}
        aria-label="Selecionar perfil"
      >
        {roles.map((item) => (
          <option key={item.id} value={item.id}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}

