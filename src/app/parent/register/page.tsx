"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import styles from "./register.module.css"

interface EmergencyContact {
    nome: string
    telefone: string
    parentesco: string
}

export default function ParentRegisterPage() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        user: {
            nome: "",
            email: "",
            password: "",
            telefone: "",
            cpf: "",
            dataNascimento: "",
        },
        parentesco: "",
        contatosEmergencia: [] as EmergencyContact[],
    })

    const [newEmergencyContact, setNewEmergencyContact] = useState<EmergencyContact>({
        nome: "",
        telefone: "",
        parentesco: "",
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        if (name.startsWith("user.")) {
            const userField = name.split(".")[1]
            setFormData(prev => ({
                ...prev,
                user: {
                    ...prev.user,
                    [userField]: value
                }
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }))
        }
    }

    const handleEmergencyContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setNewEmergencyContact(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const addEmergencyContact = () => {
        if (newEmergencyContact.nome && newEmergencyContact.telefone && newEmergencyContact.parentesco) {
            setFormData(prev => ({
                ...prev,
                contatosEmergencia: [...prev.contatosEmergencia, newEmergencyContact]
            }))
            setNewEmergencyContact({
                nome: "",
                telefone: "",
                parentesco: ""
            })
        }
    }

    const removeEmergencyContact = (index: number) => {
        setFormData(prev => ({
            ...prev,
            contatosEmergencia: prev.contatosEmergencia.filter((_, i) => i !== index)
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        console.log('formData', formData)

        try {
            const response = await fetch("http://localhost:3000/users/parent/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("seed_authToken")}`
                },
                body: JSON.stringify({
                    ...formData,
                    ...formData.user,
                    institutionId: localStorage.getItem("seed_institution")
                })
            })

            if (!response.ok) {
                throw new Error("Erro ao cadastrar responsável")
            }

            router.push("/parent")
        } catch (err) {
            setError("Erro ao cadastrar responsável. Por favor, tente novamente.")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h1>Cadastrar Novo Responsável</h1>
                    <p>Preencha os dados do responsável</p>
                </div>

                {error && (
                    <div className={styles.errorMessage}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.section}>
                        <h2>Dados Pessoais</h2>
                        <div className={styles.formGroup}>
                            <label htmlFor="user.nome">Nome Completo</label>
                            <input
                                type="text"
                                id="user.nome"
                                name="user.nome"
                                value={formData.user.nome}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="user.email">E-mail</label>
                            <input
                                type="email"
                                id="user.email"
                                name="user.email"
                                value={formData.user.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="user.password">Senha</label>
                            <input
                                type="password"
                                id="user.password"
                                name="user.password"
                                value={formData.user.password}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="user.telefone">Telefone</label>
                            <input
                                type="tel"
                                id="user.telefone"
                                name="user.telefone"
                                value={formData.user.telefone}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="user.cpf">CPF</label>
                            <input
                                type="text"
                                id="user.cpf"
                                name="user.cpf"
                                value={formData.user.cpf}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="user.dataNascimento">Data de Nascimento</label>
                            <input
                                type="date"
                                id="user.dataNascimento"
                                name="user.dataNascimento"
                                value={formData.user.dataNascimento}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="parentesco">Parentesco</label>
                            <input
                                type="text"
                                id="parentesco"
                                name="parentesco"
                                value={formData.parentesco}
                                onChange={handleInputChange}
                                placeholder="Ex: Mãe, Pai, Avó..."
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2>Contatos de Emergência</h2>
                        <div className={styles.emergencyContacts}>
                            {formData.contatosEmergencia.map((contact, index) => (
                                <div key={index} className={styles.emergencyContact}>
                                    <p><strong>Nome:</strong> {contact.nome}</p>
                                    <p><strong>Telefone:</strong> {contact.telefone}</p>
                                    <p><strong>Parentesco:</strong> {contact.parentesco}</p>
                                    <button
                                        type="button"
                                        onClick={() => removeEmergencyContact(index)}
                                        className={styles.removeButton}
                                    >
                                        Remover
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className={styles.newEmergencyContact}>
                            <div className={styles.formGroup}>
                                <label htmlFor="emergencyNome">Nome</label>
                                <input
                                    type="text"
                                    id="emergencyNome"
                                    name="nome"
                                    value={newEmergencyContact.nome}
                                    onChange={handleEmergencyContactChange}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="emergencyTelefone">Telefone</label>
                                <input
                                    type="tel"
                                    id="emergencyTelefone"
                                    name="telefone"
                                    value={newEmergencyContact.telefone}
                                    onChange={handleEmergencyContactChange}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="emergencyParentesco">Parentesco</label>
                                <input
                                    type="text"
                                    id="emergencyParentesco"
                                    name="parentesco"
                                    value={newEmergencyContact.parentesco}
                                    onChange={handleEmergencyContactChange}
                                />
                            </div>

                            <button
                                type="button"
                                onClick={addEmergencyContact}
                                className={styles.addButton}
                            >
                                Adicionar Contato
                            </button>
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <button
                            type="button"
                            onClick={() => router.push("/parent")}
                            className={styles.cancelButton}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={loading}
                        >
                            {loading ? "Cadastrando..." : "Cadastrar Responsável"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
} 