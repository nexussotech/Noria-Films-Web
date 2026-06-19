import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedAdminRoute from './components/auth/ProtectedAdminRoute'
import AdminLayout from './components/layout/AdminLayout'

const AdminLogin    = lazy(() => import('./pages/Login/Login'))
const Dashboard     = lazy(() => import('./pages/Dashboard/Dashboard'))
const Users         = lazy(() => import('./pages/Users/Users'))
const UserDetail    = lazy(() => import('./pages/Users/UserDetail'))
const Quotes        = lazy(() => import('./pages/Quotes/Quotes'))
const Appointments  = lazy(() => import('./pages/Appointments/Appointments'))
const Availability  = lazy(() => import('./pages/Availability/Availability'))
const Messages      = lazy(() => import('./pages/Messages/Messages'))
const Services      = lazy(() => import('./pages/Services/Services'))
const NotFound      = lazy(() => import('./pages/NotFound/NotFound'))

const Fallback = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <span style={{ color: 'var(--gray)', fontSize: '.88rem' }}>Cargando...</span>
  </div>
)

// Layout route: protege y envuelve todas las rutas hijas con Outlet (rutas anidadas)
function AdminShell() {
  return (
    <ProtectedAdminRoute>
      <AdminLayout><Outlet /></AdminLayout>
    </ProtectedAdminRoute>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: { background: '#1a1d27', color: '#F3F3F1', border: '1px solid #2a2d3a', fontSize: '.85rem' },
            success: { iconTheme: { primary: '#5dc98a', secondary: '#1a1d27' } },
            error:   { iconTheme: { primary: '#A73436', secondary: '#F3F3F1' } },
          }}
        />
        <Suspense fallback={<Fallback />}>
          <Routes>
            <Route path="/login" element={<AdminLogin />} />

            {/* Rutas anidadas: AdminShell es el layout padre, cada hijo se renderiza en <Outlet /> */}
            <Route path="/" element={<AdminShell />}>
              <Route index                    element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard"         element={<Dashboard />} />
              <Route path="usuarios"          element={<Users />} />
              <Route path="usuarios/:id"      element={<UserDetail />} />
              <Route path="servicios"         element={<Services />} />
              <Route path="cotizaciones"      element={<Quotes />} />
              <Route path="citas"             element={<Appointments />} />
              <Route path="disponibilidad"    element={<Availability />} />
              <Route path="mensajes"          element={<Messages />} />
              <Route path="*"                 element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}
