import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TaskService } from '../../../core/services/task';
import { Task } from '../../../core/models/task';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './task-form.html'
})
export class TaskFormComponent {
  private fb = inject(FormBuilder);
  private taksService = inject(TaskService);
  private router = inject(Router);

  taskForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    assignee: ['', Validators.required],
    priority: ['Media', Validators.required],
    dueDate: ['', [Validators.required, this.futureDateValidator]]
  });

  futureDateValidator(control: AbstractControl) {
    if (!control.value) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inputDate = new Date(control.value + 'T00:00:00');
    return inputDate < today ? { pastDate: true } : null;
  }

  onSubmit() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: this.taskForm.value.title!,
      assignee: this.taskForm.value.assignee!,
      priority: this.taskForm.value.priority as 'Baja' | 'Media' | 'Alta',
      status: 'Pendiente',
      dueDate: this.taskForm.value.dueDate!
    };
    
    this.taksService.addTask(newTask).subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}