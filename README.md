# Gestor de Tareas de Equipo (Task Manager)

Aplicación web desarrollada y utilizada como prueba técnica para evaluar y validar mis competencias de desarrollo frontend en Angular de nivel mid-level. El sistema permite gestionar tareas de equipo con soporte para creación, edición, eliminación, filtros cruzados en tiempo real, estados de carga y manejo de errores.

## Enlaces del Proyecto

- **Repositorio en GitHub:** [https://github.com/Usis015221/task-manager.git]
- **Despliegue en Vercel:** [Enlace a la demo en Vercel]

## Stack Tecnologico

- **Framework:** Angular 22.1.0 (Standalone Components)
- **Lenguaje:** TypeScript en modo estricto
- **Gestion de Datos Asincronos:** RxJS (`combineLatest`, `BehaviorSubject`, `switchMap`, `shareReplay`, `catchError`)
- **Formularios:** Reactive Forms con validaciones personalizadas
- **Estilos:** Tailwind CSS
- **Backend Simulado:** JSON Server (`json-server`)

## Instrucciones para Levantar el Proyecto Localmente

Sigue los pasos a continuación para clonar y ejecutar la aplicación en tu entorno de desarrollo local.

### Prerrequisitos
Tener instalado si o si Node.js (versión 18 o superior recomendada) y también npm.

### Pasos de Instalacion

1. Clonar el repositorio:
   git clone <https://github.com/Usis015221/task-manager.git>
   cd task-manager (Para ubicarse dentro del proyecto)

2. Instalar las dependencias del proyecto:
Abrir una terminal y ejecutar el siguiente comando:
npm install

3. Iniciar el servidor local simulado (JSON Server):
En una terminal nueva, ejecute:
npx json-server --watch db.json

4. Iniciar la aplicacion Angular:
En otra terminal nueva, ejecute:
ng serve

5. Abrir el navegador e ingresar a la direccion:
http://localhost:4200/

#### Ejecucion de Pruebas Unitarias
El proyecto incluye unas cuantas pruebas unitarias tanto para el servicio principal de datos como para el componente del listado. Para ejecutarlas, utilice el siguiente comando en una nueva terminal:
ng test

##### Decisiones Tecnicas y Arquitectonicas
Componentes Standalone: Elegi esto por la arquitectura moderna de Angular que es sin módulos (NgModule), lo que reduce la verbosidad del código y mejora el rendimiento de carga inicial.

Programacion Reactiva con RxJS: Trate de evitar el uso excesivo de suscripciones manuales (subscribe) en los componentes haciendo uso del async pipe y operadores avanzados como lo son combineLatest para la gestión de filtros cruzados de texto y estado en tiempo real.

Manejo Centralizado del Estado de Carga y Errores: Realice un flujo basado en BehaviorSubject y operadores de intercepción de errores (catchError), para que me permitiera mostrar una interfaz robusta y con una retroalimentación visual inmediata ante fallas de conexión con el backend.

Validaciones Reactivas Personalizadas: Construi una validación de fecha personalizada en los formularios para impedir el registro o actualización de tareas con fechas anteriores al día actual.

###### Supuestos Realizados
Se asume que el entorno principal de pruebas operará mediante un servidor local simulado (json-server) ejecutándose en el puerto 3000.

La identificación de las tareas se maneja mediante cadenas de texto únicas generadas por marcas de tiempo en la creación o provistas por el mock de datos iniciales.

###### Futuras Mejoras (Con Mas Tiempo de Desarrollo)
Migracion a Angular Signals: Investigar sobre esta nueva tecnologia e implementarla, ya que lo poco que vi me fije que es nativa y basada en Signals para optimizar aún más la gestión del estado local sin depender completamente de flujos complejos de RxJS.

Persistencia Avanzada: Conectar la aplicación a una base de datos relacional o no relacional real (como PostgreSQL o MongoDB) a través de una API REST propia protegida por autenticación JWT.

Pruebas End-to-End (E2E): Incorporar pruebas de extremo a extremo utilizando herramientas como Playwright o Cypress para validar los flujos críticos de usuario (CRUD completo).