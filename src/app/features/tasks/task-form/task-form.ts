import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { TaskService } from '../../../core/services/task';
import { Task } from '../../../core/models/task';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './task-form.html'
})
export class TaskFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  taskId: string | null = null;
  isEditing = false;

  taskForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    assignee: ['', Validators.required],
    priority: ['Media', Validators.required],
    dueDate: ['', [Validators.required, this.futureDateValidator]]
  });

  ngOnInit() {
    // 1. Revisamos si la URL trae un parámetro llamado 'id'
    this.taskId = this.route.snapshot.paramMap.get('id');
    
    if (this.taskId) {
      this.isEditing = true;
      // 2. Si estamos editando, traemos los datos de esa tarea específica y llenamos el formulario
      this.taskService.getTasks().subscribe(tasks => {
        const taskToEdit = tasks.find(t => t.id === this.taskId);
        if (taskToEdit) {
          this.taskForm.patchValue({
            title: taskToEdit.title,
            assignee: taskToEdit.assignee,
            priority: taskToEdit.priority,
            dueDate: taskToEdit.dueDate
          });
        }
      });
    }
  }

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

    if (this.isEditing && this.taskId) {
      // 3. Flujo de Actualización (PUT)
      // Buscamos mantener el estado original que ya tenía la tarea
      this.taskService.getTasks().subscribe(tasks => {
        const existingTask = tasks.find(t => t.id === this.taskId);
        
        const updatedTask: Task = {
          id: this.taskId!,
          title: this.taskForm.value.title!,
          assignee: this.taskForm.value.assignee!,
          priority: this.taskForm.value.priority as 'Baja' | 'Media' | 'Alta',
          status: existingTask ? existingTask.status : 'Pendiente',
          dueDate: this.taskForm.value.dueDate!
        };

        this.taskService.updateTask(updatedTask).subscribe(() => {
          this.router.navigate(['/']);
        });
      });

    } else {
      // 4. Flujo de Creación (POST - el que ya teníamos)
      const newTask: Task = {
        id: Date.now().toString(),
        title: this.taskForm.value.title!,
        assignee: this.taskForm.value.assignee!,
        priority: this.taskForm.value.priority as 'Baja' | 'Media' | 'Alta',
        status: 'Pendiente',
        dueDate: this.taskForm.value.dueDate!
      };

      this.taskService.addTask(newTask).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }
}