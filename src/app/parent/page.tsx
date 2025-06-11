"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import styles from "./parent.module.css"
import FeedNoticias from "../components/feedNoticias"

interface Parent {
    id: string
    user: {
        nome: string
        email: string
        telefone: string
        cpf: string
        dataNascimento: string
    }
    parentesco: string
    contatosEmergencia?: {
        nome: string
        telefone: string
        parentesco: string
    }[]
    students: {
        id: string
        nome: string
    }[]
    createdAt: string
}

export default function ParentPage() {
    const router = useRouter()
    const [parents, setParents] = useState<Parent[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredParents, setFilteredParents] = useState<Parent[]>([])
    const [error, setError] = useState<string | null>(null)

    const buscarResponsaveis = async () => {
        try {
            const response = await fetch(`http://localhost:3000/users/parent/institution/${localStorage.getItem('seed_institution')}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('seed_authToken')}`
                }
            })

            if (!response.ok) {
                throw new Error('Erro ao buscar responsáveis')
            }

            const data = await response.json()
            setParents(data)
            setFilteredParents(data)
        } catch (err) {
            setError('Erro ao carregar a lista de responsáveis')
            console.error(err)
        }
    }

    useEffect(() => {
        buscarResponsaveis()
    }, [])

    useEffect(() => {
        const filtered = parents.filter(parent =>
            parent.user.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            parent.user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            parent.user.cpf?.includes(searchTerm)
        )
        setFilteredParents(filtered)
    }, [searchTerm, parents])

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    const handleAddParent = () => {
        router.push('/parent/register')
    }

    const handleViewParent = (id: string) => {
        router.push(`/parent/${id}`)
    }

    const handleEditParent = (id: string) => {
        router.push(`/parent/${id}/edit`)
    }

    const handleDeleteParent = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este responsável?')) {
            return
        }

        try {
            const response = await fetch(`http://localhost:3000/parents/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('seed_authToken')}`
                }
            })

            if (!response.ok) {
                throw new Error('Erro ao excluir responsável')
            }

            setParents(parents.filter(parent => parent.id !== id))
        } catch (err) {
            setError('Erro ao excluir responsável')
            console.error(err)
        }
    }

    return (
        <div className={styles.parentContainer}>
            <div className={styles.parentContent}>
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <div className={styles.headerInfo}>
                            <h1>Responsáveis</h1>
                            <p>Gerencie os responsáveis dos alunos</p>
                        </div>
                    </div>
                    <div className={styles.headerIcon}>👨‍👩‍👧‍👦</div>
                </div>

                <div className={styles.container}>
                    <FeedNoticias />
                    <div className={styles.botoesContainer}>
                        <button 
                            className={styles.botaoAcao}
                            onClick={() => router.push('/students/detail')}
                        >
                            <svg className={styles.botaoIcone} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            Detalhamento de Alunos
                        </button>
                        <button 
                            className={styles.botaoAcao}
                            onClick={() => router.push('/classes/detail')}
                        >
                            <svg className={styles.botaoIcone} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="3" y1="9" x2="21" y2="9"></line>
                                <line x1="9" y1="21" x2="9" y2="9"></line>
                            </svg>
                            Detalhamento de Turmas
                        </button>
                    </div>
                </div>

                {/* <div className={styles.searchSection}>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Buscar responsável por nome, email ou CPF..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div> */}

                

                {error && (
                    <div className={styles.errorMessage}>
                        {error}
                    </div>
                )}

                <div className={styles.parentList}>
                    {filteredParents.map(parent => (
                        <div key={parent.id} className={styles.parentCard}>
                            <div className={styles.parentInfo}>
                                <h2 className={styles.parentName}>{parent.user.nome}</h2>
                                <p className={styles.parentDetails}>
                                    {parent.parentesco} • {parent.user.email}
                                </p>
                            </div>

                            <div className={styles.parentContact}>
                                <div className={styles.contactItem}>
                                    <span className={styles.contactIcon}>📱</span>
                                    {parent.user.telefone}
                                </div>
                                <div className={styles.contactItem}>
                                    <span className={styles.contactIcon}>📝</span>
                                    CPF: {parent.user.cpf}
                                </div>
                                {parent.contatosEmergencia && parent.contatosEmergencia.length > 0 && (
                                    <div className={styles.contactItem}>
                                        <span className={styles.contactIcon}>🚨</span>
                                        {parent.contatosEmergencia.length} contato(s) de emergência
                                    </div>
                                )}
                                <div className={styles.contactItem}>
                                    <span className={styles.contactIcon}>👶</span>
                                    {parent.students?.length} aluno(s) vinculado(s)
                                </div>
                            </div>

                            <div className={styles.parentActions}>
                                <button
                                    className={`${styles.actionButton} ${styles.primary}`}
                                    onClick={() => handleViewParent(parent.id)}
                                >
                                    👁️ Ver
                                </button>
                                <button
                                    className={styles.actionButton}
                                    onClick={() => handleEditParent(parent.id)}
                                >
                                    ✏️ Editar
                                </button>
                                <button
                                    className={`${styles.actionButton} ${styles.danger}`}
                                    onClick={() => handleDeleteParent(parent.id)}
                                >
                                    🗑️ Excluir
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
} 