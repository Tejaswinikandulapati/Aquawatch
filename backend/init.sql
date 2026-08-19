CREATE DATABASE IF NOT EXISTS aquawatch;
USE aquawatch;

CREATE TABLE IF NOT EXISTS ponds (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(150),
    species VARCHAR(100),
    area_sqm FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sensor_readings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pond_id INT NOT NULL,
    temperature FLOAT,
    ph FLOAT,
    dissolved_oxygen FLOAT,
    ammonia FLOAT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pond_id) REFERENCES ponds(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS feeding_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pond_id INT NOT NULL,
    feed_type VARCHAR(100),
    quantity_kg FLOAT,
    fed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes VARCHAR(255),
    FOREIGN KEY (pond_id) REFERENCES ponds(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pond_id INT NOT NULL,
    alert_type VARCHAR(100),
    message VARCHAR(255),
    severity VARCHAR(20) DEFAULT 'medium',
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pond_id) REFERENCES ponds(id) ON DELETE CASCADE
);

-- Seed data so the dashboard isn't empty on first run
INSERT INTO ponds (name, location, species, area_sqm) VALUES
('Pond A1', 'Eluru Farm North', 'Vannamei Shrimp', 2500),
('Pond B2', 'Eluru Farm South', 'Rohu Fish', 1800),
('Pond C3', 'Eluru Farm East', 'Vannamei Shrimp', 3000);

INSERT INTO sensor_readings (pond_id, temperature, ph, dissolved_oxygen, ammonia) VALUES
(1, 28.5, 7.8, 5.2, 0.3),
(2, 27.1, 7.2, 4.8, 0.5),
(3, 29.0, 8.1, 6.0, 0.2);

INSERT INTO feeding_logs (pond_id, feed_type, quantity_kg, notes) VALUES
(1, 'Pellet Feed', 12.5, 'Morning feeding'),
(2, 'Floating Feed', 8.0, 'Evening feeding'),
(3, 'Pellet Feed', 15.0, 'Morning feeding');

INSERT INTO alerts (pond_id, alert_type, message, severity, is_resolved) VALUES
(2, 'pH Alert', 'pH level below optimal range', 'high', FALSE),
(1, 'Oxygen Alert', 'Dissolved oxygen nearing threshold', 'medium', FALSE);
