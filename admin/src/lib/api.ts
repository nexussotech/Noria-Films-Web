import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('noria_admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('noria_admin_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
