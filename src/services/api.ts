import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backendunipizza.herokuapp.com/'
});

export { api };