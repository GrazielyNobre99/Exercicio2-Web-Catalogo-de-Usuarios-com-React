const BASE_URL = 'https://jsonplaceholder.typicode.com';

/* TRATAR A RESPOSTA DO FETCH */
const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error('Erro na requisição');
  }
  return response.json();
};

/* BUSCA A LISTA DOS USUÁRIOS */
export const getUsers = () => {
  return fetch(`${BASE_URL}/users`).then(handleResponse);
};

/* BUSCA UM USUÁRIO ESPECÍFICO PELO SEU ID */
export const getUser = (id) => {
  return fetch(`${BASE_URL}/users/${id}`).then(handleResponse);
};

/* BUSCA TODOS OS POSTS DE UM USUÁRIO ESPECÍFICO */
export const getUserPosts = (id) => {
  return fetch(`${BASE_URL}/users/${id}/posts`).then(handleResponse);
};

/* BUSCA TODOS OS POSTS PARA CONTAGEM */
export const getAllPosts = () => {
  return fetch(`${BASE_URL}/posts`).then(handleResponse);
};