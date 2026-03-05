import { useTaskStore } from '../../store/taskStore';
import { useUIStore } from '../../store/uiStore';

export default function TaskStats() {
  const { tasks } = useTaskStore();
  const { theme } = useUIStore();

  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.filter(t => !t.completed).length;
  const overdue = tasks.filter(t => !t.completed && t.dueDate && t.dueDate < new Date()).length;
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    { label: 'Total de tareas', value: total, color: 'bg-blue-500' },
    { label: 'Tareas completas', value: completed, color: 'bg-green-500' },
    { label: 'Tareas pendientes', value: pending, color: 'bg-yellow-500' },
    { label: 'Tareas vencidas', value: overdue, color: 'bg-red-500' },
    { label: 'Complejidad', value: `${completionPercentage}%`, color: 'bg-purple-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-4`}>
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full ${stat.color} mr-3`}></div>
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{stat.label}</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}