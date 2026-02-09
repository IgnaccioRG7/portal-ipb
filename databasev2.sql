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
    `area` ENUM(
        'ciencias',
        'lenguaje',
        'general',
        'especifica'
    ) NOT NULL DEFAULT 'general',
    `color` VARCHAR(7) NULL DEFAULT '#1e88e5',
    `objetivos_generales` TEXT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(), `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `materias` ADD UNIQUE `materias_codigo_materia_unique`(`codigo_materia`);
ALTER TABLE
    `materias` ADD INDEX `materias_nombre_index`(`nombre`);
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
    `modulo_materia_id` INT NOT NULL,
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
    `temas` ADD INDEX `temas_modulo_materia_id_index`(`modulo_materia_id`);
ALTER TABLE
    `temas` ADD INDEX `temas_created_by_index`(`created_by`);
CREATE TABLE `examenes_realizados`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `tema_id` INT NOT NULL,
    `matricula_id` INT NOT NULL,
    `intento_numero` INT NULL DEFAULT '1',
    `fecha_inicio` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(), `fecha_fin` DATETIME NULL, `tiempo_utilizado` INT NULL, `respuestas_json` JSON NULL, `puntaje_total` DECIMAL(5, 2) NULL, `porcentaje` DECIMAL(5, 2) NULL, `estado` ENUM(
        'en_progreso',
        'completado',
        'abandonado',
        'expirado'
    ) NULL DEFAULT 'en_progreso', `revisado_por` INT NULL, `fecha_revision` DATETIME NULL, `comentario_revisor` TEXT NULL, `ip_address` VARCHAR(45) NULL, `user_agent` TEXT NULL, `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(), `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `examenes_realizados` ADD INDEX `examenes_realizados_tema_id_matricula_id_index`(`tema_id`, `matricula_id`);
ALTER TABLE
    `examenes_realizados` ADD UNIQUE `examenes_realizados_tema_id_matricula_id_intento_numero_unique`(
        `tema_id`,
        `matricula_id`,
        `intento_numero`
    );
ALTER TABLE
    `examenes_realizados` ADD INDEX `examenes_realizados_fecha_inicio_index`(`fecha_inicio`);
ALTER TABLE
    `examenes_realizados` ADD INDEX `examenes_realizados_estado_index`(`estado`);
CREATE TABLE `accesos`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `mat_id` BIGINT NOT NULL,
    `modulo_materia_id` INT NOT NULL,
    `orden` INT NOT NULL,
    `estado` ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
    `created_at` TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP NOT NULL
);
CREATE TABLE `modulos`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `curso_id` BIGINT NOT NULL,
    `codigo_modulo` VARCHAR(255) NOT NULL,
    `fecha_inicio` DATE NOT NULL,
    `fecha_fin` DATE NOT NULL,
    `nombre` VARCHAR(255) NOT NULL,
    `descripcion` VARCHAR(255) NOT NULL,
    `orden` INT NOT NULL,
    `estado` ENUM('activo', 'inactivo', 'completado') NOT NULL DEFAULT 'activo'
);
CREATE TABLE `modulos_materias`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `mod_id` BIGINT NOT NULL,
    `mat_id` BIGINT NOT NULL,
    `prof_id` BIGINT NOT NULL,
    `orden` INT NOT NULL,
    `estado` ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
    `created_at` TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP NOT NULL
);
ALTER TABLE
    `users` ADD CONSTRAINT `users_persona_id_foreign` FOREIGN KEY(`persona_id`) REFERENCES `personas`(`id`);
ALTER TABLE
    `modulos_materias` ADD CONSTRAINT `modulos_materias_mod_id_foreign` FOREIGN KEY(`mod_id`) REFERENCES `modulos`(`id`);
ALTER TABLE
    `matriculas` ADD CONSTRAINT `matriculas_curso_id_foreign` FOREIGN KEY(`curso_id`) REFERENCES `cursos`(`id`);
ALTER TABLE
    `accesos` ADD CONSTRAINT `accesos_modulo_materia_id_foreign` FOREIGN KEY(`modulo_materia_id`) REFERENCES `modulos_materias`(`id`);
ALTER TABLE
    `matriculas` ADD CONSTRAINT `matriculas_estudiante_id_foreign` FOREIGN KEY(`estudiante_id`) REFERENCES `users`(`id`);
ALTER TABLE
    `modulos_materias` ADD CONSTRAINT `modulos_materias_prof_id_foreign` FOREIGN KEY(`prof_id`) REFERENCES `users`(`id`);
ALTER TABLE
    `examenes_realizados` ADD CONSTRAINT `examenes_realizados_tema_id_foreign` FOREIGN KEY(`tema_id`) REFERENCES `temas`(`id`);
ALTER TABLE
    `personas` ADD CONSTRAINT `personas_tutor_id_foreign` FOREIGN KEY(`tutor_id`) REFERENCES `personas`(`id`);
ALTER TABLE
    `users` ADD CONSTRAINT `users_rol_id_foreign` FOREIGN KEY(`rol_id`) REFERENCES `roles`(`id`);
ALTER TABLE
    `examenes_realizados` ADD CONSTRAINT `examenes_realizados_matricula_id_foreign` FOREIGN KEY(`matricula_id`) REFERENCES `matriculas`(`id`);
ALTER TABLE
    `temas` ADD CONSTRAINT `temas_modulo_materia_id_foreign` FOREIGN KEY(`modulo_materia_id`) REFERENCES `modulos_materias`(`id`);
ALTER TABLE
    `modulos_materias` ADD CONSTRAINT `modulos_materias_mat_id_foreign` FOREIGN KEY(`mat_id`) REFERENCES `materias`(`id`);
ALTER TABLE
    `modulos` ADD CONSTRAINT `modulos_curso_id_foreign` FOREIGN KEY(`curso_id`) REFERENCES `cursos`(`id`);
ALTER TABLE
    `accesos` ADD CONSTRAINT `accesos_mat_id_foreign` FOREIGN KEY(`mat_id`) REFERENCES `matriculas`(`id`);