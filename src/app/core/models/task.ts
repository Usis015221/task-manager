// Define la estructura principal que tendran todas las tareas dentro de la aplicacion.
// Al usar una interfaz, aseguramos que los datos siempre mantengan este formato exacto.
export interface Task {
    // Identificador unico para cada tarea
    id: string;
    
    // Nombre o descripcion corta de lo que se debe hacer
    title: string;
    
    // Nombre de la persona encargada de realizar la tarea
    assignee: string;
    
    // Nivel de urgencia. Esta restringido a tres valores especificos para evitar errores de escritura
    priority: 'Baja' | 'Media' | 'Alta';
    
    // Estado actual de la tarea. Tambien restringido a tres opciones cerradas
    status: 'Pendiente' | 'En Progreso' | 'Completada';
    
    // Fecha limite de entrega representada en formato de texto (generalmente YYYY-MM-DD)
    dueDate: string;
}