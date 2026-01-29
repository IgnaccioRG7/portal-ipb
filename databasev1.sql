-- ============================================
-- SISTEMA DE GESTIÓN EDUCATIVA - INSTITUTO PRIVADO BOLIVIA
-- BASE DE DATOS FINAL SIMPLIFICADA
-- ============================================

-- 1. TABLA DE PERSONAS (Información personal)
CREATE TABLE personas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ci VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100),
    fecha_nacimiento DATE,
    genero ENUM('masculino', 'femenino', 'otro') DEFAULT 'masculino',
    telefono VARCHAR(20),
    celular VARCHAR(20),
    direccion TEXT,
    ciudad VARCHAR(100) DEFAULT 'La Paz',
    foto_url VARCHAR(255),
    estado_civil ENUM('soltero', 'casado', 'divorciado', 'viudo') DEFAULT 'soltero',
    tutor_id INT NULL, -- Relación con otro usuario que es tutor
    parentesco_tutor ENUM('padre', 'madre', 'tutor', 'hermano', 'otro') DEFAULT 'padre',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_ci (ci),
    INDEX idx_nombre (nombre, apellido_paterno),
    INDEX idx_tutor (tutor_id),
    FOREIGN KEY (tutor_id) REFERENCES personas(id) ON DELETE SET NULL
);

-- 2. TABLA DE ROLES
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    permisos JSON DEFAULT '{}',
    nivel_permisos INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. TABLA DE USUARIOS (Datos de acceso)
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    persona_id INT NOT NULL UNIQUE,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol_id INT NOT NULL,
    avatar_url VARCHAR(255) DEFAULT '/avatars/default.png',
    estado ENUM('activo', 'inactivo', 'bloqueado', 'pendiente') DEFAULT 'pendiente',
    ultimo_acceso TIMESTAMP NULL,
    intentos_fallidos INT DEFAULT 0,
    fecha_bloqueo TIMESTAMP NULL,
    token_reset_password VARCHAR(100),
    token_expira TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (persona_id) REFERENCES personas(id) ON DELETE CASCADE,
    FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE RESTRICT,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_rol (rol_id)
);

-- ============================================
-- 4. GESTIÓN DE CURSOS
-- ============================================

CREATE TABLE cursos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo_curso VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    categoria ENUM('ESFM', 'Secundaria', 'Primaria', 'Universidades', 'Especializados') NOT NULL,
    nivel ENUM('básico', 'intermedio', 'avanzado', 'especializado') DEFAULT 'básico',
    duracion_semanas INT,
    horas_semanales INT DEFAULT 5,
    precio DECIMAL(10,2) DEFAULT 0.00,
    capacidad_maxima INT DEFAULT 30,
    cupos_disponibles INT DEFAULT 30,
    estado ENUM('activo', 'inactivo', 'completo', 'cancelado') DEFAULT 'activo',
    fecha_inicio DATE,
    fecha_fin DATE,
    imagen_url VARCHAR(255),
    requisitos TEXT,
    created_by INT NOT NULL, -- Referencia a usuario, sin FK
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_categoria (categoria),
    INDEX idx_estado (estado)
);

-- 5. TABLA DE MATERIAS
CREATE TABLE materias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo_materia VARCHAR(20) UNIQUE NOT NULL, -- Ej: CLEC, RLOG, CGEN
    nombre VARCHAR(150) NOT NULL, -- Ej: "Comprensión Lectora"
    descripcion TEXT,
    area ENUM('ciencias', 'letras', 'general', 'especifica') DEFAULT 'general',
    color VARCHAR(7) DEFAULT '#1e88e5',
    objetivos_generales TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_codigo (codigo_materia),
    INDEX idx_nombre (nombre)
);

-- 2. TABLA DE RELACIÓN CURSO-MATERIA (N:M)
CREATE TABLE curso_materias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    curso_id INT NOT NULL,
    materia_id INT NOT NULL,
    horas_semanales INT DEFAULT 3,
    orden INT DEFAULT 0,
    estado ENUM('activa', 'inactiva') DEFAULT 'activa',
    fecha_inicio DATE,
    fecha_fin DATE,
    configuracion JSON DEFAULT '{}', -- Config específica para esta materia en este curso
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE,
    FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE,
    UNIQUE KEY unique_curso_materia (curso_id, materia_id),
    INDEX idx_curso (curso_id),
    INDEX idx_materia (materia_id)
);

-- ============================================
-- 6. ASIGNACIONES Y MATRÍCULAS
-- ============================================

-- 3. MODIFICAR ASIGNACIONES DE PROFESORES (ahora referencia curso_materias)
CREATE TABLE asignaciones_profesores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    profesor_id INT NOT NULL,
    curso_materia_id INT NOT NULL, -- Ahora referencia curso_materias, no materias directamente
    fecha_asignacion DATE DEFAULT (CURRENT_DATE),
    fecha_finalizacion DATE,
    estado ENUM('activo', 'finalizado', 'suspendido') DEFAULT 'activo',
    horas_asignadas INT,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (profesor_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (curso_materia_id) REFERENCES curso_materias(id) ON DELETE CASCADE,
    UNIQUE KEY unique_asignacion (profesor_id, curso_materia_id),
    INDEX idx_profesor (profesor_id),
    INDEX idx_curso_materia (curso_materia_id)
);

