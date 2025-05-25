"use client"
import { useState } from "react"
// import "./turmas.css"
import styles from "./turmas.module.css"
import { useRouter } from "next/navigation"
interface Turma {
  id: string
  nome: string
  idade: string
  totalAlunos: number
  professoraResponsavel: string
  periodo: string
  sala: string
  cor: string
}

export default function TurmasPage() {
  const router = useRouter();
  const [turmas] = useState<Turma[]>([
    {
      id: "1",
      nome: "Berçário I",
      idade: "4-12 meses",
      totalAlunos: 8,
      professoraResponsavel: "Ana Silva",
      periodo: "Integral",
      sala: "Sala 01",
      cor: "pink",
    },
    {
      id: "2",
      nome: "Berçário II",
      idade: "1-2 anos",
      totalAlunos: 12,
      professoraResponsavel: "Maria Santos",
      periodo: "Integral",
      sala: "Sala 02",
      cor: "blue",
    },
    {
      id: "3",
      nome: "Maternal I",
      idade: "2-3 anos",
      totalAlunos: 15,
      professoraResponsavel: "Carla Oliveira",
      periodo: "Manhã",
      sala: "Sala 03",
      cor: "green",
    },
    {
      id: "4",
      nome: "Maternal II",
      idade: "3-4 anos",
      totalAlunos: 18,
      professoraResponsavel: "Lucia Costa",
      periodo: "Tarde",
      sala: "Sala 04",
      cor: "orange",
    },
    {
      id: "5",
      nome: "Pré-Escola",
      idade: "4-5 anos",
      totalAlunos: 20,
      professoraResponsavel: "Sandra Lima",
      periodo: "Integral",
      sala: "Sala 05",
      cor: "purple",
    },
  ])

  const handleTurmaClick = (turmaId: string) => {
    console.log(`Visualizar turma: ${turmaId}`)
  }

  const handleAddTurma = () => {
    console.log("Adicionar nova turma")
  }

  const handleBack = () => {
    console.log("Voltar ao dashboard")
    // Aqui você implementaria a navegação de volta
    router.push("/home")
  }

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
            <div key={turma.id} className={`${styles.turmaCard} ${turma.cor}`} onClick={() => handleTurmaClick(turma.id)}>
              <div className={styles.turmaHeader}>
                <div className={styles.turmaInfo}>
                  <h3>{turma.nome}</h3>
                  <span className={styles.idadeBadge}>{turma.idade}</span>
                </div>
                <div className={styles.alunosCount}>
                  <span className={styles.countNumber}>{turma.totalAlunos}</span>
                  <span className={styles.countLabel}>alunos</span>
                </div>
              </div>

              <div className={styles.turmaDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.detailIcon}>👩‍🏫</span>
                  <span className={styles.detailText}>{turma.professoraResponsavel}</span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailIcon}>🕐</span>
                  <span className={styles.detailText}>{turma.periodo}</span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailIcon}>🚪</span>
                  <span className={styles.detailText}>{turma.sala}</span>
                </div>
              </div>

              <div className={styles.turmaActions}>
                <button className={styles.actionButton} >👁️ Ver detalhes</button>
                <button className={styles.actionButton} >✏️ Editar</button>
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
