# 🎓 Portal IPB - Sistema de Gestión Educativa Instituto Privado Bolivia

Sistema web profesional para el **Instituto Privado Bolivia**, diseñado para la gestión integral de cursos, quizzes y seguimiento académico multirrol.

---

## 🚀 Guía de Instalación Rápida

Sigue estos pasos para levantar el entorno de desarrollo local:

```bash
# 1. Instalar dependencias de PHP y JS
composer install
npm install

# 2. Configuración de entorno
cp .env.example .env
php artisan key:generate

# 3. Base de datos y almacenamiento
php artisan migrate:fresh --seed
php artisan storage:link

# 4. Comandos específicos del proyecto
php artisan wayfinder:generate

# 5. Comando para ejecutar el proyecto
composer run dev

# 6. Abrir el navegador la URL
http://localhost:8000/
```

---

## 📂 Estructura del Proyecto

| Carpeta | Propósito |
|---------|-----------|
| `app/Http/Controllers/` | Lógica de negocio (Cursos, Quizzes, Usuarios) |
| `app/Models/` | Modelos y relaciones de base de datos |
| `routes/web.php` | Definición de rutas del sistema |
| `resources/` | Vistas y componentes React |
| `database/migrations/` | Estructura de tablas |

---

## 👥 Roles del Sistema

| Rol | ¿Qué puede hacer? |
|-----|-------------------|
| **Administrador** | Gestiona usuarios, cursos, materiales de apoyo (recursos) y puede ver resultados de TODOS los temas de los profesores |
| **Profesor** | Crea quizzes y revisa resultados de SUS estudiantes |
| **Estudiante** | Responde quizzes y ve sus propias calificaciones |
| **Padre** | Monitoreo de calificaciones y comunicación con docentes |

---

## 📊 Estructura Educativa

El sistema organiza el conocimiento de forma jerárquica:

```
INSTITUCIÓN
 └── CURSO (Ej: Ingeniería Informática, Administración)
      └── MÓDULO (Ej: Módulo I, II, III - equivalente a semestres)
           └── MATERIA (Ej: Matemática, Programación, Física)
                └── TEMA (Ej: Límites, Derivadas) → 📝 Quiz
```

### Ejemplo práctico:

```
Ingeniería Informática (Curso)
  ├── Primer Semestre (Módulo 1)
  │     ├── Matemática I (Materia)
  │     │     ├── Tema: Límites → Quiz de 10 preguntas
  │     │     └── Tema: Derivadas → Quiz de 15 preguntas
  │     └── Programación I (Materia)
  │           └── Tema: Variables → Quiz de 8 preguntas
  │
  └── Segundo Semestre (Módulo 2)
        └── Matemática II (Materia)
              └── Tema: Integrales → Quiz de 12 preguntas
```

---

## 🔄 Flujo de Trabajo por Rol

### 👤 Administrador

#### Gestión de Cursos:
1. **Crear curso** - Define nombre, código y nivel
2. **Configurar módulos** - Agrega módulos o periodos al curso
3. **Asignar materias** - Decide qué materias va a tener cada módulo
4. **Asignar profesores** - Designa qué profesor dictará cada materia

#### Gestión de Usuarios:
1. **Crear usuarios** - Da de alta a profesores y estudiantes
2. **Matricular estudiantes** - Inscribe estudiantes en los cursos
3. **Configurar accesos** - Define a qué módulos y materias accede cada estudiante

#### Gestión de Recursos (Material de Apoyo):
1. **Subir materiales** - Agrega PDFs, documentos o enlaces de interés
2. **Organizar por categorías** - Clasifica el contenido para fácil acceso
3. **Publicar en página informativa** - Los recursos aprobados son visibles para el público general

#### Supervisión Académica:
1. **Ver progreso** - Visualiza todos los cursos de la institución
2. **Revisar resultados** - Accede a los quizzes de cualquier profesor
3. **Monitorear rendimiento** - Ve estadísticas globales por curso, materia o estudiante

### 👨‍🏫 Profesor

#### Creación de Quizzes:
1. **Selecciona materia** - Elige una de las materias que tiene asignadas
2. **Configura el quiz** - Define número de intentos, randomizar preguntas, etc.
3. **Crea preguntas** - Agrega preguntas con opciones múltiples
4. **Publica** - El quiz queda disponible para los estudiantes

#### Seguimiento:
1. **Ve resultados** - Revisa las calificaciones de sus estudiantes
2. **Analiza rendimiento** - Identifica qué temas se les dificulta

### 👨‍🎓 Estudiante

#### Resolución de Quizzes:
1. **Ingresa a la plataforma** - Accede con sus credenciales
2. **Selecciona curso** - Elige entre los cursos donde está matriculado
3. **Elige materia** - Navega por los módulos y materias disponibles
4. **Responde el quiz** - Contesta las preguntas del tema seleccionado
5. **Obtiene resultado** - Recibe su calificación inmediatamente

#### Seguimiento Personal:
1. **Consulta historial** - Ve todos los quizzes que ha respondido
2. **Revisa calificaciones** - Visualiza su progreso académico

---

## 🛣️ Estructura de Rutas (Vista de Usuario)

### Módulo de Administrador

