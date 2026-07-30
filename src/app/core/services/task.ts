import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private http = inject(HttpClient);

    private apiUrl = 'http://localhost:3000/tasks';

    getTasks() : Observable<Task[]> {
      return this.http.get<Task[]>(this.apiUrl);
    }
}