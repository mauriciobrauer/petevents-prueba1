const OtherEventsSection = ({ events, activeTab }) => {
    return (
        <section>
            {/* Header de la Sección */}
            <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2 mb-4">
                <span>🏠</span>
                <span>Otros Eventos</span>
            </h2>

            {/* Descripción */}
            <p className="text-sm text-gray-600 mb-6">
                Eventos disponibles donde puedes registrar tu mascota
            </p>

            {/* Grid de Eventos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {events.length > 0 ? (
                    events.map((event) => (
                        <EventCard 
                            key={event.id} 
                            event={event} 
                            isMyEvent={false}
                        />
                    ))
                ) : (
                    <div className="col-span-full bg-white rounded-lg p-8 text-center border border-gray-100">
                        <p className="text-gray-500 text-sm">
                            No hay eventos {activeTab === 'proximos' ? 'próximos' : 'pasados'} disponibles
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

window.OtherEventsSection = OtherEventsSection;
