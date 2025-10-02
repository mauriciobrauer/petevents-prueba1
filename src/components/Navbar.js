import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/router'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <nav style={{
      backgroundColor: '#007cba',
      padding: '1rem 2rem',
      marginBottom: '2rem'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <Link href="/" style={{
          color: 'white',
          textDecoration: 'none',
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>
          🐾 PetsEvents
        </Link>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {user ? (
            <>
              <Link href="/events" style={{ color: 'white', textDecoration: 'none' }}>
                Eventos
              </Link>
              <Link href="/pets" style={{ color: 'white', textDecoration: 'none' }}>
                Mis Mascotas
              </Link>
              <Link href="/events/create" style={{ color: 'white', textDecoration: 'none' }}>
                Crear Evento
              </Link>
              <button
                onClick={handleSignOut}
                style={{
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '1px solid white',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" style={{ color: 'white', textDecoration: 'none' }}>
                Iniciar Sesión
              </Link>
              <Link href="/auth/register" style={{ color: 'white', textDecoration: 'none' }}>
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
