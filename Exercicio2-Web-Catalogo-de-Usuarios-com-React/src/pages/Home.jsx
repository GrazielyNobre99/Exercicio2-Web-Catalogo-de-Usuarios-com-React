import React from 'react';
import { useState, useEffect } from 'react';
import { getUsers, getAllPosts } from '../services/api';
import { Link } from 'react-router-dom';

const USERS_PER_PAGE = 5;


const LoadingSpinner = ({ text }) => (
    <div className="loading-container">
        <div className="spinner"></div>
        <div className="loading-text">{text}</div>
    </div>
);

function Home() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [postCounts, setPostCounts] = useState({});

    const [searchTerm, setSearchTerm] = useState(
        () => localStorage.getItem('filterSearchTerm') || ''
    );

    // Estado da página atual
    const [currentPage, setCurrentPage] = useState(1);

    // Busca dados
    const fetchUsersAndPosts = () => {
        setLoading(true);
        setError(null);

        // Buscas usuários e todos os POST
        Promise.all([getUsers(), getAllPosts()])
            .then(([usersData, allPostsData]) => {

                const postCountsMap = {};
                for (const post of allPostsData) {
                    postCountsMap[post.userId] = (postCountsMap[post.userId] || 0) + 1;
                }

                setUsers(usersData);

                setPostCounts(postCountsMap);

            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchUsersAndPosts();
    }, []);

    // Executa a função de busca na primeira vez que o componente é montado
    useEffect(() => {
        localStorage.setItem('filterSearchTerm', searchTerm);
    }, [searchTerm]);

    // lista das cidades a partir dos usuários mapeados
    const cities = [...new Set(users.map((user) => user.address.city))].sort();

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    useEffect(() => {
        setCurrentPage(1); // Retorna a página 1 sempre que a busca/filtro mudar
    }, [searchTerm]);

    // Paginação
    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
    const startIndex = (currentPage - 1) * USERS_PER_PAGE;
    const endIndex = startIndex + USERS_PER_PAGE;
    const usersToDisplay = filteredUsers.slice(startIndex, endIndex);

    if (loading) {
        return <LoadingSpinner text="Carregando usuários..." />;
    }

    if (error) {
        return (
            <div className="error">
                Erro ao carregar usuários: {error}
                <button className="button" onClick={fetchUsersAndPosts}>Tente Novamente</button>
            </div>
        );
    }

    return (
        <>
            <div className="page-content">
                <h2>Lista de Usuários</h2>

                <div className="filters-container">
                    <div className="filter-group">
                        <label htmlFor="search">Busque por Nome ou E-mail</label>
                        <input
                            type="text"
                            id="search"
                            placeholder="Digite para buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Contagem baseada nos usuários filtrados */}
                <div className="results-count">
                    Exibindo {filteredUsers.length} de {users.length} usuários.
                </div>

                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>E-mail</th>
                            <th>Cidade</th>
                            <th>Total de Posts</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* .map na lista paginada */}
                        {usersToDisplay.map((user) => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.address.city}</td>
                                <td className="posts-count-cell">
                                    {postCounts[user.id] || 0}
                                </td>
                                <td>
                                    <Link to={`/usuario/${user.id}`} className="button">Ver detalhes</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Controles de Paginação */}
                {totalPages > 1 && (
                    <div className="pagination-controls">
                        <button
                            onClick={() => setCurrentPage((prev) => prev - 1)}
                            disabled={currentPage === 1} // Desabilita na primeira página
                        >Anterior</button>

                        <span className="page-info">
                            Página {currentPage} de {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                            disabled={currentPage === totalPages} // Desabilita na última página
                        >Próxima</button>
                    </div>
                )}
            </div>
        </>
    );
}

export default Home;