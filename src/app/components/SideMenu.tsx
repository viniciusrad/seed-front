'use client';

import { ReactNode, useState } from 'react';
import styles from './sideMenu.module.css';

export default function SideMenu({ onLogout, children }: { onLogout: () => void; children?: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Orelha */}
      <div
        className={styles.ear}
        onClick={() => setOpen(!open)}
        title="Abrir menu"
        style={{ left: open ? 220 : 0 }}
      >
        <span className={styles.earIcon}>☰</span>
      </div>

      {/* Menu lateral */}
      <nav className={`${styles.menu} ${open ? styles.open : ''}`}>
        <ul>
          <li><a href="/home">Início</a></li>
          <li><a href="/perfil">Perfil</a></li>
          <li><a href="/configuracoes">Configurações</a></li>
          {/* Adicione mais opções conforme necessário */}
          <li>
            <button className={styles.logout} onClick={onLogout}>Sair</button>
          </li>
        </ul>
      </nav>

      {/* Conteúdo da página */}
      <div style={{ marginLeft: open ? 220 : 0, transition: 'margin-left 0.3s cubic-bezier(.4,0,.2,1)' }}>
        {children}
      </div>
    </>
  );
}
