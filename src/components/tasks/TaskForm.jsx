import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { createTask, updateTask } from '../../services/taskService';
import { CATEGORIES, PRIORITIES } from '../../utils/constants';
import toast from 'react-hot-toast';
export default function TaskForm({ onClose, taskToEdit = null }) {
    const user = useAuthStore((state) => state.user);
    const { theme } = useUIStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    // Determinar si estamos en modo edición
    const isEditing = !!taskToEdit;
    // Preparar valores por defecto
    const defaultValues = taskToEdit ? {
        title: taskToEdit.title,
        description: taskToEdit.description || '',
        category: taskToEdit.category,
        priority: taskToEdit.priority,
        // Convertir Date a formato YYYY-MM-DD para el input
        dueDate: taskToEdit.dueDate
            ? taskToEdit.dueDate.toISOString().split('T')[0]
            : ''
    } : {
        title: '',
        description: '',
        category: 'other',
        priority: 'medium',
        dueDate: ''
    };
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues
    });
    const onSubmit = async (data) => {
        setLoading(true);
        setError('');
        const taskData = {
            title: data.title,
            description: data.description,
            category: data.category,
            priority: data.priority,
            dueDate: data.dueDate ? new Date(data.dueDate) : null
        };
        let result;
        if (isEditing) {
            // Modo edición: actualizar tarea existente
            result = await updateTask(taskToEdit.id, taskData);
        } else {
            // Modo creación: crear nueva tarea
            result = await createTask(user.uid, taskData);
        }
        if (result.success) {
            toast.success(isEditing ? 'Tarea actualizada exitosamente' : 'Tarea creada exitosamente');
            onClose();
        } else {
            toast.error(result.error || (isEditing ? 'Error al actualizar la tarea' : 'Error al crear la tarea'));
}
        setLoading(false);
    };
    return (
        <div className={`card ${theme === 'dark' ? 'dark:bg-gray-800' : 'dark:text-gray-100'}`}>
            {/* Header del formulario */}
            <div className="flex justify-between items-center mb-4">
                <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                    {isEditing ? 'Editar Tarea' : 'Nueva Tarea'}
                </h3>
                <button
                    onClick={onClose}
                    className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} text-2xl leading-none`}
                >
                    &times;
                </button>
            </div>
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 
rounded-lg mb-4">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Campo: Título */}
                <div>
                    <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Título *
                    </label>
                    <input
                        type="text"
                        className={`input-field ${theme === 'dark' ? 'dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600' : ''}`}
                        placeholder="Ej: Completar informe mensual"
                        {...register('title', {
                            required: 'El título es obligatorio',
                            minLength: {
                                value: 3,
                                message: 'Mínimo 3 caracteres'
                            }
                        })}
                    />
                    {errors.title && (
                        <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                    )}
                </div>
                {/* Campo: Descripción */}
                <div>
                    <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Descripción
                    </label>
                    <textarea
                        className={`input-field ${theme === 'dark' ? 'dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600' : ''}`}
                        rows="3"
                        placeholder="Descripción detallada de la tarea..."
                        {...register('description')}
                    />
                </div>
                {/* Grid de 3 columnas: Categoría, Prioridad, Fecha */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                            Categoría *
                        </label>
                        <select
                            className={`input-field ${theme === 'dark' ? 'dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600' : ''}`}
                            {...register('category', { required: true })}
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                            Prioridad *
                        </label>
                        <select
                            className={`input-field ${theme === 'dark' ? 'dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600' : ''}`}
                            {...register('priority', { required: true })}
                        >
                            {PRIORITIES.map((priority) => (
                                <option key={priority.id} value={priority.id}>
                                    {priority.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                            Fecha de vencimiento
                        </label>
                        <input
                            type="date"
                            className={`input-field ${theme === 'dark' ? 'dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600' : ''}`}
                            {...register('dueDate')}
                        />
                    </div>
                </div>
                {/* Botones de acción */}
                <div className="flex gap-3 justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn-secondary"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary disabled:opacity-50"
                    >
                        {loading
                            ? (isEditing ? 'Actualizando...' : 'Guardando...')
                            : (isEditing ? 'Actualizar' : 'Crear Tarea')
                        }
                    </button>
                </div>
            </form>
        </div>
    );
}