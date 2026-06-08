-- Script para importar en phpMyAdmin (BlueHost)

-- 1. Tabla de Usuarios
CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(50) NOT NULL,
  `role` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `role_desc` varchar(100) DEFAULT NULL,
  `img` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabla de Deportes
CREATE TABLE IF NOT EXISTS `sports` (
  `id` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `icon` varchar(50) DEFAULT 'fa-running',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabla de Vínculos (Entrenador - Atleta)
CREATE TABLE IF NOT EXISTS `connections` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `coach_id` varchar(50) NOT NULL,
  `athlete_id` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `coach_id` (`coach_id`),
  KEY `athlete_id` (`athlete_id`),
  CONSTRAINT `fk_coach` FOREIGN KEY (`coach_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_athlete` FOREIGN KEY (`athlete_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tabla de Actividades
CREATE TABLE IF NOT EXISTS `activities` (
  `id` varchar(50) NOT NULL,
  `athlete_id` varchar(50) NOT NULL,
  `coach_id` varchar(50) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'pending',
  `sport_id` varchar(50) NOT NULL,
  `title` varchar(150) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `bloques` int(11) DEFAULT NULL,
  `vueltas` int(11) DEFAULT NULL,
  `dist` int(11) DEFAULT NULL,
  `pace` varchar(20) DEFAULT NULL,
  `zone` varchar(20) DEFAULT NULL,
  `place` varchar(100) DEFAULT NULL,
  `distance` decimal(10,2) DEFAULT NULL,
  `time` varchar(20) DEFAULT NULL,
  `rpe` int(11) DEFAULT NULL,
  `date_assigned` datetime DEFAULT NULL,
  `date_completed` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `act_athlete` (`athlete_id`),
  KEY `act_coach` (`coach_id`),
  KEY `act_sport` (`sport_id`),
  CONSTRAINT `fk_act_athlete` FOREIGN KEY (`athlete_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_act_coach` FOREIGN KEY (`coach_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_act_sport` FOREIGN KEY (`sport_id`) REFERENCES `sports` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- INSERTAR DATOS INICIALES MOCK
INSERT INTO `users` (`id`, `role`, `email`, `name`, `role_desc`, `img`) VALUES
('admin1', 'admin', 'vegendigital@gmail.com', 'Super Admin', 'Administrador Global', 'https://i.pravatar.cc/150?u=admin'),
('coach1', 'coach', 'coach1@test.com', 'Profe Sebastián', 'Head Coach', 'https://i.pravatar.cc/150?u=coach'),
('coach2', 'coach', 'coach2@test.com', 'Prof. Carlos', 'Coach Poli 10', 'https://i.pravatar.cc/150?u=coach2'),
('athlete1', 'athlete', 'atleta@test.com', 'Martín Pérez', 'Deportista Elite', 'https://i.pravatar.cc/150?u=athlete'),
('athlete2', 'athlete', 'atleta2@test.com', 'Julia V.', 'Deportista Amateur', 'https://i.pravatar.cc/150?u=athlete2');

INSERT INTO `sports` (`id`, `name`, `icon`) VALUES
('running', 'Running', 'fa-running'),
('padel', 'Padel', 'fa-table-tennis'),
('tennis', 'Tenis', 'fa-baseball-ball'),
('cycling', 'Ciclismo', 'fa-biking'),
('rowing', 'Remo', 'fa-water');

INSERT INTO `connections` (`coach_id`, `athlete_id`) VALUES
('coach1', 'athlete1'),
('coach1', 'athlete2'),
('coach2', 'athlete1');
