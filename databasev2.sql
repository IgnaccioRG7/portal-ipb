CREATE TABLE `personas`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `ci` VARCHAR(20) NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `apellido_paterno` VARCHAR(100) NOT NULL,
    `apellido_materno` VARCHAR(100) NULL,
    `fecha_nacimiento` DATE NULL,
    `genero` ENUM('masculino', 'femenino', 'otro') NULL DEFAULT 'masculino',
    `celular` VARCHAR(20) NULL,
    `direccion` TEXT NULL,
    `ciudad` VARCHAR(100) NULL DEFAULT 'La Paz',
    `tutor_id` INT NULL,
    `parentesco_tutor` ENUM(
        'padre',
        'madre',
        'tutor',
        'hermano',
        'otro'
    ) NULL DEFAULT 'padre',
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(), `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `personas` ADD INDEX `personas_nombre_apellido_paterno_index`(`nombre`, `apellido_paterno`);
ALTER TABLE
    `personas` ADD UNIQUE `personas_ci_unique`(`ci`);
ALTER TABLE
    `personas` ADD INDEX `personas_tutor_id_index`(`tutor_id`);
CREATE TABLE `roles`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(50) NOT NULL,
    `descripcion` TEXT NULL,
    `permisos` JSON NULL DEFAULT 'ARRAY[]',
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(), `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `roles` ADD UNIQUE `roles_nombre_unique`(`nombre`);
CREATE TABLE `users`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `persona_id` INT NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `rol_id` INT NOT NULL,
    `avatar_url` VARCHAR(255) NULL DEFAULT '/avatars/default.png',
    `estado` ENUM(
        'activo',
        'inactivo',
        'bloqueado',
        'pendiente'
    ) NULL DEFAULT 'pendiente',
    `ultimo_acceso` TIMESTAMP NULL,
    `intentos_fallidos` INT NULL,
    `fecha_bloqueo` TIMESTAMP NULL,
    `token_reset_password` VARCHAR(100) NULL,
    `token_expira` TIMESTAMP NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(), `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `users` ADD UNIQUE `users_persona_id_unique`(`persona_id`);
ALTER TABLE
    `users` ADD UNIQUE `users_name_unique`(`name`);
ALTER TABLE
    `users` ADD UNIQUE `users_email_unique`(`email`);
ALTER TABLE
    `users` ADD INDEX `users_rol_id_index`(`rol_id`);
CREATE TABLE `cursos`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `codigo_curso` VARCHAR(20) NOT NULL,
    `nombre` VARCHAR(200) NOT NULL,
    `descripcion` TEXT NULL,
    `nivel` ENUM(
        'básico',
        'intermedio',
        'avanzado',
        'especializado'
    ) NULL DEFAULT 'básico',
    `duracion_semanas` INT NULL,
    `horas_semanales` INT NULL DEFAULT '5',
    `precio` DECIMAL(10, 2) NULL DEFAULT '0',
    `capacidad_maxima` INT NULL DEFAULT '30',
    `estado` ENUM(
        'activo',
        'inactivo',
        'completo',
        'cancelado'
    ) NULL DEFAULT 'activo',
    `fecha_inicio` DATE NULL,
    `fecha_fin` DATE NULL,
    `imagen_url` VARCHAR(255) NULL,
    `requisitos` TEXT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(), `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `cursos` ADD UNIQUE `cursos_codigo_curso_unique`(`codigo_curso`);
ALTER TABLE
    `cursos` ADD INDEX `cursos_estado_index`(`estado`);
