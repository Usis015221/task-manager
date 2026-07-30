import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list';
import { TaskService } from '../../../core/services/task';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;

  beforeEach(async () => {
    // 🔥 TRUCO: Usamos una función flecha normal en lugar de la palabra 'jasmine'
    const mockTaskService = {
      getTasks: () => of([]) 
    };

    await TestBed.configureTestingModule({
      imports: [TaskListComponent],
      providers: [
        provideRouter([]),
        { provide: TaskService, useValue: mockTaskService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente (Prueba de Componente)', () => {
    expect(component).toBeTruthy();
  });
});