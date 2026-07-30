import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task';
import { Task } from '../models/task';

// Agrupador principal de las pruebas unitarias para el servicio TaskService
describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  // Este bloque de configuracion se ejecuta antes de iniciar cada prueba individual
  beforeEach(() => {
    // Preparamos el entorno de pruebas reemplazando el modulo HTTP real por uno de simulacion
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    });
    
    // Inyectamos las instancias del servicio y del controlador de peticiones falsas
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // Este bloque se ejecuta inmediatamente despues de finalizar cada prueba
  afterEach(() => {
    // Nos aseguramos de que no queden peticiones HTTP pendientes de resolver
    httpMock.verify();
  });

  // Validacion basica para confirmar que el servicio se instancie correctamente en memoria
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Validacion del flujo completo de obtencion de datos
  it('debe obtener la lista de tareas mediante un GET', () => {
    // Definimos un arreglo de tareas ficticio para simular la respuesta del servidor
    const mockTasks: Task[] = [
      { id: '1', title: 'Tarea de Prueba', assignee: 'Erick', priority: 'Alta', status: 'Pendiente', dueDate: '2026-08-01' }
    ];

    // Ejecutamos el metodo del servicio y verificamos que los datos recibidos coincidan con nuestra simulacion
    service.getTasks().subscribe(tasks => {
      expect(tasks.length).toBe(1);
      expect(tasks).toEqual(mockTasks);
    });

    // Interceptamos la peticion HTTP que el servicio intenta enviar a la URL configurada
    const req = httpMock.expectOne(service['apiUrl']); 
    
    // Comprobamos que el metodo de la peticion interceptada sea estrictamente GET
    expect(req.request.method).toBe('GET');
    
    // Completamos la peticion devolviendo nuestro arreglo ficticio como respuesta exitosa
    req.flush(mockTasks);
  });
});