'use client';

import { useState, useEffect } from 'react';
import styles from './feedNoticias.module.css';

interface Noticia {
  id: string;
  titulo: string;
  conteudo: string;
  dataPublicacao: string;
  autor: string;
}

export default function FeedNoticias() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [noticiaExpandida, setNoticiaExpandida] = useState<string | null>(null);

  const toggleNoticia = (id: string) => {
    setNoticiaExpandida(noticiaExpandida === id ? null : id);
  };

  interface Noticia {
    id: string;
    titulo: string;
    conteudo: string;
    dataPublicacao: string;
    autor: string;
    type: string;
    message: string;
    sender: string;
    reactions: number;
    imgSource: string;
  }

  const noticiasMock: Noticia[] = [
    {
      id: '1',
      titulo: 'Reunião de Pais',
      conteudo: 'Informamos que haverá reunião de pais no próximo sábado',
      dataPublicacao: '2024-02-15',
      autor: 'Coordenação Escolar',
      type: 'aviso',
      message: 'Reunião importante para acompanhamento pedagógico dos alunos do ensino fundamental',
      sender: 'Maria Silva',
      reactions: 15,
      imgSource: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop'
    },
    {
      id: '2', 
      titulo: 'Festa Junina',
      conteudo: 'Venha participar da nossa tradicional festa junina!',
      dataPublicacao: '2024-02-14',
      autor: 'Direção',
      type: 'evento',
      message: 'Traga sua família para nossa festa junina com muitas comidas típicas e apresentações culturais',
      sender: 'João Santos',
      reactions: 32,
      imgSource: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?w=800'
    },
    {
      id: '3',
      titulo: 'Resultado das Avaliações',
      conteudo: 'As notas do bimestre já estão disponíveis no portal',
      dataPublicacao: '2024-02-13', 
      autor: 'Secretaria',
      type: 'informativo',
      message: 'Acesse o portal para consultar as notas dos alunos do ensino médio',
      sender: 'Ana Oliveira',
      reactions: 8,
      imgSource: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&auto=format&fit=crop'
    },
    {
      id: '4',
      titulo: 'Olimpíada de Matemática',
      conteudo: 'Inscrições abertas para a Olimpíada de Matemática',
      dataPublicacao: '2024-02-12',
      autor: 'Coordenação de Matemática',
      type: 'evento',
      message: 'Participe da nossa Olimpíada de Matemática e concorra a prêmios',
      sender: 'Carlos Mendes',
      reactions: 25,
      imgSource: 'https://images.pexels.com/photos/5905708/pexels-photo-5905708.jpeg?w=800'
    },
    {
      id: '5',
      titulo: 'Manutenção do Portal',
      conteudo: 'Portal ficará indisponível neste fim de semana',
      dataPublicacao: '2024-02-11',
      autor: 'TI',
      type: 'aviso',
      message: 'O portal estará em manutenção das 20h de sábado até 8h de domingo',
      sender: 'Pedro Costa',
      reactions: 5,
      imgSource: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop'
    },
    {
      id: '6',
      titulo: 'Feira de Ciências',
      conteudo: 'Preparem seus projetos para a Feira de Ciências',
      dataPublicacao: '2024-02-10',
      autor: 'Coordenação de Ciências',
      type: 'evento',
      message: 'A Feira de Ciências acontecerá no próximo mês, preparem seus projetos',
      sender: 'Juliana Alves',
      reactions: 18,
      imgSource: 'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?w=800'
    },
    {
      id: '7',
      titulo: 'Novo Laboratório',
      conteudo: 'Inauguração do novo laboratório de informática',
      dataPublicacao: '2024-02-09',
      autor: 'Direção',
      type: 'informativo',
      message: 'Novo laboratório de informática com equipamentos de última geração',
      sender: 'Roberto Lima',
      reactions: 45,
      imgSource: 'https://images.unsplash.com/photo-1581092921461-39b9d08a9b21?w=800&auto=format&fit=crop'
    },
    {
      id: '8',
      titulo: 'Campanha de Vacinação',
      conteudo: 'Campanha de vacinação contra gripe',
      dataPublicacao: '2024-02-08',
      autor: 'Enfermaria',
      type: 'aviso',
      message: 'Traga sua carteira de vacinação para atualização',
      sender: 'Dra. Mariana',
      reactions: 12,
      imgSource: 'https://images.pexels.com/photos/4226891/pexels-photo-4226891.jpeg?w=800'
    },
    {
      id: '9',
      titulo: 'Concurso de Redação',
      conteudo: 'Inscrições abertas para o Concurso de Redação',
      dataPublicacao: '2024-02-07',
      autor: 'Coordenação de Português',
      type: 'evento',
      message: 'Participe do concurso e concorra a uma bolsa de estudos',
      sender: 'Prof. Ricardo',
      reactions: 30,
      imgSource: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop'
    },
    {
      id: '10',
      titulo: 'Atualização do Regimento',
      conteudo: 'Novas regras do regimento escolar',
      dataPublicacao: '2024-02-06',
      autor: 'Direção',
      type: 'informativo',
      message: 'Confira as atualizações no regimento escolar para 2024',
      sender: 'Dr. Paulo',
      reactions: 22,
      imgSource: 'https://images.pexels.com/photos/5905445/pexels-photo-5905445.jpeg?w=800'
    },
    {
      id: '11',
      titulo: 'Manutenção Elétrica',
      conteudo: 'Manutenção programada no sistema elétrico',
      dataPublicacao: '2024-02-05',
      autor: 'Manutenção',
      type: 'aviso',
      message: 'A escola ficará sem energia elétrica neste sábado das 8h às 12h',
      sender: 'José Silva',
      reactions: 7,
      imgSource: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop'
    },
    {
      id: '12',
      titulo: 'Festival de Música',
      conteudo: 'Inscrições abertas para o Festival de Música',
      dataPublicacao: '2024-02-04',
      autor: 'Coordenação de Artes',
      type: 'evento',
      message: 'Mostre seu talento no Festival de Música da escola',
      sender: 'Prof. Música',
      reactions: 28,
      imgSource: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?w=800'
    },
    {
      id: '13',
      titulo: 'Biblioteca Digital',
      conteudo: 'Nova plataforma de biblioteca digital',
      dataPublicacao: '2024-02-03',
      autor: 'Biblioteca',
      type: 'informativo',
      message: 'Acesse nossa nova biblioteca digital com mais de 1000 títulos',
      sender: 'Bibliotecária Ana',
      reactions: 35,
      imgSource: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&auto=format&fit=crop'
    },
    {
      id: '14',
      titulo: 'Campanha de Doação',
      conteudo: 'Campanha de doação de alimentos',
      dataPublicacao: '2024-02-02',
      autor: 'Coordenação Social',
      type: 'aviso',
      message: 'Participe da nossa campanha de doação de alimentos não perecíveis',
      sender: 'Maria Social',
      reactions: 40,
      imgSource: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?w=800'
    },
    {
      id: '15',
      titulo: 'Simulado ENEM',
      conteudo: 'Simulado ENEM para alunos do 3º ano',
      dataPublicacao: '2024-02-01',
      autor: 'Coordenação Pedagógica',
      type: 'evento',
      message: 'Prepare-se para o ENEM com nosso simulado oficial',
      sender: 'Coord. Pedagógica',
      reactions: 50,
      imgSource: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop'
    }
  ];

  useEffect(() => {
    const buscarNoticias = async () => {
      try {
        // const resposta = await fetch('http://localhost:3000/noticias', {
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('seed_authToken')}`
        //   }
        // });

        // if (!resposta.ok) {
        //   throw new Error('Erro ao carregar notícias');
        // }

        // const dados = await resposta.json();
        // setNoticias(dados);
        setNoticias(noticiasMock);
        setCarregando(false);
      } catch (err) {
        setErro('Falha ao carregar as notícias');
        setCarregando(false);
        console.error(err);
      }
    };

    buscarNoticias();
  }, []);

  if (carregando) {
    return <div className={styles.carregando}>Carregando notícias...</div>;
  }

  if (erro) {
    return <div className={styles.erro}>{erro}</div>;
  }

  return (
    <div className={styles.feedContainer}>
      <h2 className={styles.titulo}>Últimas Notícias</h2>
      <div className={styles.listaNoticias}>
        {noticias.map((noticia) => (
          <div 
            key={noticia.id} 
            className={`${styles.noticiaCard} ${noticiaExpandida === noticia.id ? styles.expandida : ''}`}
            onClick={() => toggleNoticia(noticia.id)}
          >
            <div className={styles.noticiaHeader}>
              <h3 className={styles.noticiaTitulo}>{noticia.titulo}</h3>
              <span className={`${styles.noticiaType} ${styles[noticia.type]}`}>
                {noticia.type}
              </span>
            </div>
            <div className={styles.noticiaConteudo}>
              <p className={styles.noticiaMessage}>{noticia.message}</p>
              {noticiaExpandida === noticia.id && noticia.imgSource && (
                <img 
                  src={noticia.imgSource} 
                  alt={noticia.titulo}
                  className={styles.noticiaImagem} 
                />
              )}
              <div className={styles.noticiaRodape}>
                <div className={styles.noticiaInfo}>
                  <span className={styles.noticiaSender}>{noticia.sender}</span>
                  <span className={styles.noticiaData}>
                    {new Date(noticia.dataPublicacao).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className={styles.noticiaReactions}>
                  <span>👍 {noticia.reactions}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
