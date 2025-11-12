import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUser, getUserPosts } from '../services/api';
import Modal from '../components/Modal';

const cearaCities = [
  'Quixadá',
  'Fortaleza',
  'Juazeiro do Norte',
  'Sobral',
  'Crato',
  'Itapipoca',
  'Maracanaú',
  'Caucaia',
  'Iguatu',
  'Canindé',
];

const LoadingSpinner = ({ text }) => (
  <div className="loading-container">
    <div className="spinner"></div>
    <div className="loading-text">{text}</div>
  </div>
);

function UserDetails() {
  // Pega o ID da URL
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Controla qual POST está sendo selecionado para o modal
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [userData, postsData] = await Promise.all([
          getUser(id),
          getUserPosts(id),
        ]);

        const cityIndex = userData.id - 1;
        if (cearaCities[cityIndex]) {
          userData.address.city = cearaCities[cityIndex];
        }
                
        setUser(userData);
        setPosts(postsData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); 
}, [id]); // Se baseia no ID para mudar a URL (Fechando useEffect)

  if (loading) {
    return <LoadingSpinner text="Carregando dados do usuário..." />;
  }

  if (error) {
    return <div className="error">Erro ao carregar os dados: {error}</div>;
  }

  if (!user) {
    return null;
  }

  const address = `${user.address.street}, ${user.address.suite}, ${user.address.city} - ${user.address.zipcode}`;

  return (
    <div className="page-content">
      <Link to="/" className="button-back">&larr; Retornar para a lista</Link>

      <h2>{user.name}</h2>
      <p>@{user.username}</p>

      <div className="user-details-grid">
        <div className="detail-item">
          <label>E-mail</label>
          {user.email}
        </div>
        <div className="detail-item">
          <label>Telefone</label>
          {user.phone}
        </div>
        <div className="detail-item">
          <label>Empresa</label>
          {user.company.name}
        </div>
        <div className="detail-item">
          <label>Website</label>
          <a href={`http://${user.website}`} target="_blank" rel="noopener noreferrer">
            {user.website}
          </a>
        </div>
        <div className="detail-item detail-item-full">
          <label>Endereço</label>
          {address}
        </div>
      </div>

      <div className="posts-container">
        <h3>Posts do Usuário ({posts.length})</h3>
        <ul className="post-list">
          {posts.map((post) => (
            <li key={post.id}>
              <h4>{post.title}</h4>
              <button className="button-secondary" onClick={() => setSelectedPost(post)}>
                Ver conteúdo do Post
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Modal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </div>
  );
}

export default UserDetails;