CREATE TABLE `materias`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `codigo_materia` VARCHAR(20) NOT NULL,
    `nombre` VARCHAR(150) NOT NULL,
    `descripcion` TEXT NULL,
    `color` VARCHAR(7) NULL DEFAULT '#1e88e5',
    `objetivos_generales` TEXT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(), `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `materias` ADD UNIQUE `materias_codigo_materia_unique`(`codigo_materia`);
ALTER TABLE
    `materias` ADD INDEX `materias_nombre_index`(`nombre`);
CREATE TABLE `curso_materias`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `curso_id` INT NOT NULL,
    `materia_id` INT NOT NULL,
    `horas_semanales` INT NULL DEFAULT '3',
    `estado` ENUM('activa', 'inactiva') NULL DEFAULT 'activa',
    `fecha_inicio` DATE NULL,
    `fecha_fin` DATE NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(), `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `curso_materias` ADD UNIQUE `curso_materias_curso_id_materia_id_unique`(`curso_id`, `materia_id`);
ALTER TABLE
    `curso_materias` ADD INDEX `curso_materias_curso_id_index`(`curso_id`);
ALTER TABLE
    `curso_materias` ADD INDEX `curso_materias_materia_id_index`(`materia_id`);
CREATE TABLE `asignaciones_profesores`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `profesor_id` INT NOT NULL,
    `curso_materia_id` INT NOT NULL,
    `fecha_asignacion` DATE NULL DEFAULT 'DEFAULT  ( CURRENT_DATE)',
    `fecha_finalizacion` DATE NULL,
    `estado` ENUM('activo', 'finalizado', 'suspendido') NULL DEFAULT 'activo',
    `horas_asignadas` INT NULL,
    `observaciones` TEXT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(), `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `asignaciones_profesores` ADD UNIQUE `asignaciones_profesores_profesor_id_curso_materia_id_unique`(`profesor_id`, `curso_materia_id`);
ALTER TABLE
    `asignaciones_profesores` ADD INDEX `asignaciones_profesores_profesor_id_index`(`profesor_id`);
ALTER TABLE
    `asignaciones_profesores` ADD INDEX `asignaciones_profesores_curso_materia_id_index`(`curso_materia_id`);
CREATE TABLE `matriculas`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `estudiante_id` INT NOT NULL,
    `curso_id` INT NOT NULL,
    `codigo_matricula` VARCHAR(30) NULL,
    `fecha_finalizacion` DATE NULL,
    `estado` ENUM(
        'activo',
        'finalizado',
        'retirado',
        'suspendido'
    ) NULL DEFAULT 'activo',
    `observaciones` TEXT NULL,
    `created_by` INT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(), `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `matriculas` ADD UNIQUE `matriculas_estudiante_id_curso_id_unique`(`estudiante_id`, `curso_id`);
ALTER TABLE
    `matriculas` ADD INDEX `matriculas_estudiante_id_index`(`estudiante_id`);
ALTER TABLE
    `matriculas` ADD INDEX `matriculas_curso_id_index`(`curso_id`);
ALTER TABLE
    `matriculas` ADD UNIQUE `matriculas_codigo_matricula_unique`(`codigo_matricula`);
CREATE TABLE `temas`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `materia_id` INT NOT NULL,
    `codigo_tema` VARCHAR(30) NULL,
    `nombre` VARCHAR(150) NOT NULL,
    `descripcion` TEXT NULL,
    `contenido_json` JSON NOT NULL,
    `estado` ENUM('activo', 'inactivo', 'borrador') NULL DEFAULT 'borrador',
    `visibilidad` ENUM(
        'publico',
        'estudiantes',
        'profesores'
    ) NULL DEFAULT 'estudiantes',
    `fecha_publicacion` DATE NULL,
    `created_by` INT NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(), `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `temas` ADD INDEX `temas_materia_id_index`(`materia_id`);
ALTER TABLE
    `temas` ADD INDEX `temas_created_by_index`(`created_by`);
CREATE TABLE `examenes`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `codigo_examen` VARCHAR(30) NOT NULL,
    `curso_materia_id` INT NOT NULL,
    `titulo` VARCHAR(200) NOT NULL,
    `descripcion` TEXT NULL,
    `tipo` ENUM(
        'evaluativo',
        'practico',
        'simulacro',
        'diagnostico'
    ) NOT NULL DEFAULT 'evaluativo',
    `contenido_json` JSON NOT NULL,
    `duracion_minutos` INT NULL DEFAULT '60',
    `intentos_permitidos` INT NULL DEFAULT '1',
    `fecha_disponible` DATETIME NULL,
    `fecha_limite` DATETIME NULL,
    `mostrar_resultados` ENUM(
        'inmediato',
        'despues_fecha',
        'nunca'
    ) NULL DEFAULT 'inmediato',
    `porcentaje_aprobacion` DECIMAL(5, 2) NULL DEFAULT '60',
    `estado` ENUM(
        'borrador',
        'publicado',
        'finalizado',
        'archivado'
    ) NULL DEFAULT 'borrador',
    `created_by` INT NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(), `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `examenes` ADD INDEX `examenes_fecha_disponible_fecha_limite_index`(`fecha_disponible`, `fecha_limite`);
