import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useUIStore } from '../../store/uiStore';
import Navbar from './Navbar';

export default function Layout() {
    const { theme } = useUIStore();

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
            <Navbar />
            <main>
                {/* Outlet: aquí se renderizan las rutas hijas (Dashboard, TaskDetails, etc.) */}
                <Outlet />
            </main>
        </div>
    );
}