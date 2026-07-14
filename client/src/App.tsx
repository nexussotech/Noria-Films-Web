import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PublicLayout from './components/layout/PublicLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'

const Home         = lazy(() => import('./pages/Home/Home'))
const Login        = lazy(() => import('./pages/Login/Login'))
const Register     = lazy(() => import('./pages/Register/Register'))
const Quote        = lazy(() => import('./pages/Quote/Quote'))
const MyQuotes     = lazy(() => import('./pages/MyQuotes/MyQuotes'))
const NotFound     = lazy(() => import('./pages/NotFound/NotFound'))

const Fallback = () => <div className="page-loading">Cargando...</div>

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Suspense fallback={<Fallback />}>
          <Routes>
            {/* Públicas */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/login"         element={<Login />} />
            <Route path="/registro"      element={<Register />} />

            {/* Protegidas — requieren sesión */}
            <Route path="/cotizacion" element={
              <ProtectedRoute><Quote /></ProtectedRoute>
            } />
            <Route path="/mis-cotizaciones" element={
              <ProtectedRoute><MyQuotes /></ProtectedRoute>
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}
