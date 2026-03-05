import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { loginUser } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

export default function Login() {
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);
    const { theme, toggleTheme } = useUIStore();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    // React Hook Form para manejar el formulario
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = async (data) => {
        setLoading(true);
        setError('');
        // Llamar al servicio de autenticación
        const result = await loginUser(data.email, data.password);
        if (result.success) {
            // Guardar usuario en Zustand y redirigir
            setUser(result.user);
            navigate('/dashboard');
        } else {
            setError(result.error);
        }
        setLoading(false);
    };
    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} flex items-center justify-center p-4 relative`}>
            {/* Theme toggle button */}
            <button
                onClick={toggleTheme}
                className={`absolute top-4 right-4 btn-secondary ${theme === 'dark' ? 'bg-gray-800' : 'bg-white text-gray-900'}`}
            >
                {theme === 'dark' ? 'Claro' : 'Oscuro'}
            </button>
            <div className={`card max-w-md w-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="text-center mb-8">
                    <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>Task Manager Pro</h1>
                    <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mt-2`}>Inicia sesión para continuar</p>
                </div>
                {/* Mensaje de error */}
                {error && (
                    <div className={`${theme === 'dark' ? 'bg-red-900 border-red-700 text-red-200' : 'bg-red-50 border-red-200 text-red-700'} border px-4 py-3 rounded-lg mb-4`}>
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Campo de email */}
                    <div>
                        <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            className="input-field"
                            placeholder="tu@email.com"
                            {...register('email', {
                                required: 'El correo es obligatorio',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Correo inválido'
                                }
                            })}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>
                    {/* Campo de contraseña */}
                    <div>
                        <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                            Contraseña
                        </label>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="••••••••"
                            {...register('password', {
                                required: 'La contraseña es obligatoria',
                                minLength: {
                                    value: 6,
                                    message: 'Mínimo 6 caracteres'
                                }
                            })}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                    </button>
                </form>
                <p className={`text-center mt-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    ¿No tienes cuenta?{' '}
                    <Link to="/register" className={`${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} hover:underline font-medium`}>
                        Regístrate aquí
                    </Link>
                </p>
            </div>
        </div>
    );
}