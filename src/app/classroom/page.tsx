"use client"
import { useState, useEffect } from "react"
// import "./turmas.css"
import styles from "./turmas.module.css"
import { useRouter } from "next/navigation"

interface Turma {
  id: string
  nome: string
  nivel: string
  turno: string
  horario: {
    inicio: string
    fim: string
    diasSemana: string[]
  }
  institution: {
    nome: string
  }
  teachers: Array<{
    id: string
    user: {
      name: string
    }
  }>
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export default function TurmasPage() {
  const router = useRouter();

  const [turmas, setTurmas] = useState<Turma[]>([])

  const buscarTurmas = async () => {
    try {
      // Obtém o token de acesso do cookie
      const accessToken = document.cookie.split('; ').find(row => row.startsWith('auth-token='))?.split('=')[1]
      
      if (!accessToken) {
        console.error('Token de acesso não encontrado')
        router.push('/login')
        return
      }

      const response = await fetch("http://localhost:3000/classrooms", {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`)
      }

      const data = await response.json()
      setTurmas(data)
    } catch (error) {
      console.error('Erro ao buscar turmas:', error)
    }
  }

  const handleTurmaClick = (turmaId: string) => {
    console.log(`Visualizar turma: ${turmaId}`)
  }

  const handleAddTurma = () => {
    console.log("Adicionar nova turma")
  }

  const handleBack = () => {
    router.push("/home")
  }

  useEffect(() => {
    buscarTurmas()
  }, [])

  return (
    <div className={styles.turmasContainer}>
      <div className={styles.turmasContent}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.backButton} onClick={handleBack}>
              ←
            </button>
            <div className={styles.headerInfo}>
              <h1>Turmas</h1>
              <p>{turmas.length} turmas ativas</p>
            </div>
          </div>
          <div className={styles.headerIcon}>🏫</div>
        </div>

        {/* Turmas List */}
        <div className={styles.turmasList}>
          {turmas.map((turma) => (
            <div key={turma.id} className={`${styles.turmaCard}`} onClick={() => handleTurmaClick(turma.id)}>
              <div className={styles.turmaHeader}>
                <div className={styles.turmaInfo}>
                  <h3>{turma.nome}</h3>
                  <span className={styles.idadeBadge}>{turma.nivel}</span>
                </div>
                <div className={styles.alunosCount}>
                  <span className={styles.countNumber}>{turma.teachers.length}</span>
                  <span className={styles.countLabel}>professores</span>
                </div>
              </div>

              <div className={styles.turmaDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.detailIcon}>👩‍🏫</span>
                  <span className={styles.detailText}>
                    {turma.teachers.map(teacher => teacher.user.name).join(', ')}
                  </span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailIcon}>🕐</span>
                  <span className={styles.detailText}>
                    {turma.horario.inicio} - {turma.horario.fim}
                  </span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailIcon}>📅</span>
                  <span className={styles.detailText}>
                    {turma.horario.diasSemana.length == 5 ? "Todos os dias" : turma.horario.diasSemana.join(', ')}
                  </span>
                </div>

                {/* <div className={styles.detailItem}>
                  <span className={styles.detailIcon}>🏫</span>
                  <span className={styles.detailText}>{turma.institution.nome}</span>
                </div> */}
              </div>

              <div className={styles.turmaActions}>
                <button className={styles.actionButton}>👁️ Ver detalhes</button>
                <button className={styles.actionButton}>✏️ Editar</button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Button */}
        <div className={styles.addSection}>
          <button className={styles.addTurmaButton} onClick={handleAddTurma}>
            <span className={styles.addIcon}>➕</span>
            Adicionar Nova Turma
          </button>
        </div>
      </div>
    </div>
  )
}
