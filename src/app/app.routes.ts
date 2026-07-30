import { Routes } from '@angular/router';
import { TaskListComponent } from './features/tasks/task-list/task-list';
import { TaskFormComponent } from './features/tasks/task-form/task-form';

export const routes: Routes = [
  { path: '', component: TaskListComponent },
  { path: 'nueva-tarea', component: TaskFormComponent },
  { path: 'editar-tarea/:id', component: TaskFormComponent }
];