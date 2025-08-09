// -- Store Rating System Database Schema

CREATE DATABASE IF NOT EXISTS store_rating_system;
USE store_rating_system;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address TEXT(400),
    role ENUM('admin', 'user', 'store_owner') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_name (name)
);

-- Stores table
CREATE TABLE stores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    address TEXT(400),
    owner_id INT,
    avg_rating DECIMAL(3,2) DEFAULT 0.00,
    total_ratings INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_name (name),
    INDEX idx_email (email),
    INDEX idx_owner (owner_id),
    INDEX idx_rating (avg_rating)
);

-- Ratings table
CREATE TABLE ratings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    store_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_store_rating (user_id, store_id),
    INDEX idx_user (user_id),
    INDEX idx_store (store_id),
    INDEX idx_rating (rating)
);

-- Triggers to update average rating
DELIMITER //

CREATE TRIGGER update_store_rating_after_insert
AFTER INSERT ON ratings
FOR EACH ROW
BEGIN
    UPDATE stores 
    SET avg_rating = (
        SELECT AVG(rating) 
        FROM ratings 
        WHERE store_id = NEW.store_id
    ),
    total_ratings = (
        SELECT COUNT(*) 
        FROM ratings 
        WHERE store_id = NEW.store_id
    )
    WHERE id = NEW.store_id;
END //

CREATE TRIGGER update_store_rating_after_update
AFTER UPDATE ON ratings
FOR EACH ROW
BEGIN
    UPDATE stores 
    SET avg_rating = (
        SELECT AVG(rating) 
        FROM ratings 
        WHERE store_id = NEW.store_id
    ),
    total_ratings = (
        SELECT COUNT(*) 
        FROM ratings 
        WHERE store_id = NEW.store_id
    )
    WHERE id = NEW.store_id;
END //

CREATE TRIGGER update_store_rating_after_delete
AFTER DELETE ON ratings
FOR EACH ROW
BEGIN
    UPDATE stores 
    SET avg_rating = COALESCE((
        SELECT AVG(rating) 
        FROM ratings 
        WHERE store_id = OLD.store_id
    ), 0.00),
    total_ratings = COALESCE((
        SELECT COUNT(*) 
        FROM ratings 
        WHERE store_id = OLD.store_id
    ), 0)
    WHERE id = OLD.store_id;
END //

DELIMITER ;

-- Insert default admin user (password: Admin123!)
INSERT INTO users (name, email, password, address, role) VALUES 
('System Administrator', 'admin@example.com', '$2b$10$YourHashedPasswordHere', '123 Admin Street', 'admin');