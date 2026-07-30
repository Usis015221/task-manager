export interface Task {
    id: string;
    tittle: string;
    assignee: string;
    priority: 'Baja' |'Media' | 'Alta';
    status: 'Pendiente' | 'En Progreso' | 'Completada';
    dueDate: string;
}