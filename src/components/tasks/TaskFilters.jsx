import { useTaskStore } from '../../store/taskStore';
import { useUIStore } from '../../store/uiStore';
import { FILTERS, CATEGORIES } from '../../utils/constants';

export default function TaskFilters() {
    const { currentFilter, currentCategory, searchQuery, setFilter, setCategory, setSearchQuery } = useTaskStore();
    const { theme } = useUIStore();

    return (
        <div className={`card mb-6 ${theme === 'dark' ? 'dark:bg-gray-800' : 'dark:text-gray-100'}`} >
            <div className="space-y-4">
                {/* Búsqueda */}
                <div>
                    <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Buscar tareas
                    </label>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Título o descripción"
                        className={`input-field w-full ${theme === 'dark' ? 'dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600' : ''}`}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Filtro por estado */}
                    <div>
                    <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Filtrar por estado
                    </label>
                    <div className="flex gap-2">
                        {FILTERS.map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => setFilter(filter.id)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        currentFilter === filter.id
                                            ? 'bg-blue-600 text-white'
                                            : theme === 'dark'
                                                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filtro por categoría */}
                <div>
                    <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Filtrar por categoría
                    </label>
                    <select
                        value={currentCategory}
                        onChange={(e) => setCategory(e.target.value)}
                        className={`input-field w-full ${theme === 'dark' ? 'dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600' : ''}`}
                    >
                        <option value="all">Todas las categorías</option>
                        {CATEGORIES.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    </div>
    );
}