CREATE TABLE matriculas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    estudiante_id INT NOT NULL,
    curso_id INT NOT NULL,
    codigo_matricula VARCHAR(30) UNIQUE,
    fecha_matricula DATE DEFAULT (CURRENT_DATE),
    fecha_ingreso DATE,
    fecha_finalizacion DATE,
    estado ENUM('activo', 'finalizado', 'retirado', 'suspendido') DEFAULT 'activo',
    calificacion_final DECIMAL(5,2),
    promedio DECIMAL(5,2),
    observaciones TEXT,
    created_by INT, -- Referencia a usuario, sin FK
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (estudiante_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_matricula (estudiante_id, curso_id),
    INDEX idx_estudiante (estudiante_id),
    INDEX idx_curso (curso_id)
);

-- ============================================
-- 7. SISTEMA DE TEMAS Y CONTENIDOS
-- ============================================

CREATE TABLE temas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    materia_id INT NOT NULL, -- Referencia directa a la materia
    codigo_tema VARCHAR(30),
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    orden INT DEFAULT 0,
    contenido_json JSON NOT NULL,
    estado ENUM('activo', 'inactivo', 'borrador') DEFAULT 'borrador',
    visibilidad ENUM('publico', 'estudiantes', 'profesores') DEFAULT 'estudiantes',
    fecha_publicacion DATE,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE,
    INDEX idx_materia (materia_id),
    INDEX idx_created_by (created_by)
);

-- ============================================
-- 8. SISTEMA DE EXAMENES
-- ============================================

CREATE TABLE examenes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo_examen VARCHAR(30) UNIQUE NOT NULL,
    curso_materia_id INT NOT NULL, -- Ahora referencia curso_materias
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    tipo ENUM('evaluativo', 'practico', 'simulacro', 'diagnostico') NOT NULL DEFAULT 'evaluativo',
    contenido_json JSON NOT NULL,
    configuracion_json JSON NOT NULL,
    duracion_minutos INT DEFAULT 60,
    intentos_permitidos INT DEFAULT 1,
    fecha_disponible DATETIME,
    fecha_limite DATETIME,
    mostrar_resultados ENUM('inmediato', 'despues_fecha', 'nunca') DEFAULT 'inmediato',
    porcentaje_aprobacion DECIMAL(5,2) DEFAULT 60.00,
    estado ENUM('borrador', 'publicado', 'finalizado', 'archivado') DEFAULT 'borrador',
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (curso_materia_id) REFERENCES curso_materias(id) ON DELETE CASCADE,
    INDEX idx_curso_materia (curso_materia_id),
    INDEX idx_fechas (fecha_disponible, fecha_limite),
    INDEX idx_estado (estado)
);

-- 9. TABLA DE EXAMENES REALIZADOS (Desde matriculas)
CREATE TABLE examenes_realizados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    examen_id INT NOT NULL,
    matricula_id INT NOT NULL, -- Relación desde matrícula, no desde usuario
    intento_numero INT DEFAULT 1,
    fecha_inicio DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_fin DATETIME,
    tiempo_utilizado INT,
    respuestas_json JSON,
    resultado_json JSON,
    puntaje_total DECIMAL(5,2),
    porcentaje DECIMAL(5,2),
    calificacion DECIMAL(5,2),
    aprobado BOOLEAN DEFAULT false,
    estado ENUM('en_progreso', 'completado', 'abandonado', 'expirado') DEFAULT 'en_progreso',
    revisado_por INT, -- Referencia a usuario, sin FK
    fecha_revision DATETIME,
    comentario_revisor TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (examen_id) REFERENCES examenes(id) ON DELETE CASCADE,
    FOREIGN KEY (matricula_id) REFERENCES matriculas(id) ON DELETE CASCADE,
    UNIQUE KEY unique_intento (examen_id, matricula_id, intento_numero),
    INDEX idx_examen_matricula (examen_id, matricula_id),
    INDEX idx_fecha (fecha_inicio),
    INDEX idx_estado (estado)
);

-- ============================================
-- 10. RECURSOS DE ESTUDIO
-- ============================================

CREATE TABLE recursos_estudio (
    id INT PRIMARY KEY AUTO_INCREMENT,
    materia_id INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    tipo ENUM('documento', 'video', 'enlace', 'presentacion', 'imagen', 'audio') NOT NULL,
    url VARCHAR(500) NOT NULL,
    formato VARCHAR(50),
    tamaño_bytes INT,
    visibilidad ENUM('publico', 'estudiantes', 'profesores') DEFAULT 'estudiantes',
    descargas INT DEFAULT 0,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    created_by INT NOT NULL, -- Referencia a usuario, sin FK
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE,
    INDEX idx_materia (materia_id),
    INDEX idx_tipo (tipo)
);

-- ============================================
-- 11. NOTIFICACIONES
-- ============================================

CREATE TABLE notificaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    tipo ENUM('calificacion', 'examen', 'mensaje', 'sistema', 'recordatorio', 'anuncio') NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    contenido TEXT,
    enlace VARCHAR(255),
    metadata JSON DEFAULT '{}',
    leido BOOLEAN DEFAULT false,
    leido_at TIMESTAMP NULL,
    expira_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id, leido),
    INDEX idx_tipo (tipo)
);