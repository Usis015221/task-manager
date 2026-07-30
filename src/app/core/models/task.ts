export interface Task {
    id: string;
    title: string;
    assignee: string;
    priority: 'Baja' |'Media' | 'Alta';
    status: 'Pendiente' | 'En Progreso' | 'Completada';
    dueDate: string;
}