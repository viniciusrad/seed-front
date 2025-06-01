"use client"
import { useState, useEffect } from "react"
import styles from "./student.module.css"
import { useRouter } from "next/navigation"

interface Student {
  id: string
  nome: string
  matricula?: string
  dataNascimento: string
  cpf?: string
  serie?: string
  turma?: string
  periodo?: string
  turno?: 'MATUTINO' | 'VESPERTINO' | 'INTEGRAL'
  status: 'ATIVO' | 'INATIVO' | 'TRANSFERIDO'
  fotoPerfilUrl?: string
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

export default function StudentPage() {
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])

  const buscarAlunos = async () => {
    try {
      const institutionId = localStorage.getItem('seed_institution')
      if (!institutionId) {
        console.error('ID da instituição não encontrado')
        router.push('/login')
        return
      }

      const response = await fetch(`http://localhost:3000/students/institution/${institutionId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('seed_authToken')}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`)
      }

      const data = await response.json()
      setStudents(data)
      setFilteredStudents(data)
    } catch (error) {
      console.error('Erro ao buscar alunos:', error)
    }
  }

  useEffect(() => {
    buscarAlunos()
  }, [])

  useEffect(() => {
    const filtered = students.filter(student =>
      student.nome.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredStudents(filtered)
  }, [searchTerm, students])

  const handleStudentClick = (studentId: string) => {
    console.log(`Visualizar aluno: ${studentId}`)
  }

  const handleAddStudent = () => {
    router.push("/student/register")
  }

  const handleBack = () => {
    router.push("/home")
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'ATIVO':
        return styles.statusAtivo
      case 'INATIVO':
        return styles.statusInativo
      case 'TRANSFERIDO':
        return styles.statusTransferido
      default:
        return ''
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  return (
    <div className={styles.studentContainer}>
      <div className={styles.studentContent}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.backButton} onClick={handleBack}>
              ←
            </button>
            <div className={styles.headerInfo}>
              <h1>Alunos</h1>
              <p>{filteredStudents.length} alunos ativos</p>
            </div>
          </div>
          <div className={styles.headerIcon}>👨‍🎓</div>
        </div>

        {/* Search Section */}
        <div className={styles.searchSection}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Buscar aluno por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Student List */}
        <div className={styles.studentList}>
          {filteredStudents.map((student) => (
            <div key={student.id} className={styles.studentCard} onClick={() => handleStudentClick(student.id)}>
              <div className={styles.studentHeader}>
                <div className={styles.studentInfo}>
                  <h3>{student.nome}</h3>
                  <span className={`${styles.statusBadge} ${getStatusClass(student.status)}`}>
                    {student.status}
                  </span>
                </div>
                {student.matricula && (
                  <div className={styles.matricula}>
                    Matrícula: {student.matricula}
                  </div>
                )}
              </div>

              <div className={styles.studentDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.detailIcon}>📅</span>
                  <span className={styles.detailText}>
                    Nascimento: {formatDate(student.dataNascimento)}
                  </span>
                </div>

                {student.turma && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailIcon}>🏫</span>
                    <span className={styles.detailText}>
                      Turma: {student.turma}
                    </span>
                  </div>
                )}

                {student.turno && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailIcon}>⏰</span>
                    <span className={styles.detailText}>
                      Turno: {student.turno}
                    </span>
                  </div>
                )}
              </div>

              <div className={styles.studentActions}>
                <button className={`${styles.actionButton} ${styles.actionButtonView}`}>👁️ Ver detalhes</button>
                <button className={`${styles.actionButton} ${styles.actionButtonEdit}`}>✏️ Editar</button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Button */}
        <div className={styles.addSection}>
          <button className={styles.addStudentButton} onClick={handleAddStudent}>
            <span className={styles.addIcon}>➕</span>
            Adicionar Novo Aluno
          </button>
        </div>
      </div>
    </div>
  )
} 