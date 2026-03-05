import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { logoutUser } from '../../services/authService';
import { useUIStore } from '../../store/uiStore';

export default function Navbar() {

    const { user, clearUser } = useAuthStore();
    const { theme, toggleTheme } = useUIStore();
    const navigate = useNavigate();
    const handleLogout = async () => {
        const result = await logoutUser();
        if (result.success) {
            clearUser(); // Limpiar estado de Zustand
            navigate('/login');
        }
    };

    return (
        <nav className={`shadow-md ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo y título */}
                    <div className="flex items-center">
                        <Link to="/dashboard" className="text-2xl font-bold text-blue-600">
                            Task Manager Pro
                        </Link>
                    </div>
                    {/* Usuario y botón de logout */}
                    <div className="flex items-center gap-4">
                        <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>
                            {user?.displayName || user?.email}
                        </span>
                        {/* theme toggle */}
                        <button
                            onClick={toggleTheme}
                            className={`btn-secondary ${theme === 'dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
                        >
                            {theme === 'dark' ? 'Claro' : 'Oscuro'}
                        </button>
                        <button
                            onClick={handleLogout}
                            className={`btn-secondary ${theme === 'dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
                        >
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}