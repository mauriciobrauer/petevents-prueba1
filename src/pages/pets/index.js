import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

export default function Pets() {
  const { user } = useAuth()
  const router = useRouter()
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    fetchPets()
  }, [user, router])

  const fetchPets = async () => {
    try {
      const { data, error } = await supabase
        .from('mascota')
        .select('*')
        .eq('dueño_id', user.id)
        .order('fecha_creacion', { ascending: false })

      if (error) throw error
      setPets(data || [])
    } catch (error) {
      console.error('Error fetching pets:', error)
    } finally {
      setLoading(false)
    }
  }

  const deletePet = async (petId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta mascota?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('mascota')
        .delete()
        .eq('id', petId)

      if (error) throw error
      
      setPets(pets.filter(pet => pet.id !== petId))
    } catch (error) {
      console.error('Error deleting pet:', error)
      alert('Error al eliminar la mascota')
    }
  }

  if (!user) return null

  return (
    <>
      <Head>
        <title>Mis Mascotas - PetsEvents</title>
      </Head>
      
      <Navbar />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h1>Mis Mascotas</h1>
          <Link href="/pets/create" style={{
            backgroundColor: '#007cba',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            textDecoration: 'none'
          }}>
            Agregar Mascota
          </Link>
        </div>

        {loading ? (
          <p>Cargando mascotas...</p>
        ) : pets.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {pets.map((pet) => (
              <div key={pet.id} style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '1.5rem',
                backgroundColor: 'white'
              }}>
                {pet.foto_perfil && (
                  <img
                    src={pet.foto_perfil}
                    alt={pet.nombre}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      marginBottom: '1rem'
                    }}
                  />
                )}
                <h3 style={{ marginBottom: '0.5rem' }}>{pet.nombre}</h3>
                <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                  <p><strong>Tipo:</strong> {pet.tipo}</p>
                  {pet.raza && <p><strong>Raza:</strong> {pet.raza}</p>}
                  {pet.edad && <p><strong>Edad:</strong> {pet.edad} años</p>}
                  {pet.tamaño && <p><strong>Tamaño:</strong> {pet.tamaño}</p>}
                  <p><strong>Castrado:</strong> {pet.castrado ? 'Sí' : 'No'}</p>
                  <p><strong>Vacunas al día:</strong> {pet.vacunaciones_al_dia ? 'Sí' : 'No'}</p>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link href={`/pets/edit/${pet.id}`} style={{
                    backgroundColor: '#28a745',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    fontSize: '0.9rem'
                  }}>
                    Editar
                  </Link>
                  <button
                    onClick={() => deletePet(pet.id)}
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
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <h2>No tienes mascotas registradas</h2>
            <p>¡Agrega tu primera mascota para comenzar a participar en eventos!</p>
            <Link href="/pets/create" style={{
              backgroundColor: '#007cba',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              textDecoration: 'none',
              marginTop: '1rem',
              display: 'inline-block'
            }}>
              Agregar Mascota
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
