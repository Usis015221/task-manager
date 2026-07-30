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
  private refreshTrigger = new BehaviorSubject<void>(undefined);

  searchQuery$ = new BehaviorSubject<string>('');
  statusFilter$ = new BehaviorSubject<string>('Todos');
  assigneeFilter$ = new BehaviorSubject<string>('Todos');

  errorMessage$ = new BehaviorSubject<string | null>(null);
  
  private tasks$: Observable<Task[]> = this.refreshTrigger.pipe(
    switchMap(() => {
      this.errorMessage$.next(null);

      return this.taskService.getTasks().pipe(
        catchError((error) => {
          console.error('Fallo en la API:', error);
          this.errorMessage$.next('¡Lo sentimos! En este momento no podemos conectar con el servidor. Verificar que json-server este activado.');
          return of([]);
        })
      );
    }),
    shareReplay(1)
  );

  assignees$: Observable<string[]> = this.tasks$.pipe(
    map(tasks => [...new Set(tasks.map(task => task.assignee))])
  );

  filteredTasks$: Observable<Task[]> = combineLatest([
    this.tasks$,
    this.searchQuery$,
    this.statusFilter$,
    this.assigneeFilter$
  ]).pipe(
    map(([tasks, search, status, assignee]) => {
      return tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
                              
        const matchesStatus = status === 'Todos' || task.status === status;

        const matchesAssignee = assignee === 'Todos' || task.assignee === assignee;
        
        return matchesSearch && matchesStatus && matchesAssignee;
      });
    })
  );

  loadTasks() {
    this.refreshTrigger.next();
  }

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
      this.loadTasks();
    });
  }

  deleteTask(task: Task) {
    const confirmacion = window.confirm(`¿Estás seguro de que deseas eliminar la tarea: "${task.title}"?`);
    if (confirmacion) {
      this.taskService.deleteTask(task.id).subscribe(() => {
        this.loadTasks(); 
      });
    }
  }
}