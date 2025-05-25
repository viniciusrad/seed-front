"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import "./login.css"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [userType, setUserType] = useState("funcionario")
    const [erro, setErro] = useState("")
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErro("")
        console.log("Login attempt:", { email, password, userType })

        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            })

            if (!response.ok) {
                throw new Error('Falha na autenticação')
            }

            const data = await response.json()
            console.log('Login realizado com sucesso:', data)
            
            // Salva o token de autenticação
            document.cookie = `auth-token=${data.access_token}; path=/; max-age=86400`
            
            // Aguarda um momento para garantir que o cookie foi salvo
            setTimeout(() => {
                router.push('/home')
                router.refresh() // Força a atualização da rota
            }, 100)

        } catch (error) {
            console.error('Erro ao fazer login:', error)
            setErro('Email ou senha inválidos')
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="header">
                    <h1>Creche Barone</h1>
                    <p>Acesso ao Sistema</p>
                </div>
                <div className="avatar-section">
                    <img
                        src="/seed-logo.png"
                        alt="Logo do Sistema"
                        width={120}
                        height={120}
                        style={{
                            objectFit: "contain",
                            margin: "0 auto"
                        }}
                    />
                </div>

                {erro && <div className="erro-mensagem">{erro}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="seu.email@creche.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Sua senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <select value={userType} onChange={(e) => setUserType(e.target.value)}>
                            <option value="funcionario">👨‍🏫 Funcionário</option>
                            <option value="responsavel">👨‍👩‍👧‍👦 Responsável</option>
                            <option value="administrador">⚙️ Administrador</option>
                        </select>
                    </div>

                    <button type="submit" className="login-button">
                        Entrar no Sistema
                    </button>

                    <button type="button" className="forgot-button">
                        Esqueci minha senha
                    </button>
                </form>

                <div className="footer">
                    <p>Primeira vez? Entre em contato com a administração</p>
                </div>
            </div>
        </div>
    )
}