ALTER TABLE
    `examenes` ADD UNIQUE `examenes_codigo_examen_unique`(`codigo_examen`);
ALTER TABLE
    `examenes` ADD INDEX `examenes_curso_materia_id_index`(`curso_materia_id`);
ALTER TABLE
    `examenes` ADD INDEX `examenes_estado_index`(`estado`);
CREATE TABLE `examenes_realizados`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `examen_id` INT NOT NULL,
    `matricula_id` INT NOT NULL,
    `intento_numero` INT NULL DEFAULT '1',
    `fecha_inicio` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(), `fecha_fin` DATETIME NULL, `tiempo_utilizado` INT NULL, `respuestas_json` JSON NULL, `puntaje_total` DECIMAL(5, 2) NULL, `porcentaje` DECIMAL(5, 2) NULL, `estado` ENUM(
        'en_progreso',
        'completado',
        'abandonado',
        'expirado'
    ) NULL DEFAULT 'en_progreso', `revisado_por` INT NULL, `fecha_revision` DATETIME NULL, `comentario_revisor` TEXT NULL, `ip_address` VARCHAR(45) NULL, `user_agent` TEXT NULL, `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(), `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `examenes_realizados` ADD INDEX `examenes_realizados_examen_id_matricula_id_index`(`examen_id`, `matricula_id`);
ALTER TABLE
    `examenes_realizados` ADD UNIQUE `examen_id_matricula_id_intento_numero_unique`(
        `examen_id`,
        `matricula_id`,
        `intento_numero`
    );
ALTER TABLE
    `examenes_realizados` ADD INDEX `examenes_realizados_fecha_inicio_index`(`fecha_inicio`);
ALTER TABLE
    `examenes_realizados` ADD INDEX `examenes_realizados_estado_index`(`estado`);
CREATE TABLE `recursos_estudio`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `materia_id` INT NOT NULL,
    `titulo` VARCHAR(200) NOT NULL,
    `descripcion` TEXT NULL,
    `tipo` ENUM(
        'documento',
        'video',
        'enlace',
        'presentacion',
        'imagen',
        'audio'
    ) NOT NULL,
    `url` VARCHAR(500) NOT NULL,
    `visibilidad` ENUM(
        'publico',
        'estudiantes',
        'profesores'
    ) NULL DEFAULT 'estudiantes',
    `descargas` INT NULL,
    `estado` ENUM('activo', 'inactivo') NULL DEFAULT 'activo',
    `created_by` INT NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(), `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `recursos_estudio` ADD INDEX `recursos_estudio_materia_id_index`(`materia_id`);
ALTER TABLE
    `recursos_estudio` ADD INDEX `recursos_estudio_tipo_index`(`tipo`);
CREATE TABLE `notificaciones`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `usuario_id` INT NOT NULL,
    `tipo` ENUM(
        'calificacion',
        'examen',
        'mensaje',
        'sistema',
        'recordatorio',
        'anuncio'
    ) NOT NULL,
    `titulo` VARCHAR(150) NOT NULL,
    `contenido` TEXT NULL,
    `enlace` VARCHAR(255) NULL,
    `metadata` JSON NULL DEFAULT 'ARRAY[]',
    `leido_at` TIMESTAMP NULL,
    `expira_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `notificaciones` ADD INDEX `notificaciones_tipo_index`(`tipo`);
