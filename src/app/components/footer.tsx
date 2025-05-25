'use client';

import styles from './footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.copyright}>© 2024 Sistema Escolar. Todos os direitos reservados.</p>
        <nav className={styles.nav}>
          <ul className={styles.links}>
            <li><a href="/sobre">Sobre</a></li>
            <li><a href="/contato">Contato</a></li>
            <li><a href="/privacidade">Privacidade</a></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
