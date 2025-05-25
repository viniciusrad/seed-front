"use client"
import { useState, useEffect } from "react"
import type React from "react"

import "./cadastro-turma.css"

interface FormData {
    nome: string
    nivel: string
    turno: string
    horarioInicio: string
    horarioFim: string
    diasSemana: string[]
    institutionId: string
    teacherIds: string[]
}

interface Institution {
    id: string
    nome: string
}

interface Teacher {
    id: string
    nome: string
    especialidade: string
}

export default function CadastroTurmaPage() {
    const [formData, setFormData] = useState<FormData>({
        nome: "",
        nivel: "",
        turno: "MANHA",
        horarioInicio: "",
        horarioFim: "",
        diasSemana: [],
        institutionId: "",
        teacherIds: [],
    })

    const [isLoading, setIsLoading] = useState(false)
    //TODO: remover mock
    const teachersMock: Teacher[] = [
        { id: "1", nome: "Ana Silva", especialidade: "Educação Infantil" },
        { id: "2", nome: "Maria Santos", especialidade: "Berçário" },
        { id: "3", nome: "Carla Oliveira", especialidade: "Maternal" },
        { id: "4", nome: "Lucia Costa", especialidade: "Jardim" },
        { id: "5", nome: "Sandra Lima", especialidade: "Pré-Escola" },
    ]
    const [teachers, setTeachers] = useState<Teacher[]>([...teachersMock])

    // Mock data - em produção viria de uma API
    const institutions: Institution[] = [
        { id: "1", nome: "Creche Pequenos Passos" },
        { id: "2", nome: "Creche Mundo Infantil" },
        { id: "3", nome: "Creche Sorriso da Criança" },
    ]



    const niveis = [
        { value: "BERCARIO", label: "Berçário" },
        { value: "MATERNAL", label: "Maternal" },
        { value: "JARDIM_I", label: "Jardim I" },
        { value: "JARDIM_II", label: "Jardim II" },
    ]

    const turnos = [
        { value: "MANHA", label: "Manhã" },
        { value: "TARDE", label: "Tarde" },
        { value: "INTEGRAL", label: "Integral" },
    ]

    const diasSemanaOptions = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"]


    useEffect(() => {
        const fetchTeachers = async () => {
            const response = await fetch("http://localhost:3000/teachers")
            const data = await response.json()
            // setTeachers(data)
            console.log(data)
        }
        fetchTeachers()
    }, [])

    const handleInputChange = (field: keyof FormData, value: string | string[]) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleDiasSemanaChange = (dia: string) => {
        setFormData((prev) => ({
            ...prev,
            diasSemana: prev.diasSemana.includes(dia) ? prev.diasSemana.filter((d) => d !== dia) : [...prev.diasSemana, dia],
        }))
    }

    const handleTeacherChange = (teacherId: string) => {
        setFormData((prev) => ({
            ...prev,
            teacherIds: prev.teacherIds.includes(teacherId)
                ? prev.teacherIds.filter((id) => id !== teacherId)
                : [...prev.teacherIds, teacherId],
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Preparar dados para envio
            const payload = {
                nome: formData.nome,
                nivel: formData.nivel || null,
                turno: formData.turno,
                horario:
                    formData.horarioInicio && formData.horarioFim
                        ? {
                            inicio: formData.horarioInicio,
                            fim: formData.horarioFim,
                            diasSemana: formData.diasSemana,
                        }
                        : null,
                institutionId: formData.institutionId,
                teacherIds: formData.teacherIds,
            }

            // URL a ser definida
            const response = await fetch("http://localhost:3000/classrooms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })

            if (response.ok) {
                console.log("Turma cadastrada com sucesso!")
                // Redirecionar para listagem de turmas
                handleBack()
            } else {
                console.error("Erro ao cadastrar turma")
            }
        } catch (error) {
            console.error("Erro:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleBack = () => {
        console.log("Voltar para listagem de turmas")
        // Implementar navegação
    }

    return (
        <div className="cadastro-container">
            <div className="cadastro-content">
                {/* Header */}
                <div className="header">
                    <div className="header-left">
                        <button className="back-button" onClick={handleBack}>
                            ←
                        </button>
                        <div className="header-info">
                            <h1>Nova Turma</h1>
                            <p>Cadastrar nova turma</p>
                        </div>
                    </div>
                    <div className="header-icon">➕</div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="cadastro-form">
                    <div className="form-section">
                        <h3>Informações Básicas</h3>

                        <div className="input-group">
                            <label>Nome da Turma *</label>
                            <input
                                type="text"
                                placeholder="Ex: Jardim I - Manhã"
                                value={formData.nome}
                                onChange={(e) => handleInputChange("nome", e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-row">
                            <div className="input-group">
                                <label>Nível</label>
                                <select value={formData.nivel} onChange={(e) => handleInputChange("nivel", e.target.value)}>
                                    <option value="">Selecione o nível</option>
                                    {niveis.map((nivel) => (
                                        <option key={nivel.value} value={nivel.value}>
                                            {nivel.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-group">
                                <label>Turno *</label>
                                <select value={formData.turno} onChange={(e) => handleInputChange("turno", e.target.value)} required>
                                    {turnos.map((turno) => (
                                        <option key={turno.value} value={turno.value}>
                                            {turno.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Horários</h3>

                        <div className="input-row">
                            <div className="input-group">
                                <label>Horário Início</label>
                                <input
                                    type="time"
                                    value={formData.horarioInicio}
                                    onChange={(e) => handleInputChange("horarioInicio", e.target.value)}
                                />
                            </div>

                            <div className="input-group">
                                <label>Horário Fim</label>
                                <input
                                    type="time"
                                    value={formData.horarioFim}
                                    onChange={(e) => handleInputChange("horarioFim", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Dias da Semana</label>
                            <div className="checkbox-grid">
                                {diasSemanaOptions.map((dia) => (
                                    <label key={dia} className="label-checkbox-item">
                                        <input
                                            type="checkbox"
                                            className="checkbox-item-dias"
                                            checked={formData.diasSemana.includes(dia)}
                                            onChange={() => handleDiasSemanaChange(dia)}
                                        />
                                        <span>{dia}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Vinculações</h3>

                        <div className="input-group">
                            <label>Instituição *</label>
                            <select
                                value={formData.institutionId}
                                onChange={(e) => handleInputChange("institutionId", e.target.value)}
                                required
                            >
                                <option value="">Selecione a instituição</option>
                                {institutions.map((institution) => (
                                    <option key={institution.id} value={institution.id}>
                                        {institution.nome}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group">
                            <label>Professores</label>
                            <div className="teachers-grid">
                                {teachers.map((teacher) => (
                                    <label key={teacher.id} className="teacher-item">
                                        <input
                                            className="checkbox-item"
                                            type="checkbox"
                                            checked={formData.teacherIds.includes(teacher.id)}
                                            onChange={() => handleTeacherChange(teacher.id)}
                                        />
                                        <div className="teacher-info">
                                            <span className="teacher-name">{teacher.nome}</span>
                                            <span className="teacher-specialty">{teacher.especialidade}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-button" onClick={handleBack}>
                            Cancelar
                        </button>
                        <button type="submit" className="submit-button" disabled={isLoading}>
                            {isLoading ? "Cadastrando..." : "Cadastrar Turma"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
