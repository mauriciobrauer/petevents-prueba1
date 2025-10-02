const { useState } = React;

const App = () => {
    const [activeTab, setActiveTab] = useState('proximos');

    // Datos de ejemplo basados en la imagen de referencia
    const myEvents = [
        {
            id: 1,
            title: "Paseo grupal en el parque",
            description: "Un paseo relajante con nuestras mascotas por el parque central de la ciudad. Grande de la ciudad.",
            image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=200&fit=crop",
            date: "2024-10-15",
            time: "09:00",
            location: "Parque Central",
            attendees: 12,
            petAttendees: [
                { name: "Max", emoji: "🐕" },
                { name: "Luna", emoji: "🐱" },
                { name: "Rocky", emoji: "🐕" }
            ],
            rating: "5.0",
            reviews: 1,
            isPrivate: false
        },
        {
            id: 2,
            title: "Adopción responsable",
            description: "Evento para conocer mascotas en busca de hogar y promover la adopción responsable.",
            image: "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=400&h=200&fit=crop",
            date: "2024-10-22",
            time: "16:00",
            location: "Refugio Los Amigos",
            attendees: 35,
            petAttendees: [
                { name: "Bella", emoji: "🐕" },
                { name: "Simba", emoji: "🐱" },
                { name: "Coco", emoji: "🐕" },
                { name: "Mimi", emoji: "🐱" }
            ],
            rating: "5.0",
            reviews: 1,
            isPrivate: false
        }
    ];

    const otherEvents = [
        {
            id: 3,
            title: "Taller de adiestramiento",
            description: "Sesión práctica de entrenamiento básico para cachorros y perros jóvenes con instructores profesionales.",
            image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=200&fit=crop",
            date: "2024-10-18",
            time: "16:00",
            location: "Centro Canino Elite",
            attendees: 8,
            petAttendees: [
                { name: "Buddy", emoji: "🐕" },
                { name: "Rex", emoji: "🐕" }
            ],
            rating: "5.0",
            reviews: 1,
            isPrivate: true
        },
        {
            id: 4,
            title: "Concurso de disfraces caninos",
            description: "¡Ven con tu perro disfrazado y compite por increíbles premios! Diversión garantizada para toda la familia.",
            image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=200&fit=crop",
            date: "2024-10-31",
            time: "16:00",
            location: "Plaza de la Mascota",
            attendees: 23,
            petAttendees: [
                { name: "Princess", emoji: "🐕" },
                { name: "Thor", emoji: "🐕" },
                { name: "Lola", emoji: "🐕" }
            ],
            rating: "5.0",
            reviews: 1,
            isPrivate: false
        }
    ];

    return (
        <div className="min-h-screen bg-light-gray">
            {/* Header */}
            <Header />

            {/* Contenido Principal */}
            <main className="max-w-7xl mx-auto px-6 py-6">
                {/* Mensaje de Bienvenida */}
                <div className="mb-6">
                    <p className="text-sm text-gray-600">
                        Descubre actividades increíbles cerca de ti
                    </p>
                </div>

                {/* Tabs de Filtro */}
                <EventTabs activeTab={activeTab} onTabChange={setActiveTab} />

                {/* Sección Mis Eventos */}
                <MyEventsSection 
                    events={activeTab === 'proximos' ? myEvents : []} 
                    activeTab={activeTab}
                />

                {/* Sección Otros Eventos */}
                <OtherEventsSection 
                    events={activeTab === 'proximos' ? otherEvents : []} 
                    activeTab={activeTab}
                />
            </main>
        </div>
    );
};

// Renderizar la aplicación
ReactDOM.render(<App />, document.getElementById('root'));
