"use client"
import { useState } from "react"
import "./home.css"
import SideMenu from "../components/SideMenu"
import { useRouter } from "next/navigation"

interface DashboardCard {
    id: string
    title: string
    value: string | number
    icon: string
    color: string
    hasNotification?: boolean
    onClick?: () => void
}

export default function HomePage() {
    const [userType] = useState("administrador")
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const router = useRouter()

    const dashboardData: DashboardCard[] = [
        {
            id: "turmas",
            title: "Turmas",
            value: 5,
            icon: "🏫",
            color: "orange",
            onClick: () => router.push('/classroom')
        },
        {
            id: "alunos",
            title: "Alunos",
            value: 120,
            icon: "👶",
            color: "coral",
            onClick: () => router.push('/student')
        },
        {
            id: "responsaveis",
            title: "Responsáveis", 
            value: 120,
            icon: "👨‍👩‍👧‍👦",
            color: "coral",
            onClick: () => router.push('/parent')
        },
        {
            id: "professores",
            title: "Professores",
            value: 8,
            icon: "👩‍🏫",
            color: "brown",
            onClick: () => router.push('/teacher')
        },
        {
            id: "notificacoes",
            title: "Notificações",
            value: 3,
            icon: "❗",
            color: "red",
            hasNotification: true,
        },
        {
            id: "rotinas",
            title: "Rotinas",
            value: "",
            icon: "📋",
            color: "blue",
        },
        {
            id: "relatorios",
            title: "Relatórios",
            value: "",
            icon: "📊",
            color: "orange",
        },
    ]

    const handleCardClick = (cardId: string) => {
        console.log(`Navegando para: ${cardId}`)
        if (cardId === 'classroom') {
            router.push('/classroom')
        }
    }

    const handleCadAluno = () => {
        router.push('/student/register')
    }

    const handleMenuClick = () => {
        setIsMenuOpen(true)
    }

    const handleCloseMenu = () => {
        setIsMenuOpen(false)
    }

    const handleMenuClickOutside = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleCloseMenu()
        }
    }

    const handleReportsClick = () => {
        console.log("Abrir relatórios")
    }

    const handleLogout = () => {
        console.log("Sair")
        // Limpa o cookie de autenticação
        document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        // Redireciona para a página de login
        window.location.href = '/login';
    }

    return (
        <SideMenu onLogout={handleLogout}>
            <div className="home-container">
                <div className={`home-content ${isMenuOpen ? 'menu-open' : ''}`}>
                    {/* Header */}
                    <div className="header">
                        <div className="user-info">
                            <img 
                                src="/seed-logo.png"
                                alt="SEED Logo"
                                width={48}
                                height={48}
                                className="user-avatar"
                            />
                            <div className="user-details">
                                <h1>Página Inicial</h1>
                                <p>Administrador</p>
                            </div>
                        </div>
                    </div>

                    {/* Dashboard Grid */}
                    <div className="dashboard-grid">
                        {dashboardData.map((card) => (
                            <div key={card.id} className={`dashboard-card ${card.color}`} onClick={card.onClick}>
                                <div className="card-content">
                                    <div className="card-icon">{card.icon}</div>
                                    {card.value && (
                                        <div className="card-value">
                                            {card.value}
                                            {card.hasNotification && <div className="notification-badge"></div>}
                                        </div>
                                    )}
                                    <div className="card-title">{card.title}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Navigation */}
                    <div className="bottom-nav">
                        <button className="nav-button add-button" onClick={handleCadAluno}>
                            <span className="button-icon">➕</span>
                            Cad. Alunos
                        </button>

                        <button className="nav-button menu-button" onClick={handleMenuClick}>
                            <span className="button-icon">☰</span>
                        </button>

                        <button className="nav-button reports-button" onClick={handleReportsClick}>
                            <span className="button-icon">💬</span>
                            Relatórios
                        </button>
                    </div>

                    {/* Menu Expandido */}
                    <div className={`menu-overlay ${isMenuOpen ? 'active' : ''}`} onClick={handleMenuClickOutside}>
                        <div className={`menu-expanded ${isMenuOpen ? 'active' : ''}`}>
                            <div className="menu-header">
                                <h2 className="menu-title">Menu</h2>
                                <button className="menu-close" onClick={handleCloseMenu}>×</button>
                            </div>
                            <div className="menu-items">
                                <a href="/profile" className="menu-item">
                                    <span className="menu-item-icon">👤</span>
                                    <span className="menu-item-text">Perfil</span>
                                </a>
                                <a href="/settings" className="menu-item">
                                    <span className="menu-item-icon">⚙️</span>
                                    <span className="menu-item-text">Configurações</span>
                                </a>
                                <button className="menu-item logout" onClick={handleLogout}>
                                    <span className="menu-item-icon">🚪</span>
                                    <span className="menu-item-text">Sair</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SideMenu>
    )
}
