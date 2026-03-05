import { Link } from 'react-router-dom';
import { useState } from 'react';
import { updateTask, deleteTask } from '../../services/taskService';
import { useUIStore } from '../../store/uiStore';
import { CATEGORIES } from '../../utils/constants';
import { getDueDateLabel, isOverdue } from '../../utils/dateHelpers';
import toast from 'react-hot-toast';

export default function TaskCard({ task }) {
  const [loading, setLoading] = useState(false);
  const { theme } = useUIStore();
  const category = CATEGORIES.find((c) => c.id === task.category) || { label: 'Sin categoría', color: 'gray' };

  const colorMap = {
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900',
      text: 'text-blue-800 dark:text-blue-100',
      ring: 'ring-blue-200 dark:ring-blue-700'
    },
    green: {
      bg: 'bg-green-100 dark:bg-green-900',
      text: 'text-green-800 dark:text-green-100',
      ring: 'ring-green-200 dark:ring-green-700'
    },
    purple: {
      bg: 'bg-purple-100 dark:bg-purple-900',
      text: 'text-purple-800 dark:text-purple-100',
      ring: 'ring-purple-200 dark:ring-purple-700'
    },
    gray: {
      bg: 'bg-gray-100 dark:bg-gray-700',
      text: 'text-gray-800 dark:text-gray-100',
      ring: 'ring-gray-200 dark:ring-gray-600'
    }
  };
  const colorClasses = colorMap[category.color] || colorMap.gray;

  const overdue = isOverdue(task.dueDate, task.completed);
  const dueLabel = getDueDateLabel(task.dueDate);

  const handleToggleComplete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    const res = await updateTask(task.id, { completed: !task.completed });
    if (res.success) {
      toast.success(task.completed ? 'Tarea marcada como pendiente' : 'Tarea completada');
    } else {
      toast.error('Error actualizando tarea: ' + res.error);
    }
    setLoading(false);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const confirm = window.confirm('¿Eliminar esta tarea?');
    if (!confirm) return;
    setLoading(true);
    const res = await deleteTask(task.id);
    if (res.success) {
      toast.success('Tarea eliminada exitosamente');
    } else {
      toast.error('Error eliminando tarea: ' + res.error);
    }
    setLoading(false);
  };

  return (
    <Link to={`/tasks/${task.id}`} className="block">
      <div
        className={`card hover:shadow-lg transition-shadow p-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} ${
          task.completed ? 'opacity-60' : ''
        } ${overdue ? 'border-2 ' + (theme === 'dark' ? 'border-red-400' : 'border-red-300') : ''}`}
      >
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>{task.title}</h3>
            <div className="flex items-center gap-2">
              {dueLabel && (
                <span className={`text-sm ${theme === 'dark' ? ' text-gray-300' : 'text-gray-600'}`}>{dueLabel}</span>
              )}
            </div>
          </div>

          {task.description && (
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mt-2`}>{task.description}</p>
          )}

          <div className="mt-3 flex items-center gap-3">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colorClasses.bg} ${colorClasses.text}`}>
              {category.label}
            </span>

            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{task.completed ? 'Completada' : 'Pendiente'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2 sm:mt-0 ">
          <button
            onClick={handleToggleComplete}
            disabled={loading}
            className="btn-secondary text-sm"
            aria-label={task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
          >
            {task.completed ? 'Marcar pendiente' : 'Marcar completada'}
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="btn-danger text-sm"
            aria-label="Eliminar tarea"
          >
            Eliminar
          </button>
        </div>
      </div>
    </Link>
  );
}