CREATE TABLE `curso_materia_temas`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `curso_materia_id` INT NOT NULL,
    `tema_id` INT NOT NULL,
    `orden` INT NOT NULL,
    `estado` ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
    `created_at` TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP NOT NULL
);
ALTER TABLE
    `personas` ADD CONSTRAINT `personas_tutor_id_foreign` FOREIGN KEY(`tutor_id`) REFERENCES `personas`(`id`);
ALTER TABLE
    `examenes` ADD CONSTRAINT `examenes_curso_materia_id_foreign` FOREIGN KEY(`curso_materia_id`) REFERENCES `curso_materias`(`id`);
ALTER TABLE
    `curso_materias` ADD CONSTRAINT `curso_materias_materia_id_foreign` FOREIGN KEY(`materia_id`) REFERENCES `materias`(`id`);
ALTER TABLE
    `examenes_realizados` ADD CONSTRAINT `examenes_realizados_examen_id_foreign` FOREIGN KEY(`examen_id`) REFERENCES `examenes`(`id`);
ALTER TABLE
    `curso_materia_temas` ADD CONSTRAINT `curso_materia_temas_tema_id_foreign` FOREIGN KEY(`tema_id`) REFERENCES `temas`(`id`);
ALTER TABLE
    `asignaciones_profesores` ADD CONSTRAINT `asignaciones_profesores_curso_materia_id_foreign` FOREIGN KEY(`curso_materia_id`) REFERENCES `curso_materias`(`id`);
ALTER TABLE
    `users` ADD CONSTRAINT `users_persona_id_foreign` FOREIGN KEY(`persona_id`) REFERENCES `personas`(`id`);
ALTER TABLE
    `recursos_estudio` ADD CONSTRAINT `recursos_estudio_materia_id_foreign` FOREIGN KEY(`materia_id`) REFERENCES `materias`(`id`);
ALTER TABLE
    `curso_materias` ADD CONSTRAINT `curso_materias_curso_id_foreign` FOREIGN KEY(`curso_id`) REFERENCES `cursos`(`id`);
ALTER TABLE
    `users` ADD CONSTRAINT `users_rol_id_foreign` FOREIGN KEY(`rol_id`) REFERENCES `roles`(`id`);
ALTER TABLE
    `temas` ADD CONSTRAINT `temas_materia_id_foreign` FOREIGN KEY(`materia_id`) REFERENCES `materias`(`id`);
ALTER TABLE
    `notificaciones` ADD CONSTRAINT `notificaciones_usuario_id_foreign` FOREIGN KEY(`usuario_id`) REFERENCES `users`(`id`);
ALTER TABLE
    `matriculas` ADD CONSTRAINT `matriculas_estudiante_id_foreign` FOREIGN KEY(`estudiante_id`) REFERENCES `users`(`id`);
ALTER TABLE
    `asignaciones_profesores` ADD CONSTRAINT `asignaciones_profesores_profesor_id_foreign` FOREIGN KEY(`profesor_id`) REFERENCES `users`(`id`);
ALTER TABLE
    `matriculas` ADD CONSTRAINT `matriculas_curso_id_foreign` FOREIGN KEY(`curso_id`) REFERENCES `cursos`(`id`);
ALTER TABLE
    `curso_materia_temas` ADD CONSTRAINT `curso_materia_temas_curso_materia_id_foreign` FOREIGN KEY(`curso_materia_id`) REFERENCES `curso_materias`(`id`);
ALTER TABLE
    `examenes_realizados` ADD CONSTRAINT `examenes_realizados_matricula_id_foreign` FOREIGN KEY(`matricula_id`) REFERENCES `matriculas`(`id`);