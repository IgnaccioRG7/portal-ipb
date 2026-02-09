
Título del Proyecto: Sistema de Gestión Educativa - Instituto privado boliviaa
Objetivo Principal: Crear una interfaz base responsive (desktop/mobile) con Material Design (Stitch) para un sistema web que gestiona cursos, exámenes y usuarios con múltiples roles.
Especificaciones técnicas:
Responsive: Mobile-first pero optimizado para desktop
Patrón de navegación: Navigation Rail para desktop, Bottom Navigation para mobile
Paleta de colores: Institucional (sugerencia: azul académico #213a57 como primario, naranja #fffb00 como secundario)

Componentes prioritarios: AppBar, Cards, Dialogs, Data Tables, Forms, Steppers, Chips
Estructura de roles y permisos:
1. Admin (Acceso completo)
Dashboard con métricas globales
Gestión de usuarios (CRUD para todos los roles)
Administración de cursos y categorías
Reportes
Configuración del sistema

2. Profesores
Dashboard con sus cursos asignados
Creación/edición de exámenes
Gestión de preguntas por materia
Revisión de resultados de estudiantes
Comunicación con estudiantes/padres

3. Estudiantes
Vista de cursos inscritos
Acceso a exámenes disponibles
Historial de intentos y calificaciones
Progreso por materia
Recursos de estudio

4. Padres
Monitoreo del progreso de sus hijos
Notificaciones de calificaciones
Comunicación con profesores
Calendario de evaluaciones

Módulos del sistema:
A. Gestión de Cursos
Categorías principales:
ESFM (Escuela Superior de Formación de Maestros)
Secundaria - Primaria
Universidades
Cursos especializados

Cada curso contiene:
Materias específicas (Matemática, Física, Química, Historia, Conocimiento General, etc.)
Profesores asignados
Estudiantes inscritos

B. Sistema de Exámenes/Quizzes
Tipos de exámenes:
Evaluativos (calificados)
Prácticos (sin calificación)
Simulacros
Diagnósticos

Características:
Límite de tiempo configurable
Diversos tipos de preguntas (opción múltiple, verdadero/falso, desarrollo)
Puntuación automática/semi-automática
Intentos múltiples configurables
Retroalimentación inmediata/diferida

C. Banco de Preguntas
Organizado por: Curso → Materia → Tema

Filtros por:
Palabras clave
Estado (aprobada, pendiente, archivada)
Importación/exportación masiva

Flujos principales:
1. Creación de examen (Profesor)
Seleccionar curso → Elegir materia → Configurar parámetros del examen
→ Seleccionar preguntas del banco o crear nuevas → Revisar y publicar
2. Realización de examen (Estudiante)
Acceder a curso → Ver exámenes disponibles → Iniciar examen → Responder
→ Revisar respuestas → Enviar → Ver resultados/retroalimentación
3. Seguimiento (Padres)
Ver hijos registrados → Seleccionar hijo → Ver progreso general
→ Detalle por materia → Comunicarse con profesor
Componentes específicos a diseñar:
1. Dashboard personalizado por rol
Tarjetas de resumen
Gráficos de progreso (Charts)
Calendario de actividades
Notificaciones recientes
Accesos rápidos

2. Constructor de exámenes
Editor de preguntas
Selector de preguntas con vista previa
Configurador de parámetros (tiempo, intentos, aleatorización)
Vista previa del examen desde perspectiva del estudiante

3. Reproductor de exámenes
Interfaz limpia y sin distracciones
Temporizador visible
Navegación entre preguntas
Indicador de progreso
Marcador de preguntas para revisión

4. Panel de resultados
Estadísticas por estudiante/grupo
Gráficos de distribución de puntajes
Análisis por pregunta (porcentaje de aciertos)
Exportación de reportes (PDF, Excel)



php artisan wayfinder:generate
php artisan storage:link


Conocimientos Generales	mate, física, química
Razonamiento Lógico	series, aritmética, geometría, calendario
Socioemocionales	frustración, actitudes, convivencia, honestidad


// PHP puro vs Laravel Collections
$array = [1, 2, 3, 4, 5];

// PHP puro
$filtered = array_filter($array, fn($n) => $n % 2 === 0); // [2, 4]
$doubled = array_map(fn($n) => $n * 2, $filtered); // [4, 8]

// Laravel Collections
$collection = collect($array);
$result = $collection
    ->filter(fn($n) => $n % 2 === 0)  // [2, 4]
    ->map(fn($n) => $n * 2)           // [4, 8]
    ->values();                        // [0 => 4, 1 => 8]


============CURSOS============
c1 | ESFM
c2 | PREUNIVERSITARIOS

============MODULOS============
m1 | MODULO 1  - c1
m2 | MODULO 2  - c1
m3 | MODULO 1  - c2
m4 | MODULO 1  - c2

============MATERIAS============
ma1 | CONOCIMIENTOS GENERALES
ma2 | LECTURAS DE COMPRENSION
ma3 | MATEMATICA
ma4 | FISICA
ma5 | QUIMICA

============MODULOS_MATERIAS============
      modulo materia
modma1 | m1 | ma1
modma2 | m2 | ma2
modma3 | m3 | ma3
modma4 | m4 | ma4

============TEMAS============
                  modulomateria
t1 | MATEMATICA | modma1
t2 | QUIMICA | modma1
t3 | LECTURA 1 | modma2
t4 | LECTURA 2 | modma2
t5 | ECUACIONES | modma3
t7 | MRU | modma4
t8 | MRUV | modma4



UNIVERSIDAD (Curso: "Ingeniería Informática")
  ├── SEMESTRE 1 (Módulo 1)
  │     ├── MATERIA: Matemática I
  │     │     ├── TEMA: Límites → Quiz
  │     │     ├── TEMA: Derivadas → Quiz
  │     │     └── TEMA: Integrales → Quiz
  │     └── MATERIA: Programación I
  │           ├── TEMA: Variables → Quiz
  │           └── TEMA: Bucles → Quiz
  │
  ├── SEMESTRE 2 (Módulo 2)
  │     ├── MATERIA: Matemática II (misma materia, diferentes temas)
  │     │     ├── TEMA: Matrices → Quiz
  │     │     └── TEMA: Vectores → Quiz
  │     └── MATERIA: Bases de Datos
  │           └── (Esta materia ES el quiz directo, no tiene temas)