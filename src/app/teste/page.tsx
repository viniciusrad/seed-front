'use client';

import SideMenu from "../components/SideMenu";

export default function HomePage() {
  return (
    <SideMenu onLogout={() => alert('logout')}>
      <div>Conteúdo de teste</div>
    </SideMenu>
  );
}