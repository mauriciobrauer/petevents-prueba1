const EventTabs = ({ activeTab, onTabChange }) => {
    return (
        <div className="flex space-x-3 mb-6">
            <button
                onClick={() => onTabChange('proximos')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === 'proximos'
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
            >
                <span>❤️</span>
                <span>Próximos</span>
            </button>
            
            <button
                onClick={() => onTabChange('pasados')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === 'pasados'
                        ? 'bg-gray-600 text-white shadow-sm'
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
            >
                <span>📅</span>
                <span>Pasados</span>
            </button>
        </div>
    );
};

window.EventTabs = EventTabs;
