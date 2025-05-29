"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import styles from "./register.module.css"

interface FormData {
  // User fields
  name: string
  email: string
  password: string
  telefone?: string
  cpf?: string
  dataNascimento?: string
  endereco?: string
  fotoPerfilUrl?: string

  // Teacher fields
  formacao?: string
  especializacao?: string
  disciplinas?: string[]
  dataContratacao?: string
  turmas_atendidas?: string[]
  horario_trabalho?: {
    inicio: string
    fim: string
    dias_semana: string[]
  }
}

export default function RegisterTeacherPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    telefone: "",
    cpf: "",
    dataNascimento: "",
    endereco: "",
    formacao: "",
    especializacao: "",
    disciplinas: [],
    dataContratacao: "",
    turmas_atendidas: [],
    horario_trabalho: {
      inicio: "",
      fim: "",
      dias_semana: []
    }
  })

  const diasSemana = [
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado"
  ]

  const handleInputChange = (field: keyof FormData, value: string | string[] | { inicio: string; fim: string; dias_semana: string[] }) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleHorarioChange = (field: 'inicio' | 'fim', value: string) => {
    setFormData(prev => ({
      ...prev,
      horario_trabalho: {
        ...prev.horario_trabalho!,
        [field]: value
      }
    }))
  }

  const handleDiasSemanaChange = (dia: string) => {
    setFormData(prev => ({
      ...prev,
      horario_trabalho: {
        ...prev.horario_trabalho!,
        dias_semana: prev.horario_trabalho?.dias_semana.includes(dia)
          ? prev.horario_trabalho.dias_semana.filter(d => d !== dia)
          : [...(prev.horario_trabalho?.dias_semana || []), dia]
      }
    }))
  }

  const handleDisciplinasChange = (disciplina: string) => {
    setFormData(prev => ({
      ...prev,
      disciplinas: prev.disciplinas?.includes(disciplina)
        ? prev.disciplinas.filter(d => d !== disciplina)
        : [...(prev.disciplinas || []), disciplina]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const teacherData = {
        // Dados do usuário
        name: formData.name,
        email: formData.email,
        password: formData.password,
        telefone: formData.telefone || undefined,
        cpf: formData.cpf || undefined,
        dataNascimento: formData.dataNascimento ? new Date(formData.dataNascimento).toISOString() : undefined,
        endereco: formData.endereco || undefined,

        // Dados específicos do professor
        institution_id: localStorage.getItem('seed_institution'),
        formacao: formData.formacao || undefined,
        especializacao: formData.especializacao || undefined,
        disciplinas: formData.disciplinas || undefined,
        dataContratacao: formData.dataContratacao ? new Date(formData.dataContratacao).toISOString() : undefined,
        horario_trabalho: formData.horario_trabalho || undefined
      }

      console.log("Dados a serem enviados:", teacherData)

      const response = await fetch("http://localhost:3000/users/teacher/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('seed_authToken')}`
        },
        body: JSON.stringify(teacherData)
      })

      if (response.status === 409) {
        setErrorMessage("Este email já está cadastrado. Por favor, utilize outro email.")
        setFormData(prev => ({ ...prev, email: "" }))
        return
      }

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Erro na resposta da API:", errorData)
        throw new Error(errorData.message || "Erro ao criar professor")
      }

      const result = await response.json()
      console.log("Professor criado:", result)

      router.push("/teacher")
    } catch (error) {
      console.error("Erro detalhado:", error)
      setErrorMessage(error instanceof Error ? error.message : "Ocorreu um erro ao cadastrar o professor")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/teacher")
  }

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerContent}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.backButton} onClick={handleBack}>
              ←
            </button>
            <div className={styles.headerInfo}>
              <h1>Novo Professor</h1>
              <p>Cadastrar novo professor</p>
            </div>
          </div>
          <div className={styles.headerIcon}>👩‍🏫</div>
        </div>

        {errorMessage && (
          <div className={styles.errorMessage}>
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Dados Pessoais */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Dados Pessoais</h3>
            
            <div className={styles.inputGroup}>
              <label className={`${styles.label} ${styles.requiredLabel}`}>Nome Completo</label>
              <input
                type="text"
                className={styles.input}
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label className={`${styles.label} ${styles.requiredLabel}`}>Email</label>
                <input
                  type="email"
                  className={styles.input}
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={`${styles.label} ${styles.requiredLabel}`}>Senha</label>
                <input
                  type="password"
                  className={styles.input}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Telefone</label>
                <input
                  type="tel"
                  className={styles.input}
                  value={formData.telefone}
                  onChange={(e) => handleInputChange("telefone", e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>CPF</label>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.cpf}
                  onChange={(e) => handleInputChange("cpf", e.target.value)}
                />
              </div>
            </div>

            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Data de Nascimento</label>
                <input
                  type="date"
                  className={styles.input}
                  value={formData.dataNascimento}
                  onChange={(e) => handleInputChange("dataNascimento", e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Endereço</label>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.endereco}
                  onChange={(e) => handleInputChange("endereco", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Dados Profissionais */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Dados Profissionais</h3>

            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Formação</label>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.formacao}
                  onChange={(e) => handleInputChange("formacao", e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Especialização</label>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.especializacao}
                  onChange={(e) => handleInputChange("especializacao", e.target.value)}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Data de Contratação</label>
              <input
                type="date"
                className={styles.input}
                value={formData.dataContratacao}
                onChange={(e) => handleInputChange("dataContratacao", e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Disciplinas</label>
              <div className={styles.checkboxGrid}>
                {["Matemática", "Português", "História", "Geografia", "Ciências", "Inglês", "Artes", "Educação Física"].map((disciplina) => (
                  <label key={disciplina} className={styles.labelCheckboxItem}>
                    <input
                      type="checkbox"
                      className={styles.checkboxItem}
                      checked={formData.disciplinas?.includes(disciplina)}
                      onChange={() => handleDisciplinasChange(disciplina)}
                    />
                    <span>{disciplina}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Horário de Trabalho */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Horário de Trabalho</h3>

            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Horário Início</label>
                <input
                  type="time"
                  className={styles.input}
                  value={formData.horario_trabalho?.inicio}
                  onChange={(e) => handleHorarioChange("inicio", e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Horário Fim</label>
                <input
                  type="time"
                  className={styles.input}
                  value={formData.horario_trabalho?.fim}
                  onChange={(e) => handleHorarioChange("fim", e.target.value)}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Dias da Semana</label>
              <div className={styles.checkboxGrid}>
                {diasSemana.map((dia) => (
                  <label key={dia} className={styles.labelCheckboxItem}>
                    <input
                      type="checkbox"
                      className={styles.checkboxItem}
                      checked={formData.horario_trabalho?.dias_semana.includes(dia)}
                      onChange={() => handleDiasSemanaChange(dia)}
                    />
                    <span>{dia}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className={styles.formActions}>
            <button type="button" className={styles.cancelButton} onClick={handleBack}>
              Cancelar
            </button>
            <button type="submit" className={styles.submitButton} disabled={isLoading} onClick={handleSubmit}>
              {isLoading ? "Cadastrando..." : "Cadastrar Professor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 