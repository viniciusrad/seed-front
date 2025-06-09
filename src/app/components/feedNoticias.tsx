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
      message: 'Reunião importante para acompanhamento pedagógico',
      sender: 'Maria Silva',
      reactions: 15,
      imgSource: '/images/reuniao.jpg'
    },
    {
      id: '2', 
      titulo: 'Festa Junina',
      conteudo: 'Venha participar da nossa tradicional festa junina!',
      dataPublicacao: '2024-02-14',
      autor: 'Direção',
      type: 'evento',
      message: 'Traga sua família para nossa festa junina com muitas comidas típicas',
      sender: 'João Santos',
      reactions: 32,
      imgSource: '/images/festa-junina.jpg'
    },
    {
      id: '3',
      titulo: 'Resultado das Avaliações',
      conteudo: 'As notas do bimestre já estão disponíveis no portal',
      dataPublicacao: '2024-02-13', 
      autor: 'Secretaria',
      type: 'informativo',
      message: 'Acesse o portal para consultar as notas dos alunos',
      sender: 'Ana Oliveira',
      reactions: 8,
      imgSource: '/images/notas.jpg'
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
          <div key={noticia.id} className={styles.noticiaCard}>
            <div className={styles.noticiaHeader}>
              <h3 className={styles.noticiaTitulo}>{noticia.titulo}</h3>
              <span className={`${styles.noticiaType} ${styles[noticia.type]}`}>
                {noticia.type}
              </span>
            </div>
            <p className={styles.noticiaMessage}>{noticia.message}</p>
            {noticia.imgSource && (
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
        ))}
      </div>
    </div>
  );
}
