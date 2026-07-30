import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaskService } from '../../../core/services/task';
import { Observable, BehaviorSubject, switchMap, combineLatest, map, shareReplay, catchError, of } from 'rxjs'; 
import { Task } from '../../../core/models/task';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './task-list.html', 
})
export class TaskListComponent {
  private taskService = inject(TaskService);
  
  // BehaviorSubject actúa como un disparador manual. Cada vez que emite un valor, 
  // obliga a la aplicación a volver a consultar la base de datos para refrescar la lista.
  private refreshTrigger = new BehaviorSubject<void>(undefined);

  // Variables reactivas para almacenar el estado actual de los filtros en tiempo real.
  // Inician con valores por defecto vacíos o en 'Todos'.
  searchQuery$ = new BehaviorSubject<string>('');
  statusFilter$ = new BehaviorSubject<string>('Todos');
  assigneeFilter$ = new BehaviorSubject<string>('Todos');

  // Variable para manejar el estado de error de la API y mostrarlo en la interfaz.
  errorMessage$ = new BehaviorSubject<string | null>(null);
  
  // Observable principal que obtiene las tareas desde el backend.
  private tasks$: Observable<Task[]> = this.refreshTrigger.pipe(
    switchMap(() => {
      // Limpiamos cualquier error previo antes de intentar una nueva petición
      this.errorMessage$.next(null);

      return this.taskService.getTasks().pipe(
        // Si el servidor falla o está apagado, atrapamos el error aquí para que la app no colapse
        catchError((error) => {
          console.error('Fallo en la API:', error);
          this.errorMessage$.next('¡Lo sentimos! En este momento no podemos conectar con el servidor. Verificar que json-server este activado.');
          // Devolvemos un arreglo vacío para mantener la estructura de la tabla intacta
          return of([]);
        })
      );
    }),
    // shareReplay(1) guarda temporalmente la respuesta en caché. 
    // Evita que Angular haga múltiples peticiones repetidas al servidor si varios elementos del HTML leen esta variable.
    shareReplay(1)
  );

  // Observable que procesa la lista de tareas para extraer unicamente los nombres de los responsables.
  // El uso de Set garantiza que no existan nombres duplicados en el selector del HTML.
  assignees$: Observable<string[]> = this.tasks$.pipe(
    map(tasks => [...new Set(tasks.map(task => task.assignee))])
  );

  // Observable que combina la lista de tareas y los tres filtros.
  // combineLatest reacciona automáticamente si cualquiera de estas 4 variables cambia.
  filteredTasks$: Observable<Task[]> = combineLatest([
    this.tasks$,
    this.searchQuery$,
    this.statusFilter$,
    this.assigneeFilter$
  ]).pipe(
    map(([tasks, search, status, assignee]) => {
      // Filtramos el arreglo completo de tareas evaluando cada condición
      return tasks.filter(task => {
        // Búsqueda por texto en el título (ignorando mayúsculas y minúsculas)
        const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
                              
        // Validación del estado seleccionado
        const matchesStatus = status === 'Todos' || task.status === status;

        // Validación del responsable seleccionado
        const matchesAssignee = assignee === 'Todos' || task.assignee === assignee;
        
        // La tarea solo se muestra si cumple simultáneamente con los tres filtros
        return matchesSearch && matchesStatus && matchesAssignee;
      });
    })
  );

  // Método para forzar una actualización manual de la tabla
  loadTasks() {
    this.refreshTrigger.next();
  }

  // --- Manejadores de Eventos del HTML ---
  // Estos métodos capturan lo que el usuario escribe o selecciona y actualizan las variables reactivas
  
  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery$.next(input.value);
  }

  onFilterChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.statusFilter$.next(select.value);
  }

  onAssigneeChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.assigneeFilter$.next(select.value);
  }

  // --- Lógica de Negocio ---

  // Verifica si la fecha actual ya superó la fecha límite de la tarea.
  // Si la tarea ya está completada, se ignora el vencimiento.
  isOverdue(task: Task): boolean {
    if (task.status === 'Completada') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalizamos la hora para comparar únicamente las fechas
    const dueDate = new Date(task.dueDate + 'T00:00:00'); 
    return dueDate < today;
  }

  // Permite actualizar el estado de una tarea directamente desde la fila de la tabla
  changeStatus(task: Task, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const newStatus = selectElement.value as 'Pendiente' | 'En Progreso' | 'Completada';
    
    // Creamos una copia de la tarea con el nuevo estado
    const updatedTask = { ...task, status: newStatus };
    
    // Enviamos la actualización al backend y recargamos la lista
    this.taskService.updateTask(updatedTask).subscribe(() => {
      this.loadTasks();
    });
  }

  // Elimina una tarea pidiendo confirmación previa al usuario mediante un cuadro de diálogo nativo
  deleteTask(task: Task) {
    const confirmacion = window.confirm(`¿Estás seguro de que deseas eliminar la tarea: "${task.title}"?`);
    if (confirmacion) {
      this.taskService.deleteTask(task.id).subscribe(() => {
        this.loadTasks(); 
      });
    }
  }
}