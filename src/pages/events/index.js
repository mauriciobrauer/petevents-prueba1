import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

export default function Events() {
  const { user } = useAuth()
  const router = useRouter()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('upcoming') // upcoming, past, my-events

  useEffect(() => {
    fetchEvents()
  }, [filter])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('evento')
        .select(`
          *,
          dueño:organizador_id (nombre)
        `)

      const now = new Date().toISOString()

      if (filter === 'upcoming') {
        query = query
          .eq('visibilidad', true)
          .gte('fecha_inicio', now)
          .order('fecha_inicio', { ascending: true })
      } else if (filter === 'past') {
        query = query
          .eq('visibilidad', true)
          .lt('fecha_inicio', now)
          .order('fecha_inicio', { ascending: false })
      } else if (filter === 'my-events' && user) {
        query = query
          .eq('organizador_id', user.id)
          .order('fecha_inicio', { ascending: false })
      }

      const { data, error } = await query

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const joinEvent = async (eventId) => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    // Primero verificar si el usuario tiene mascotas
    const { data: pets, error: petsError } = await supabase
      .from('mascota')
      .select('id')
      .eq('dueño_id', user.id)
      .limit(1)

    if (petsError || !pets || pets.length === 0) {
      alert('Necesitas registrar al menos una mascota para unirte a eventos')
      router.push('/pets/create')
      return
    }

    // Por simplicidad, usaremos la primera mascota del usuario
    const petId = pets[0].id

    try {
      // Verificar si ya está inscrito
      const { data: existing } = await supabase
        .from('evento_mascota')
        .select('*')
        .eq('evento_id', eventId)
        .eq('mascota_id', petId)
        .single()

      if (existing) {
        alert('Ya estás inscrito en este evento')
        return
      }

      // Inscribir mascota al evento
      const { error } = await supabase
        .from('evento_mascota')
        .insert([{ evento_id: eventId, mascota_id: petId }])

      if (error) throw error

      // Actualizar contador de mascotas inscritas
      const { error: updateError } = await supabase.rpc('increment_event_pets', {
        event_id: eventId
      })

      if (updateError) {
        console.error('Error updating counter:', updateError)
      }

      alert('¡Te has unido al evento exitosamente!')
      fetchEvents() // Refrescar la lista
    } catch (error) {
      console.error('Error joining event:', error)
      alert('Error al unirse al evento')
    }
  }

  const deleteEvent = async (eventId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('evento')
        .delete()
        .eq('id', eventId)
        .eq('organizador_id', user.id)

      if (error) throw error
      
      setEvents(events.filter(event => event.id !== eventId))
      alert('Evento eliminado exitosamente')
    } catch (error) {
      console.error('Error deleting event:', error)
      alert('Error al eliminar el evento')
    }
  }

  return (
    <>
      <Head>
        <title>Eventos - PetsEvents</title>
      </Head>
      
      <Navbar />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h1>Eventos</h1>
          {user && (
            <Link href="/events/create" style={{
              backgroundColor: '#007cba',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              textDecoration: 'none'
            }}>
              Crear Evento
            </Link>
          )}
        </div>

        {/* Filtros */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '2rem',
          borderBottom: '1px solid #ddd',
          paddingBottom: '1rem'
        }}>
          <button
            onClick={() => setFilter('upcoming')}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: filter === 'upcoming' ? '#007cba' : '#f5f5f5',
              color: filter === 'upcoming' ? 'white' : '#333',
              cursor: 'pointer'
            }}
          >
            Próximos Eventos
          </button>
          <button
            onClick={() => setFilter('past')}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: filter === 'past' ? '#007cba' : '#f5f5f5',
              color: filter === 'past' ? 'white' : '#333',
              cursor: 'pointer'
            }}
          >
            Eventos Pasados
          </button>
          {user && (
            <button
              onClick={() => setFilter('my-events')}
              style={{
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: filter === 'my-events' ? '#007cba' : '#f5f5f5',
                color: filter === 'my-events' ? 'white' : '#333',
                cursor: 'pointer'
              }}
            >
              Mis Eventos
            </button>
          )}
        </div>

        {loading ? (
          <p>Cargando eventos...</p>
        ) : events.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            {events.map((event) => (
              <div key={event.id} style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '1.5rem',
                backgroundColor: 'white'
              }}>
                {event.foto_portada && (
                  <img
                    src={event.foto_portada}
                    alt={event.titulo}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      marginBottom: '1rem'
                    }}
                  />
                )}
                <h3 style={{ marginBottom: '0.5rem' }}>{event.titulo}</h3>
                <p style={{ color: '#666', marginBottom: '1rem' }}>
                  {event.descripcion}
                </p>
                <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                  <p><strong>Fecha:</strong> {new Date(event.fecha_inicio).toLocaleDateString('es-ES')}</p>
                  <p><strong>Hora:</strong> {new Date(event.fecha_inicio).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
                  <p><strong>Lugar:</strong> {event.direccion_completa}</p>
                  <p><strong>Organizador:</strong> {event.dueño?.nombre}</p>
                  <p><strong>Asistentes:</strong> {event.numero_mascotas_inscritas}</p>
                  {event.precio > 0 && <p><strong>Precio:</strong> ${event.precio}</p>}
                  {event.tipo_evento && <p><strong>Tipo:</strong> {event.tipo_evento}</p>}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <Link href={`/events/${event.id}`} style={{
                    backgroundColor: '#6c757d',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    fontSize: '0.9rem'
                  }}>
                    Ver Detalles
                  </Link>

                  {filter === 'upcoming' && user && (
                    <button
                      onClick={() => joinEvent(event.id)}
                      style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      Unirse
                    </button>
                  )}
                  
                  {event.link_google_maps && (
                    <a
                      href={event.link_google_maps}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        backgroundColor: '#17a2b8',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        fontSize: '0.9rem'
                      }}
                    >
                      Ver Mapa
                    </a>
                  )}

                  {filter === 'my-events' && user && event.organizador_id === user.id && (
                    <>
                      <Link href={`/events/edit/${event.id}`} style={{
                        backgroundColor: '#ffc107',
                        color: 'black',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        fontSize: '0.9rem'
                      }}>
                        Editar
                      </Link>
                      <button
                        onClick={() => deleteEvent(event.id)}
                        style={{
                          backgroundColor: '#dc3545',
                          color: 'white',
                          padding: '0.5rem 1rem',
                          borderRadius: '4px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <h2>
              {filter === 'upcoming' && 'No hay eventos próximos'}
              {filter === 'past' && 'No hay eventos pasados'}
              {filter === 'my-events' && 'No has creado eventos'}
            </h2>
            {filter === 'my-events' && user && (
              <Link href="/events/create" style={{
                backgroundColor: '#007cba',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                textDecoration: 'none',
                marginTop: '1rem',
                display: 'inline-block'
              }}>
                Crear tu primer evento
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  )
}
