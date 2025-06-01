"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import styles from "./register.module.css"

interface StudentFormData {
    nome: string
    matricula?: string
    dataNascimento: string
    cpf?: string
    serie?: string
    turma?: string
    periodo?: string
    turno?: 'MATUTINO' | 'VESPERTINO' | 'INTEGRAL'
    informacoesMedicas?: {
        alergias?: string[]
        medicamentos?: string[]
        condicoesEspeciais?: string[]
        observacoes?: string
        tipoSanguineo?: string
        planoDeSaude?: {
            nome?: string
            numero?: string
        }
    }
    informacoesAcademicas?: {
        nivelEnsino?: string
        anoLetivo?: string
        observacoes?: string
        desenvolvimento?: {
            motor?: string
            cognitivo?: string
            social?: string
            emocional?: string
        }
    }
    status: 'ATIVO' | 'INATIVO' | 'TRANSFERIDO'
}

export default function StudentRegisterPage() {
    const router = useRouter()
    const [formData, setFormData] = useState<StudentFormData>({
        nome: '',
        dataNascimento: '',
        status: 'ATIVO',
        informacoesMedicas: {
            alergias: [],
            medicamentos: [],
            condicoesEspeciais: []
        },
        informacoesAcademicas: {
            desenvolvimento: {
                motor: '',
                cognitivo: '',
                social: '',
                emocional: ''
            }
        }
    })
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleNestedInputChange = (section: keyof StudentFormData, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...(prev[section] as object),
                [field]: value
            }
        }))
    }

    const handleDevelopmentChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            informacoesAcademicas: {
                ...prev.informacoesAcademicas,
                desenvolvimento: {
                    ...prev.informacoesAcademicas?.desenvolvimento,
                    [field]: value
                }
            }
        }))
    }

    const handlePlanoDeSaudeChange = (field: 'nome' | 'numero', value: string) => {
        setFormData(prev => ({
            ...prev,
            informacoesMedicas: {
                ...prev.informacoesMedicas,
                planoDeSaude: {
                    ...prev.informacoesMedicas?.planoDeSaude,
                    [field]: value
                }
            }
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        try {
            const response = await fetch('http://localhost:3000/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('seed_authToken')}`
                },
                body: JSON.stringify({
                    ...formData,
                    institution_id: localStorage.getItem('seed_institution')
                })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Erro ao cadastrar aluno')
            }

            router.push('/student')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao cadastrar aluno')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className={styles.registerContainer}>
            <div className={styles.registerContent}>
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <button className={styles.backButton} onClick={() => router.back()}>
                            ←
                        </button>
                        <div className={styles.headerInfo}>
                            <h1>Cadastro de Aluno</h1>
                            <p>Preencha os dados do aluno</p>
                        </div>
                    </div>
                    <div className={styles.headerIcon}>👶</div>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    {error && <div className={styles.errorMessage}>{error}</div>}

                    {/* Informações Básicas */}
                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>Informações Básicas</h2>
                        <div className={styles.inputRow}>
                            <div className={styles.inputGroup}>
                                <label className={`${styles.label} ${styles.requiredLabel}`} htmlFor="nome">
                                    Nome Completo
                                </label>
                                <input
                                    type="text"
                                    id="nome"
                                    name="nome"
                                    className={styles.input}
                                    value={formData.nome}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={`${styles.label} ${styles.requiredLabel}`} htmlFor="dataNascimento">
                                    Data de Nascimento
                                </label>
                                <input
                                    type="date"
                                    id="dataNascimento"
                                    name="dataNascimento"
                                    className={styles.input}
                                    value={formData.dataNascimento}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.inputRow}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label} htmlFor="matricula">
                                    Matrícula
                                </label>
                                <input
                                    type="text"
                                    id="matricula"
                                    name="matricula"
                                    className={styles.input}
                                    value={formData.matricula}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label} htmlFor="cpf">
                                    CPF
                                </label>
                                <input
                                    type="text"
                                    id="cpf"
                                    name="cpf"
                                    className={styles.input}
                                    value={formData.cpf}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Informações Escolares */}
                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>Informações Escolares</h2>
                        <div className={styles.inputRow}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label} htmlFor="serie">
                                    Série
                                </label>
                                <input
                                    type="text"
                                    id="serie"
                                    name="serie"
                                    className={styles.input}
                                    value={formData.serie}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label} htmlFor="turma">
                                    Turma
                                </label>
                                <input
                                    type="text"
                                    id="turma"
                                    name="turma"
                                    className={styles.input}
                                    value={formData.turma}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className={styles.inputRow}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label} htmlFor="periodo">
                                    Período
                                </label>
                                <input
                                    type="text"
                                    id="periodo"
                                    name="periodo"
                                    className={styles.input}
                                    value={formData.periodo}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label} htmlFor="turno">
                                    Turno
                                </label>
                                <select
                                    id="turno"
                                    name="turno"
                                    className={styles.input}
                                    value={formData.turno}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Selecione</option>
                                    <option value="MATUTINO">Matutino</option>
                                    <option value="VESPERTINO">Vespertino</option>
                                    <option value="INTEGRAL">Integral</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Informações Médicas */}
                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>Informações Médicas</h2>
                        <div className={styles.inputRow}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label} htmlFor="tipoSanguineo">
                                    Tipo Sanguíneo
                                </label>
                                <input
                                    type="text"
                                    id="tipoSanguineo"
                                    name="tipoSanguineo"
                                    className={styles.input}
                                    value={formData.informacoesMedicas?.tipoSanguineo}
                                    onChange={(e) => handleNestedInputChange('informacoesMedicas', 'tipoSanguineo', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Plano de Saúde</label>
                            <div className={styles.inputRow}>
                                <input
                                    type="text"
                                    placeholder="Nome do Plano"
                                    className={styles.input}
                                    value={formData.informacoesMedicas?.planoDeSaude?.nome}
                                    onChange={(e) => handlePlanoDeSaudeChange('nome', e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Número do Plano"
                                    className={styles.input}
                                    value={formData.informacoesMedicas?.planoDeSaude?.numero}
                                    onChange={(e) => handlePlanoDeSaudeChange('numero', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Observações Médicas</label>
                            <textarea
                                className={styles.input}
                                rows={4}
                                value={formData.informacoesMedicas?.observacoes}
                                onChange={(e) => handleNestedInputChange('informacoesMedicas', 'observacoes', e.target.value)}
                                placeholder="Digite observações médicas relevantes..."
                            />
                        </div>
                    </div>

                    {/* Informações Acadêmicas */}
                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>Informações Acadêmicas</h2>
                        <div className={styles.inputRow}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label} htmlFor="nivelEnsino">
                                    Nível de Ensino
                                </label>
                                <input
                                    type="text"
                                    id="nivelEnsino"
                                    className={styles.input}
                                    value={formData.informacoesAcademicas?.nivelEnsino}
                                    onChange={(e) => handleNestedInputChange('informacoesAcademicas', 'nivelEnsino', e.target.value)}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label} htmlFor="anoLetivo">
                                    Ano Letivo
                                </label>
                                <input
                                    type="text"
                                    id="anoLetivo"
                                    className={styles.input}
                                    value={formData.informacoesAcademicas?.anoLetivo}
                                    onChange={(e) => handleNestedInputChange('informacoesAcademicas', 'anoLetivo', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Desenvolvimento</label>
                            <div className={styles.inputRow}>
                                <input
                                    type="text"
                                    placeholder="Desenvolvimento Motor"
                                    className={styles.input}
                                    value={formData.informacoesAcademicas?.desenvolvimento?.motor}
                                    onChange={(e) => handleDevelopmentChange('motor', e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Desenvolvimento Cognitivo"
                                    className={styles.input}
                                    value={formData.informacoesAcademicas?.desenvolvimento?.cognitivo}
                                    onChange={(e) => handleDevelopmentChange('cognitivo', e.target.value)}
                                />
                            </div>
                            <div className={styles.inputRow}>
                                <input
                                    type="text"
                                    placeholder="Desenvolvimento Social"
                                    className={styles.input}
                                    value={formData.informacoesAcademicas?.desenvolvimento?.social}
                                    onChange={(e) => handleDevelopmentChange('social', e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Desenvolvimento Emocional"
                                    className={styles.input}
                                    value={formData.informacoesAcademicas?.desenvolvimento?.emocional}
                                    onChange={(e) => handleDevelopmentChange('emocional', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Observações Acadêmicas</label>
                            <textarea
                                className={styles.input}
                                rows={4}
                                value={formData.informacoesAcademicas?.observacoes}
                                onChange={(e) => handleNestedInputChange('informacoesAcademicas', 'observacoes', e.target.value)}
                                placeholder="Digite observações acadêmicas relevantes..."
                            />
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={() => router.back()}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
} 