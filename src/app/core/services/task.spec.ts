import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task'; // Ojo: Asegurate que este import coincida con el nombre de tu archivo
import { Task } from '../models/task';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    // 1. Configuramos el entorno de pruebas simulando el HttpClient
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    });
    
    // 2. Inyectamos el servicio y el controlador de pruebas HTTP
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verificamos que no queden peticiones pendientes al terminar la prueba
    httpMock.verify();
  });

  // Prueba 1: Que el servicio exista
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Prueba 2: Que el GET de tareas funcione correctamente
  it('debe obtener la lista de tareas mediante un GET', () => {
    // Creamos una tarea falsa para la prueba
    const mockTasks: Task[] = [
      { id: '1', title: 'Tarea de Prueba', assignee: 'Erick', priority: 'Alta', status: 'Pendiente', dueDate: '2026-08-01' }
    ];

    // Nos suscribimos al método getTasks
    service.getTasks().subscribe(tasks => {
      expect(tasks.length).toBe(1);
      expect(tasks).toEqual(mockTasks);
    });

    // Simulamos y atrapamos la petición HTTP hacia nuestro backend
    const req = httpMock.expectOne(service['apiUrl']); 
    
    // Verificamos que sea un método GET
    expect(req.request.method).toBe('GET');
    
    // Devolvemos la tarea falsa como respuesta exitosa
    req.flush(mockTasks);
  });
});