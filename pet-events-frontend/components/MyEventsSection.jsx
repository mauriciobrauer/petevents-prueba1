const MyEventsSection = ({ events, activeTab }) => {
    return (
        <section className="mb-8">
            {/* Header de la Sección */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <span>🐾</span>
                    <span>Mis Eventos</span>
                </h2>
                <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors">
                    + Crear Evento
                </button>
            </div>

            {/* Descripción */}
            <p className="text-sm text-gray-600 mb-6">
                Eventos donde tu mascota está registrada
            </p>

            {/* Grid de Eventos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {events.length > 0 ? (
                    events.map((event) => (
                        <EventCard 
                            key={event.id} 
                            event={event} 
                            isMyEvent={true}
                        />
                    ))
                ) : (
                    <div className="col-span-full bg-white rounded-lg p-8 text-center border border-gray-100">
                        <p className="text-gray-500 text-sm">
                            No tienes eventos {activeTab === 'proximos' ? 'próximos' : 'pasados'}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

window.MyEventsSection = MyEventsSection;
