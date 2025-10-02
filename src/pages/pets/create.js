import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

export default function CreatePet() {
  const { user } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
    raza: '',
    edad: '',
    tamaño: '',
    foto_perfil: '',
    comportamiento_social: '',
    castrado: false,
    vacunaciones_al_dia: false,
    restricciones_dieta: '',
    url_red_social: ''
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
      const petData = {
        ...formData,
        dueño_id: user.id,
        edad: formData.edad ? parseInt(formData.edad) : null
      }

      const { error } = await supabase
        .from('mascota')
        .insert([petData])

      if (error) throw error

      router.push('/pets')
    } catch (error) {
      console.error('Error creating pet:', error)
      setError('Error al crear la mascota: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <>
      <Head>
        <title>Agregar Mascota - PetsEvents</title>
      </Head>
      
      <Navbar />
      
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 2rem' }}>
        <h1>Agregar Nueva Mascota</h1>

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
            <label htmlFor="nombre">Nombre *:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
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
            <label htmlFor="tipo">Tipo de Animal *:</label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '8px',
                marginTop: '5px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            >
              <option value="">Selecciona un tipo</option>
              <option value="perro">Perro</option>
              <option value="gato">Gato</option>
              <option value="conejo">Conejo</option>
              <option value="ave">Ave</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="raza">Raza:</label>
            <input
              type="text"
              id="raza"
              name="raza"
              value={formData.raza}
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
            <label htmlFor="edad">Edad (años):</label>
            <input
              type="number"
              id="edad"
              name="edad"
              value={formData.edad}
              onChange={handleChange}
              min="0"
              max="30"
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
            <label htmlFor="tamaño">Tamaño:</label>
            <select
              id="tamaño"
              name="tamaño"
              value={formData.tamaño}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px',
                marginTop: '5px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            >
              <option value="">Selecciona un tamaño</option>
              <option value="pequeño">Pequeño</option>
              <option value="mediano">Mediano</option>
              <option value="grande">Grande</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="foto_perfil">URL de Foto de Perfil:</label>
            <input
              type="url"
              id="foto_perfil"
              name="foto_perfil"
              value={formData.foto_perfil}
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
            <label htmlFor="comportamiento_social">Comportamiento Social:</label>
            <textarea
              id="comportamiento_social"
              name="comportamiento_social"
              value={formData.comportamiento_social}
              onChange={handleChange}
              rows="3"
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
            <label htmlFor="restricciones_dieta">Restricciones de Dieta:</label>
            <textarea
              id="restricciones_dieta"
              name="restricciones_dieta"
              value={formData.restricciones_dieta}
              onChange={handleChange}
              rows="3"
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
            <label htmlFor="url_red_social">URL Red Social:</label>
            <input
              type="url"
              id="url_red_social"
              name="url_red_social"
              value={formData.url_red_social}
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
                name="castrado"
                checked={formData.castrado}
                onChange={handleChange}
              />
              Castrado/Esterilizado
            </label>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                name="vacunaciones_al_dia"
                checked={formData.vacunaciones_al_dia}
                onChange={handleChange}
              />
              Vacunas al día
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
              {loading ? 'Guardando...' : 'Guardar Mascota'}
            </button>
            
            <button
              type="button"
              onClick={() => router.push('/pets')}
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
