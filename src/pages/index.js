import { useState, useEffect } from 'react'
import Head from "next/head"
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const { user } = useAuth()
  const [myEvents, setMyEvents] = useState([])
  const [otherEvents, setOtherEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('proximos')
  const [userProfile, setUserProfile] = useState(null)

  useEffect(() => {
    if (user) {
      fetchUserProfile()
      fetchMyEvents()
      fetchOtherEvents()
    } else {
      fetchOtherEvents()
      setLoading(false)
    }
  }, [user, activeFilter])

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('dueño')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      setUserProfile(data)
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const fetchMyEvents = async () => {
    try {
      const now = new Date().toISOString()
      const dateFilter = activeFilter === 'proximos' 
        ? { gte: ['fecha_inicio', now] }
        : { lt: ['fecha_inicio', now] }

      const { data, error } = await supabase
        .from('evento_mascota')
        .select(`
          evento:evento_id (
            *,
            dueño:organizador_id (nombre, foto_perfil)
          ),
          mascota:mascota_id (nombre, foto_perfil)
        `)
        .eq('evento.visibilidad', true)

      if (error) throw error

      // Filter by date on client side since we can't use gte/lt on joined tables easily
      const filteredEvents = data?.filter(item => {
        const eventDate = new Date(item.evento.fecha_inicio)
        const now = new Date()
        return activeFilter === 'proximos' ? eventDate >= now : eventDate < now
      }) || []

      setMyEvents(filteredEvents)
    } catch (error) {
      console.error('Error fetching my events:', error)
      setMyEvents([])
    }
  }

  const fetchOtherEvents = async () => {
    try {
      const now = new Date().toISOString()
      const dateFilter = activeFilter === 'proximos' 
        ? ['gte', 'fecha_inicio', now]
        : ['lt', 'fecha_inicio', now]

      const { data, error } = await supabase
        .from('evento')
        .select(`
          *,
          dueño:organizador_id (nombre, foto_perfil)
        `)
        .eq('visibilidad', true)
        .filter(...dateFilter)
        .order('fecha_inicio', { ascending: activeFilter === 'proximos' })
        .limit(10)

      if (error) throw error
      setOtherEvents(data || [])
    } catch (error) {
      console.error('Error fetching other events:', error)
      setOtherEvents([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getEventTypeIcon = (tipo) => {
    switch (tipo) {
      case 'paseo': return '🚶'
      case 'veterinario': return '🏥'
      case 'entrenamiento': return '🎓'
      case 'competencia': return '🏆'
      case 'adopción': return '❤️'
      default: return '📅'
    }
  }

  const EventCard = ({ event, isMyEvent = false, petInfo = null }) => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '1rem',
      position: 'relative'
    }}>
      {/* Event Type Badge */}
      <div style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        backgroundColor: isMyEvent ? '#8B5CF6' : '#10B981',
        color: 'white',
        padding: '2px 6px',
        borderRadius: '8px',
        fontSize: '0.7rem',
        fontWeight: 'bold',
        zIndex: 1
      }}>
        {isMyEvent ? 'Inscrito' : 'Público'}
      </div>

      {/* Event Image */}
      {event.foto_portada && (
        <div style={{ position: 'relative', height: '140px' }}>
          <img
            src={event.foto_portada}
            alt={event.titulo}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      )}

      <div style={{ padding: '0.75rem' }}>
        {/* Event Title */}
        <h3 style={{ 
          margin: '0 0 0.5rem 0', 
          fontSize: '0.95rem',
          fontWeight: 'bold',
          color: '#333'
        }}>
          {event.titulo}
        </h3>

        {/* Event Description */}
        <p style={{ 
          color: '#666', 
          fontSize: '0.8rem',
          margin: '0 0 0.75rem 0',
          lineHeight: '1.3',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {event.descripcion}
        </p>

        {/* Event Details */}
        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '0.2rem',
            fontSize: '0.75rem',
            color: '#666'
          }}>
            <span style={{ marginRight: '0.4rem' }}>📅</span>
            <span>{formatDate(event.fecha_inicio)} - {formatTime(event.fecha_inicio)}</span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '0.2rem',
            fontSize: '0.75rem',
            color: '#666'
          }}>
            <span style={{ marginRight: '0.4rem' }}>📍</span>
            <span style={{ 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap' 
            }}>
              {event.direccion_completa}
            </span>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            fontSize: '0.75rem',
            color: '#666'
          }}>
            <span style={{ marginRight: '0.4rem' }}>👥</span>
            <span>{event.numero_mascotas_inscritas} asistentes</span>
          </div>
        </div>

        {/* Attendees Section */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginTop: '0.75rem'
        }}>
          <div style={{ fontSize: '0.7rem', color: '#666' }}>
            <strong>Mascotas asistentes:</strong>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.2rem' }}>
              {/* Mock attendee avatars */}
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: '#f0f0f0',
                marginRight: '0.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.6rem'
              }}>🐕</div>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: '#f0f0f0',
                marginRight: '0.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.6rem'
              }}>🐱</div>
              {event.numero_mascotas_inscritas > 2 && (
                <span style={{ fontSize: '0.7rem', color: '#999' }}>
                  +{event.numero_mascotas_inscritas - 2}
                </span>
              )}
            </div>
          </div>

          <div style={{ fontSize: '0.7rem', color: '#999' }}>
            ⭐ {(Math.random() * 2 + 3).toFixed(1)} ({Math.floor(Math.random() * 10 + 1)} reseña{Math.floor(Math.random() * 10 + 1) !== 1 ? 's' : ''})
          </div>
        </div>
      </div>
    </div>
  )

  if (!user) {
    return (
      <>
        <Head>
          <title>PetsEvents - Eventos para Mascotas</title>
          <meta name="description" content="Encuentra eventos increíbles para tu mascota" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        
        <Navbar />
        
        <div style={{ 
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f9fafb',
          padding: '2rem'
        }}>
          <div style={{
            textAlign: 'center',
            backgroundColor: 'white',
            padding: '3rem',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            maxWidth: '500px'
          }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#1f2937' }}>
              🐾 Pet Events
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#6b7280', marginBottom: '2rem' }}>
              ¡Encuentra eventos increíbles para tu mascota!
            </p>
            <p style={{ fontSize: '0.95rem', color: '#9ca3af', marginBottom: '2rem' }}>
              Descubre actividades increíbles cerca de ti
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link href="/auth/login" style={{
                backgroundColor: '#8B5CF6',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}>
                Iniciar Sesión
              </Link>
              <Link href="/auth/register" style={{
                backgroundColor: 'white',
                color: '#8B5CF6',
                border: '2px solid #8B5CF6',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}>
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>PetsEvents - Eventos para Mascotas</title>
        <meta name="description" content="Encuentra eventos increíbles para tu mascota" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          padding: '1rem 2rem',
          borderBottom: '1px solid #e9ecef',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link href="/" style={{
              color: '#333',
              textDecoration: 'none',
              fontSize: '1.4rem',
              fontWeight: 'bold',
              marginRight: '2rem'
            }}>
              🐾 Pet Events
            </Link>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              ¡Encuentra eventos increíbles para tu mascota!
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.9rem', color: '#333' }}>
              {userProfile?.nombre || 'Luis Torres'}
            </span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.8rem'
            }}>
              {userProfile?.nombre ? userProfile.nombre.charAt(0).toUpperCase() : 'L'}
            </div>
            <span style={{ fontSize: '0.9rem', color: '#666' }}>Mirij Mascota(s)</span>
            <Link href="/auth/login" style={{
              color: '#666',
              textDecoration: 'none',
              fontSize: '0.9rem'
            }}>
              Salir
            </Link>
          </div>
        </div>

        <div style={{ padding: '1.5rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
          {/* Welcome Message */}
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              Descubre actividades increíbles cerca de ti
            </p>
          </div>

          {/* Filter Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '0.5rem', 
            marginBottom: '2rem'
          }}>
            <button
              onClick={() => setActiveFilter('proximos')}
              style={{
                backgroundColor: activeFilter === 'proximos' ? '#8B5CF6' : 'white',
                color: activeFilter === 'proximos' ? 'white' : '#666',
                border: '1px solid #ddd',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 'normal',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              ❤️ Próximos
            </button>
            <button
              onClick={() => setActiveFilter('pasados')}
              style={{
                backgroundColor: activeFilter === 'pasados' ? '#666' : 'white',
                color: activeFilter === 'pasados' ? 'white' : '#666',
                border: '1px solid #ddd',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 'normal',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              📅 Pasados
            </button>
          </div>

          {/* Mis Eventos Section */}
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '1rem' 
            }}>
              <h2 style={{ 
                fontSize: '1.1rem', 
                fontWeight: 'bold', 
                color: '#333',
                margin: 0
              }}>
                🐾 Mis Eventos
              </h2>
              <Link href="/events/create" style={{
                backgroundColor: '#8B5CF6',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}>
                + Crear Evento
              </Link>
            </div>

            <p style={{ 
              color: '#666', 
              fontSize: '0.8rem', 
              marginBottom: '1.5rem' 
            }}>
              Eventos donde tu mascota está registrada
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1rem'
            }}>
              {loading ? (
                <p style={{ color: '#666' }}>Cargando eventos...</p>
              ) : myEvents.length > 0 ? (
                myEvents.map((item) => (
                  <EventCard 
                    key={`my-${item.evento.id}`} 
                    event={item.evento} 
                    isMyEvent={true}
                    petInfo={item.mascota}
                  />
                ))
              ) : (
                <div style={{
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  textAlign: 'center',
                  color: '#666',
                  fontSize: '0.85rem'
                }}>
                  <p>No tienes eventos {activeFilter === 'proximos' ? 'próximos' : 'pasados'}</p>
                </div>
              )}
            </div>
          </div>

          {/* Otros Eventos Section */}
          <div>
            <h2 style={{ 
              fontSize: '1.1rem', 
              fontWeight: 'bold', 
              color: '#333',
              marginBottom: '1rem'
            }}>
              🏠 Otros Eventos
            </h2>

            <p style={{ 
              color: '#666', 
              fontSize: '0.8rem', 
              marginBottom: '1.5rem' 
            }}>
              Eventos disponibles donde puedes registrar tu mascota
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1rem'
            }}>
              {loading ? (
                <p style={{ color: '#666' }}>Cargando eventos...</p>
              ) : otherEvents.length > 0 ? (
                otherEvents.map((event) => (
                  <EventCard 
                    key={`other-${event.id}`} 
                    event={event} 
                    isMyEvent={false}
                  />
                ))
              ) : (
                <div style={{
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  textAlign: 'center',
                  color: '#666',
                  fontSize: '0.85rem'
                }}>
                  <p>No hay eventos {activeFilter === 'proximos' ? 'próximos' : 'pasados'} disponibles</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
