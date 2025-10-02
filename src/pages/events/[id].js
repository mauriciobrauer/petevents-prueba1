import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

export default function EventDetail() {
  const { user } = useAuth()
  const router = useRouter()
  const { id } = router.query
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState([])
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' })
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    if (id) {
      fetchEvent()
      fetchReviews()
    }
  }, [id])

  const fetchEvent = async () => {
    try {
      const { data, error } = await supabase
        .from('evento')
        .select(`
          *,
          dueño:organizador_id (nombre, correo_electronico)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      setEvent(data)
    } catch (error) {
      console.error('Error fetching event:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      // Simulamos reseñas con comentarios en una tabla temporal
      // En una implementación real, crearías una tabla 'reseñas' en Supabase
      setReviews([
        {
          id: 1,
          user_name: 'María García',
          rating: 5,
          comment: '¡Excelente evento! Mi perro se divirtió mucho.',
          created_at: '2024-01-15'
        },
        {
          id: 2,
          user_name: 'Carlos López',
          rating: 4,
          comment: 'Muy bien organizado, aunque podría ser un poco más largo.',
          created_at: '2024-01-14'
        }
      ])
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  const submitReview = async (e) => {
    e.preventDefault()
    if (!user) {
      router.push('/auth/login')
      return
    }

    setSubmittingReview(true)
    try {
      // En una implementación real, insertarías en la tabla de reseñas
      const review = {
        id: Date.now(),
        user_name: user.email.split('@')[0],
        rating: newReview.rating,
        comment: newReview.comment,
        created_at: new Date().toISOString().split('T')[0]
      }
      
      setReviews([review, ...reviews])
      setNewReview({ rating: 5, comment: '' })
      alert('¡Reseña enviada exitosamente!')
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Error al enviar la reseña')
    } finally {
      setSubmittingReview(false)
    }
  }

  const joinEvent = async () => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    // Verificar si el usuario tiene mascotas
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

    const petId = pets[0].id

    try {
      // Verificar si ya está inscrito
      const { data: existing } = await supabase
        .from('evento_mascota')
        .select('*')
        .eq('evento_id', id)
        .eq('mascota_id', petId)
        .single()

      if (existing) {
        alert('Ya estás inscrito en este evento')
        return
      }

      // Inscribir mascota al evento
      const { error } = await supabase
        .from('evento_mascota')
        .insert([{ evento_id: id, mascota_id: petId }])

      if (error) throw error

      alert('¡Te has unido al evento exitosamente!')
      fetchEvent() // Refrescar para actualizar el contador
    } catch (error) {
      console.error('Error joining event:', error)
      alert('Error al unirse al evento')
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem' }}>
          <p>Cargando evento...</p>
        </div>
      </>
    )
  }

  if (!event) {
    return (
      <>
        <Navbar />
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem' }}>
          <p>Evento no encontrado</p>
        </div>
      </>
    )
  }

  const eventDate = new Date(event.fecha_inicio)
  const isPastEvent = eventDate < new Date()

  return (
    <>
      <Head>
        <title>{event.titulo} - PetsEvents</title>
      </Head>
      
      <Navbar />
      
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem' }}>
        {/* Información del evento */}
        <div style={{ marginBottom: '3rem' }}>
          {event.foto_portada && (
            <img
              src={event.foto_portada}
              alt={event.titulo}
              style={{
                width: '100%',
                height: '300px',
                objectFit: 'cover',
                borderRadius: '8px',
                marginBottom: '2rem'
              }}
            />
          )}
          
          <h1 style={{ marginBottom: '1rem' }}>{event.titulo}</h1>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            <div>
              <h3>Descripción</h3>
              <p style={{ lineHeight: '1.6', marginBottom: '1.5rem' }}>
                {event.descripcion}
              </p>
              
              {event.restriccion_tipo && (
                <p><strong>Restricción de tipo:</strong> {event.restriccion_tipo}</p>
              )}
              {event.restriccion_tamaño && (
                <p><strong>Restricción de tamaño:</strong> {event.restriccion_tamaño}</p>
              )}
            </div>
            
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '1.5rem',
              borderRadius: '8px'
            }}>
              <h3 style={{ marginBottom: '1rem' }}>Detalles del Evento</h3>
              <div style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
                <p><strong>Fecha:</strong> {eventDate.toLocaleDateString('es-ES')}</p>
                <p><strong>Hora:</strong> {eventDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
                <p><strong>Lugar:</strong> {event.direccion_completa}</p>
                <p><strong>Organizador:</strong> {event.dueño?.nombre}</p>
                <p><strong>Asistentes:</strong> {event.numero_mascotas_inscritas}</p>
                {event.aforo_maximo && <p><strong>Aforo máximo:</strong> {event.aforo_maximo}</p>}
                {event.precio > 0 && <p><strong>Precio:</strong> ${event.precio}</p>}
                {event.tipo_evento && <p><strong>Tipo:</strong> {event.tipo_evento}</p>}
                {event.duracion_estimada && <p><strong>Duración:</strong> {event.duracion_estimada}</p>}
              </div>
              
              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {!isPastEvent && user && (
                  <button
                    onClick={joinEvent}
                    style={{
                      backgroundColor: '#28a745',
                      color: 'white',
                      padding: '0.75rem 1rem',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Unirse al Evento
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
                      padding: '0.75rem 1rem',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      textAlign: 'center'
                    }}
                  >
                    Ver en Google Maps
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sección de reseñas */}
        {event.permite_comentarios && (
          <div>
            <h2 style={{ marginBottom: '2rem' }}>Reseñas y Comentarios</h2>
            
            {/* Formulario para nueva reseña */}
            {user && isPastEvent && (
              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '1.5rem',
                borderRadius: '8px',
                marginBottom: '2rem'
              }}>
                <h3 style={{ marginBottom: '1rem' }}>Deja tu reseña</h3>
                <form onSubmit={submitReview}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="rating">Calificación:</label>
                    <select
                      id="rating"
                      value={newReview.rating}
                      onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                      style={{
                        marginLeft: '0.5rem',
                        padding: '0.25rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                      <option value={4}>⭐⭐⭐⭐ (4)</option>
                      <option value={3}>⭐⭐⭐ (3)</option>
                      <option value={2}>⭐⭐ (2)</option>
                      <option value={1}>⭐ (1)</option>
                    </select>
                  </div>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="comment">Comentario:</label>
                    <textarea
                      id="comment"
                      value={newReview.comment}
                      onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                      required
                      rows="4"
                      style={{
                        width: '100%',
                        padding: '8px',
                        marginTop: '5px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={submittingReview}
                    style={{
                      backgroundColor: '#007cba',
                      color: 'white',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: submittingReview ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {submittingReview ? 'Enviando...' : 'Enviar Reseña'}
                  </button>
                </form>
              </div>
            )}

            {/* Lista de reseñas */}
            <div>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    marginBottom: '1rem',
                    backgroundColor: 'white'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.5rem'
                    }}>
                      <strong>{review.user_name}</strong>
                      <div>
                        {'⭐'.repeat(review.rating)}
                        <span style={{ marginLeft: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
                          {review.created_at}
                        </span>
                      </div>
                    </div>
                    <p style={{ margin: 0, lineHeight: '1.5' }}>{review.comment}</p>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
                  Aún no hay reseñas para este evento.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
