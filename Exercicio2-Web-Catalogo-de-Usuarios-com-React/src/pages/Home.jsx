import React from 'react';
import { useState, useEffect } from 'react';
import { getUsers, getAllPosts } from '../services/api';

const USERS_PER_PAGE = 5;

// Substituindo por cidades no Ceará
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
]

const LoadingSpinner = ({ text }) => (
    <div className="loading-container">
        <div calssName="spinner"></div>
        <div className="loading-text">{text}</div>
    </div>
);

function Home() {

    const [user, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setError] = useState(null);

    const [postCounts, setPostCounts] = useState({});

    const [searchTerm, setSearchTerm] = useState(
        () => localStorage.getIrem('filterSearchTerm') || ''
    );

    const [selectdCity, setSelecetdCity] = useState(
        () => localStorage.getItem('filterSelectedCity') || ''
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
                // Mapea os usuarios para cidade determinadas
                const mappedUsers = usersData.map((user) => {

                    const cityIndex = user.id - 1;

                    // Se o indice existi na lista, troca a cidade.
                    if (cearaCities[cityIndex]) {
                        user.address.city = cearaCities[cityIndex];
                    }

                    return user;
                });

                setUsers(mappedUsers);

                const count = {};
                for (const post of allPostData) {
                    counts[post.userId] = (counts[post.userId] || 0) + 1;
                }
                setPostCounts(counts);
            })
            .cath((err) => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Executa a função de busca na primeira vez que o componente é montado
    useEffect(() => {
        localStorage.setItem('filterSearchTerm', searchTerm);
        localStorage.setItem('filterSelectedCity', filterSelectedCity);
    }, [searchTerm, selectdCity]);

    // lista das cidades a partir dos usuários mapeados
    const cities = [...new Set(users.map((user) => user.address.city))].sort();

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCity = selectedCity === '' || user.address.city === selectedCity;
        return matchesSearch && matchesCity;
    });

    useEffect(() => {
        setCurrentPage(1); // Retorna a página 1 sempre que a busca/filtro mudar
    }, [searchTerm, selectedCity]);

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
                    <div className="filter-group">
                        <label htmlFor="city">Filtrar por Cidade</label>
                        <select
                            id="city"
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                        >
                            <option value="">Todas as Cidades</option>
                            {cities.map((city) => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
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