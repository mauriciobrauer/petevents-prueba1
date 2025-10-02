const Header = () => {
    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo y Título */}
                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl">🐾</span>
                        <h1 className="text-xl font-bold text-gray-900">Pet Events</h1>
                    </div>
                    <p className="text-sm text-gray-600 hidden md:block">
                        ¡Encuentra eventos increíbles para tu mascota!
                    </p>
                </div>

                {/* Navegación del Usuario */}
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-700 font-medium">Luis Torres</span>
                    
                    {/* Avatar del Usuario */}
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">L</span>
                    </div>
                    
                    <span className="text-sm text-gray-600">Mirij Mascota(s)</span>
                    
                    <button className="text-sm text-gray-600 hover:text-gray-800 transition-colors">
                        Salir
                    </button>
                </div>
            </div>
        </header>
    );
};

window.Header = Header;
