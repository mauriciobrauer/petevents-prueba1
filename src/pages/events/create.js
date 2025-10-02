import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

export default function CreateEvent() {
  const { user } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    tipo_evento: '',
    fecha_inicio: '',
    hora_inicio: '',
    duracion_estimada: '',
    direccion_completa: '',
    link_google_maps: '',
    aforo_maximo: '',
    precio: '',
    restriccion_tipo: '',
    restriccion_tamaño: '',
    foto_portada: '',
    permite_comentarios: true,
    visibilidad: true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
    }
  }, [user, router])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Combinar fecha y hora
      const fechaHora = new Date(`${formData.fecha_inicio}T${formData.hora_inicio}`)
      
      const eventData = {
        organizador_id: user.id,
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        tipo_evento: formData.tipo_evento,
        fecha_inicio: fechaHora.toISOString(),
        duracion_estimada: formData.duracion_estimada ? `${formData.duracion_estimada} hours` : null,
        direccion_completa: formData.direccion_completa,
        link_google_maps: formData.link_google_maps || null,
        aforo_maximo: formData.aforo_maximo ? parseInt(formData.aforo_maximo) : null,
        precio: formData.precio ? parseFloat(formData.precio) : 0,
        restriccion_tipo: formData.restriccion_tipo || null,
        restriccion_tamaño: formData.restriccion_tamaño || null,
        foto_portada: formData.foto_portada || null,
        permite_comentarios: formData.permite_comentarios,
        visibilidad: formData.visibilidad,
        estado: 'pendiente'
      }

      const { error } = await supabase
        .from('evento')
        .insert([eventData])

      if (error) throw error

      router.push('/events')
    } catch (error) {
      console.error('Error creating event:', error)
      setError('Error al crear el evento: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <>
      <Head>
        <title>Crear Evento - PetsEvents</title>
      </Head>
      
      <Navbar />
      
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 2rem' }}>
        <h1>Crear Nuevo Evento</h1>

        {error && (
          <div style={{ 
            color: 'red', 
            backgroundColor: '#ffebee', 
            padding: '10px', 
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="titulo">Título del Evento *:</label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '8px',
                marginTop: '5px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="descripcion">Descripción *:</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
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

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="tipo_evento">Tipo de Evento:</label>
            <select
              id="tipo_evento"
              name="tipo_evento"
              value={formData.tipo_evento}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px',
                marginTop: '5px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            >
              <option value="">Selecciona un tipo</option>
              <option value="paseo">Paseo Grupal</option>
              <option value="entrenamiento">Entrenamiento</option>
              <option value="socialización">Socialización</option>
              <option value="competencia">Competencia</option>
              <option value="adopción">Evento de Adopción</option>
              <option value="veterinario">Consulta Veterinaria</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label htmlFor="fecha_inicio">Fecha *:</label>
              <input
                type="date"
                id="fecha_inicio"
                name="fecha_inicio"
                value={formData.fecha_inicio}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  marginTop: '5px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
            <div>
              <label htmlFor="hora_inicio">Hora *:</label>
              <input
                type="time"
                id="hora_inicio"
                name="hora_inicio"
                value={formData.hora_inicio}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  marginTop: '5px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="duracion_estimada">Duración Estimada (horas):</label>
            <input
              type="number"
              id="duracion_estimada"
              name="duracion_estimada"
              value={formData.duracion_estimada}
              onChange={handleChange}
              min="0.5"
              step="0.5"
              style={{
                width: '100%',
                padding: '8px',
                marginTop: '5px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="direccion_completa">Dirección *:</label>
            <input
              type="text"
              id="direccion_completa"
              name="direccion_completa"
              value={formData.direccion_completa}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '8px',
                marginTop: '5px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="link_google_maps">Link de Google Maps:</label>
            <input
              type="url"
              id="link_google_maps"
              name="link_google_maps"
              value={formData.link_google_maps}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px',
                marginTop: '5px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label htmlFor="aforo_maximo">Aforo Máximo:</label>
              <input
                type="number"
                id="aforo_maximo"
                name="aforo_maximo"
                value={formData.aforo_maximo}
                onChange={handleChange}
                min="1"
                style={{
                  width: '100%',
                  padding: '8px',
                  marginTop: '5px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
            <div>
              <label htmlFor="precio">Precio ($):</label>
              <input
                type="number"
                id="precio"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                min="0"
                step="0.01"
                style={{
                  width: '100%',
                  padding: '8px',
                  marginTop: '5px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="restriccion_tipo">Restricción por Tipo de Animal:</label>
            <input
              type="text"
              id="restriccion_tipo"
              name="restriccion_tipo"
              value={formData.restriccion_tipo}
              onChange={handleChange}
              placeholder="ej: Solo perros, Solo gatos, etc."
              style={{
                width: '100%',
                padding: '8px',
                marginTop: '5px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="restriccion_tamaño">Restricción por Tamaño:</label>
            <select
              id="restriccion_tamaño"
              name="restriccion_tamaño"
              value={formData.restriccion_tamaño}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px',
                marginTop: '5px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            >
              <option value="">Sin restricción</option>
              <option value="pequeño">Solo mascotas pequeñas</option>
              <option value="mediano">Solo mascotas medianas</option>
              <option value="grande">Solo mascotas grandes</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="foto_portada">URL de Foto de Portada:</label>
            <input
              type="url"
              id="foto_portada"
              name="foto_portada"
              value={formData.foto_portada}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px',
                marginTop: '5px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                name="permite_comentarios"
                checked={formData.permite_comentarios}
                onChange={handleChange}
              />
              Permitir comentarios y reseñas
            </label>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                name="visibilidad"
                checked={formData.visibilidad}
                onChange={handleChange}
              />
              Evento público (visible para todos)
            </label>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#007cba',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Creando...' : 'Crear Evento'}
            </button>
            
            <button
              type="button"
              onClick={() => router.push('/events')}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
