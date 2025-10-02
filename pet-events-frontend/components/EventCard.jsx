const EventCard = ({ event, isMyEvent = false }) => {
    const {
        title,
        description,
        image,
        date,
        time,
        location,
        attendees,
        petAttendees,
        rating,
        reviews,
        isPrivate = false
    } = event;

    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            {/* Imagen del Evento con Badge */}
            <div className="relative h-40 bg-gray-200">
                {image ? (
                    <img 
                        src={image} 
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <span className="text-gray-400 text-4xl">🐾</span>
                    </div>
                )}
                
                {/* Badge de Estado */}
                <div className={`absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-semibold ${
                    isMyEvent 
                        ? 'bg-primary text-white' 
                        : isPrivate 
                            ? 'bg-gray-600 text-white'
                            : 'bg-secondary text-white'
                }`}>
                    {isMyEvent ? 'Inscrito' : isPrivate ? 'Privado' : 'Público'}
                </div>
            </div>

            {/* Contenido de la Tarjeta */}
            <div className="p-4">
                {/* Título */}
                <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
                    {title}
                </h3>

                {/* Descripción */}
                <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                    {description}
                </p>

                {/* Detalles del Evento */}
                <div className="space-y-1 mb-3">
                    <div className="flex items-center text-xs text-gray-600">
                        <span className="mr-2">📅</span>
                        <span>{date} - {time}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                        <span className="mr-2">📍</span>
                        <span className="truncate">{location}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                        <span className="mr-2">👥</span>
                        <span>{attendees} asistentes</span>
                    </div>
                </div>

                {/* Mascotas Asistentes y Rating */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-gray-700 mb-1">Mascotas asistentes:</p>
                        <div className="flex items-center space-x-1">
                            {petAttendees && petAttendees.slice(0, 2).map((pet, index) => (
                                <div 
                                    key={index}
                                    className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center"
                                >
                                    <span className="text-xs">{pet.emoji}</span>
                                </div>
                            ))}
                            {petAttendees && petAttendees.length > 2 && (
                                <span className="text-xs text-gray-500">
                                    +{petAttendees.length - 2}
                                </span>
                            )}
                        </div>
                    </div>
                    
                    {/* Rating */}
                    <div className="text-right">
                        <div className="flex items-center space-x-1">
                            <span className="text-xs">⭐</span>
                            <span className="text-xs text-gray-600">{rating}</span>
                        </div>
                        <p className="text-xs text-gray-500">({reviews} reseña{reviews !== 1 ? 's' : ''})</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

window.EventCard = EventCard;
