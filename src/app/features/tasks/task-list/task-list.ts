import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../core/services/task';
import { Observable } from 'rxjs';
import { Task } from '../../../core/models/task';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './task-list.html'
})
export class TaskListComponent {
  private taskService = inject(TaskService);
  tasks$: Observable<Task[]> = this.taskService.getTasks();
  isOverdue(task: Task): boolean {
    if (task.status === 'Completada') return false;

    const today = new Date();
    today.setHours(0,0,0,0);

    const dueDate = new Date(task.dueDate + 'T00:00:00');

    return dueDate < today;
  }
}
