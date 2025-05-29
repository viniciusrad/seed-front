"use client"
import { useState, useEffect } from "react"
import styles from "./teacher.module.css"
import { useRouter } from "next/navigation"

interface Teacher {
  id: string
  user: {
    name: string
    email: string
  }
  especializacao: string
  turmas: Array<{
    id: string
    nome: string
  }>
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export default function TeacherPage() {
  const router = useRouter()
  const [teachers, setTeachers] = useState<Teacher[]>([])

  const buscarProfessores = async () => {
    try {
      const institutionId = localStorage.getItem('seed_institution')
      if (!institutionId) {
        console.error('ID da instituição não encontrado')
        router.push('/login')
        return
      }

      const response = await fetch(`http://localhost:3000/users/teacher/institution/${institutionId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('seed_authToken')}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`)
      }

      const data = await response.json()
      setTeachers(data)
    } catch (error) {
      console.error('Erro ao buscar professores:', error)
    }
  }

  const handleTeacherClick = (teacherId: string) => {
    console.log(`Visualizar professor: ${teacherId}`)
  }

  const handleAddTeacher = () => {
    router.push("/teacher/register")
  }

  const handleBack = () => {
    router.push("/home")
  }

  useEffect(() => {
    buscarProfessores()
  }, [])

  return (
    <div className={styles.teacherContainer}>
      <div className={styles.teacherContent}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.backButton} onClick={handleBack}>
              ←
            </button>
            <div className={styles.headerInfo}>
              <h1>Professores</h1>
              <p>{teachers.length} professores ativos</p>
            </div>
          </div>
          <div className={styles.headerIcon}>👩‍🏫</div>
        </div>

        {/* Teacher List */}
        <div className={styles.teacherList}>
          {teachers.map((teacher) => (
            <div key={teacher.id} className={styles.teacherCard} onClick={() => handleTeacherClick(teacher.id)}>
              <div className={styles.teacherHeader}>
                <div className={styles.teacherInfo}>
                  <h3>{teacher.user.name}</h3>
                  <span className={styles.especialidadeBadge}>{teacher.especializacao}</span>
                </div>
                <div className={styles.turmasCount}>
                  <span className={styles.countNumber}>{teacher.turmas?.length || 0}</span>
                  <span className={styles.countLabel}>turmas</span>
                </div>
              </div>

              <div className={styles.teacherDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.detailIcon}>📧</span>
                  <span className={styles.detailText}>{teacher.user.email}</span>
                </div>

                {teacher.turmas && teacher.turmas.length > 0 && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailIcon}>🏫</span>
                    <span className={styles.detailText}>
                      {teacher.turmas.map(turma => turma.nome).join(', ')}
                    </span>
                  </div>
                )}
              </div>

              <div className={styles.teacherActions}>
                <button className={`${styles.actionButton} ${styles.actionButtonView}`}>👁️ Ver detalhes</button>
                <button className={`${styles.actionButton} ${styles.actionButtonEdit}`}>✏️ Editar</button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Button */}
        <div className={styles.addSection}>
          <button className={styles.addTeacherButton} onClick={handleAddTeacher}>
            <span className={styles.addIcon}>➕</span>
            Adicionar Novo Professor
          </button>
        </div>
      </div>
    </div>
  )
}