| Ruta | Descripción |
|------|-------------|
| `/admin` | Dashboard principal del administrador |
| `/admin/cursos` | Listado de todos los cursos |
| `/admin/cursos/crear` | Formulario para crear nuevo curso |
| `/admin/cursos/{id}/editar` | Editar curso existente |
| `/admin/cursos/{id}/asignar-materias` | Asignar materias a un curso |
| `/admin/usuarios` | Gestión de usuarios (profesores y estudiantes) |
| `/admin/usuarios/crear` | Formulario para crear nuevo usuario |
| `/admin/usuarios/{id}/editar` | Editar usuario existente |
| `/admin/matriculas/estudiante/{id}` | Gestionar matrículas de un estudiante |
| `/admin/recursos` | Listado de recursos (material de apoyo) |
| `/admin/recursos/crear` | Subir nuevo recurso (PDF, enlace, etc.) |
| `/admin/recursos/{id}/editar` | Editar recurso existente |
| `/admin/gestion-cursos` | Explorar cursos y ver resultados (supervisión) |
| `/admin/gestion-cursos/{id}/modulos` | Ver módulos de un curso específico |
| `/admin/gestion-cursos/{id}/modulo/{id}/materias` | Ver materias de un módulo |
| `/admin/gestion-cursos/{id}/modulo/{id}/materia/{id}/profesor/{id}/temas` | Ver temas por materia y profesor |
| `/admin/gestion-cursos/{id}/modulo/{id}/materia/{id}/tema/{id}/resultados` | Ver resultados detallados de un quiz |

### Módulo de Profesor

| Ruta | Descripción |
|------|-------------|
| `/profesor` | Dashboard del profesor |
| `/cursos` | Listado de cursos donde el profesor tiene materias |
| `/cursos/{id}/modulos` | Módulos disponibles en un curso |
| `/cursos/{id}/modulo/{id}/materias` | Materias que dicta el profesor en ese módulo |
| `/cursos/{id}/modulo/{id}/materia/{id}/temas` | Listado de quizzes creados |
| `/cursos/{id}/modulo/{id}/materia/{id}/temas/crear` | Crear nuevo quiz |
| `/cursos/{id}/modulo/{id}/materia/{id}/tema/{id}/editar` | Editar quiz existente |
| `/cursos/{id}/modulo/{id}/materia/{id}/tema/{id}/resultados` | Ver resultados del quiz |

### Módulo de Estudiante

| Ruta | Descripción |
|------|-------------|
| `/estudiante` | Dashboard del estudiante |
| `/estudiante/cursos` | Cursos donde está matriculado |
| `/estudiante/cursos/{id}/modulos` | Módulos a los que tiene acceso |
| `/estudiante/cursos/{id}/modulo/{id}/materias` | Materias disponibles |
| `/estudiante/cursos/{id}/modulo/{id}/materia/{id}/temas` | Quizzes disponibles |
| `/estudiante/cursos/{id}/modulo/{id}/materia/{id}/tema/{id}` | Responder quiz |
| `/estudiante/cursos/{id}/modulo/{id}/materia/{id}/tema/{id}/resultados` | Ver resultado del quiz |

### Módulo Público (Landing Page)

| Ruta | Descripción |
|------|-------------|
| `/` | Página principal de la institución |
| `/recursos` | Biblioteca pública de recursos educativos |
| `/recursos/{id}` | Ver detalle de un recurso específico |

---

## 🧩 Componentes Principales (Para Desarrolladores)

### Sistema de Notificaciones (Toasts)
- Muestra mensajes de éxito o error en la esquina inferior derecha
- Aparece automáticamente cuando el servidor envía mensajes flash
- Desaparece después de un corto tiempo

### Diálogos de Confirmación
- Ventana emergente para acciones destructivas (eliminar, desactivar)
- Requiere confirmación explícita del usuario

---

## 🛠️ Guía de Desarrollo Rápido

### Buenas Prácticas

| Concepto | Recomendación |
|----------|---------------|
| **Mensajes de éxito** | Usar `->with('success', 'mensaje')` en controladores |
| **Mensajes de error** | Usar `->with('error', 'mensaje')` para errores generales |
| **Errores de validación** | Usar `->withErrors(['campo' => 'error'])` |
| **Eliminaciones** | Siempre usar el componente `ConfirmDialog` |
| **Consultas a BD** | Usar `withCount()` para conteos en lugar de cargar relaciones completas |

---

## 📁 Recursos

Todos los recursos como ser el **diagrama de base de datos**, **la base de datos** actual los **mockups** del sistema estan ubicados actualmente en: `C:\Users\SMN\Downloads\dev\ipb-docs`.

## 📝 Notas de Versión

### Versión 0.1 (Actual)
- ✅ Gestión de usuarios, cursos, módulos, materias y temas
- ✅ Sistema de quizzes con preguntas de opción múltiple
- ✅ Roles de administrador, profesor y estudiante
- ✅ Matriculación de estudiantes por curso y módulo
- ✅ Visualización de resultados por estudiante
- ✅ Supervisión para administradores
- ✅ Gestión de recursos educativos (PDFs)
- ✅ Landing page pública con biblioteca de recursos

### Próximas Versiones
- 📱 Módulo para padres/tutores
- 📊 Reportes estadísticos avanzados
- 🔔 Notificaciones por correo electrónico
- 📱 Aplicación móvil

---