import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaskService } from '../../../core/services/task';
import { Observable, BehaviorSubject, switchMap } from 'rxjs'; // 🔥 Importamos las herramientas pro
import { Task } from '../../../core/models/task';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './task-list.html', 
})
export class TaskListComponent {
  private taskService = inject(TaskService);
  
  // 1. Creamos un "Gatillo" reactivo. Inicia disparándose una vez.
  private refreshTrigger = new BehaviorSubject<void>(undefined);

  // 2. Conectamos el gatillo al servicio HTTP. 
  // Cada vez que apretemos el gatillo, hace la petición GET automáticamente.
  tasks$: Observable<Task[]> = this.refreshTrigger.pipe(
    switchMap(() => this.taskService.getTasks())
  );

  // 3. Nuestra función de recarga ahora solo "aprieta el gatillo"
  loadTasks() {
    this.refreshTrigger.next();
  }

  isOverdue(task: Task): boolean {
    if (task.status === 'Completada') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate + 'T00:00:00'); 
    return dueDate < today;
  }

  changeStatus(task: Task, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const newStatus = selectElement.value as 'Pendiente' | 'En Progreso' | 'Completada';
    
    const updatedTask = { ...task, status: newStatus };
    
    this.taskService.updateTask(updatedTask).subscribe(() => {
      this.loadTasks(); // Aprieta el gatillo y repinta el HTML al instante
    });
  }

  deleteTask(task: Task) {
    const confirmacion = window.confirm(`¿Estás seguro de que deseas eliminar la tarea: "${task.title}"?`);
    if (confirmacion) {
      this.taskService.deleteTask(task.id).subscribe(() => {
        this.loadTasks(); // Aprieta el gatillo y borra la fila al instante
      });
    }
  }
}