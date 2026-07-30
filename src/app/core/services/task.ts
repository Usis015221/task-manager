import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task';

// El decorador Injectable permite que este servicio sea utilizado en cualquier parte de la aplicacion
// sin necesidad de declararlo multiples veces en los modulos.
@Injectable({
    providedIn: 'root'
})
export class TaskService {
    // Inyectamos el modulo HttpClient para poder realizar peticiones de red hacia el backend
    private http = inject(HttpClient);

    // Definimos la direccion principal de nuestra API o servidor local
    private apiUrl = 'http://localhost:3000/tasks';

    // Peticion GET para recuperar todo el arreglo de tareas desde la base de datos
    getTasks() : Observable<Task[]> {
      return this.http.get<Task[]>(this.apiUrl);
    }

    // Peticion POST para registrar una tarea nueva en la base de datos
    addTask(task: Task): Observable<Task> {
        return this.http.post<Task>(this.apiUrl, task);
    }

    // Peticion PUT para reemplazar los datos de una tarea existente.
    // Concatenamos el ID de la tarea a la URL para indicar cual registro se debe actualizar.
    updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${task.id}`, task);
    }
  
    // Peticion DELETE para remover permanentemente una tarea.
    // Al igual que en update, se requiere especificar el ID en la URL.
    deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}