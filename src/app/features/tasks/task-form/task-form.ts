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
  // Inyeccion de dependencias necesarias para construir el formulario, interactuar con los datos y navegar
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Variables de control para identificar si el usuario esta creando o editando una tarea
  taskId: string | null = null;
  isEditing = false;

  // Construccion del formulario reactivo y asignacion de reglas de validacion para cada campo
  taskForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    assignee: ['', Validators.required],
    priority: ['Media', Validators.required],
    dueDate: ['', [Validators.required, this.futureDateValidator]]
  });

  // Metodo de inicializacion que se ejecuta automaticamente al abrir esta pantalla
  ngOnInit() {
    // Revisamos los parametros de la URL para verificar si se envio un ID especifico
    this.taskId = this.route.snapshot.paramMap.get('id');
    
    if (this.taskId) {
      this.isEditing = true;
      
      // Si existe un ID, buscamos los datos de esa tarea en particular para llenar el formulario
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

  // Validacion personalizada que impide al usuario seleccionar una fecha anterior al dia actual
  futureDateValidator(control: AbstractControl) {
    if (!control.value) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inputDate = new Date(control.value + 'T00:00:00');
    return inputDate < today ? { pastDate: true } : null;
  }

  // Metodo principal que se activa al presionar el boton de enviar formulario
  onSubmit() {
    // Si la informacion ingresada no cumple las reglas, marcamos los campos para mostrar los errores visuales
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    if (this.isEditing && this.taskId) {
      // Flujo de actualizacion: Obtenemos la tarea original para conservar el estado que ya tenia
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

        // Procesamos los cambios mediante el servicio y redireccionamos a la vista principal
        this.taskService.updateTask(updatedTask).subscribe(() => {
          this.router.navigate(['/']);
        });
      });

    } else {
      // Flujo de creacion: Generamos un objeto nuevo asignandole un ID basado en la hora actual
      const newTask: Task = {
        id: Date.now().toString(),
        title: this.taskForm.value.title!,
        assignee: this.taskForm.value.assignee!,
        priority: this.taskForm.value.priority as 'Baja' | 'Media' | 'Alta',
        status: 'Pendiente', // Las tareas nuevas inician con este estado por defecto
        dueDate: this.taskForm.value.dueDate!
      };

      // Guardamos el nuevo registro y redireccionamos a la vista principal
      this.taskService.addTask(newTask).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }
}