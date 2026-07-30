import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list';
import { TaskService } from '../../../core/services/task';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';

// Agrupador principal de las pruebas unitarias para el componente del listado de tareas
describe('TaskListComponent', () => {
  // Declaracion de variables para almacenar la instancia de la clase y su entorno de pruebas (fixture)
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;

  // Este bloque asincrono prepara las configuraciones necesarias antes de ejecutar cualquier prueba
  beforeEach(async () => {
    // Creamos un objeto falso que imita el comportamiento del TaskService real.
    // Esto asegura que la prueba sea aislada y no intente realizar peticiones HTTP hacia el backend.
    const mockTaskService = {
      getTasks: () => of([]) 
    };

    // Configuramos el modulo de pruebas propio de Angular
    await TestBed.configureTestingModule({
      imports: [TaskListComponent],
      providers: [
        // Proveemos un enrutador vacio para evitar errores de compilacion con los enlaces del HTML
        provideRouter([]),
        // Le indicamos a Angular que cuando el componente pida el TaskService, le entregue nuestro objeto falso
        { provide: TaskService, useValue: mockTaskService }
      ]
    }).compileComponents(); // Compilamos los archivos HTML y CSS asociados al componente

    // Creamos la representacion visual y logica del componente dentro de la prueba
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    
    // Ejecutamos la primera deteccion de cambios para simular la carga inicial en el navegador
    fixture.detectChanges();
  });

  // Validacion fundamental para asegurar que el componente logra inicializarse sin que la aplicacion colapse
  it('debe crearse correctamente (Prueba de Componente)', () => {
    expect(component).toBeTruthy();
  });
});