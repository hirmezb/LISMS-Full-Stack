import axios from 'axios';

/**
 * Axios instance configured for the backend API.
 *
 * The baseURL points to the Django development server.  When deploying
 * to production you should adjust this value to the correct host and
 * optionally set up a reverse proxy (e.g. Nginx) to serve both the
 * frontend and backend from the same domain.
 */
const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

export default api;