-- Portfolio Website Database Schema
-- Create the database
CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

-- Table for contact form submissions
CREATE TABLE contacts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    subject VARCHAR(200),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('new', 'read', 'replied') DEFAULT 'new'
);

-- Table for projects
CREATE TABLE projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(255),
    github_url VARCHAR(255),
    live_demo_url VARCHAR(255),
    technologies JSON, -- Store array of technologies as JSON
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for testimonials
CREATE TABLE testimonials (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_name VARCHAR(100) NOT NULL,
    client_position VARCHAR(150),
    client_company VARCHAR(100),
    testimonial_text TEXT NOT NULL,
    client_image_url VARCHAR(255),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data for projects
INSERT INTO projects (title, description, image_url, github_url, live_demo_url, technologies, featured) VALUES
('Ekonomi Trading', 'Ekonomi Trading is an agricultural company operating in Ghana, offering high-quality fertilizers tailored to Sub-Saharan African farmers. They focus on affordability and sustainability to improve soil health, crop yields, and food security.', 'assets/project-1.jpg', 'https://github.com/heyywillz', '#', '["HTML", "CSS", "JavaScript"]', TRUE),

('Ladder', 'Ladder is an AI-driven personal finance platform designed for Africans to manage their money, invest in Ghana. Treasury Bills, and receive tailored financial advice. It prioritizes security and privacy while offering an easy-to-use interface for financial growth.', 'assets/project-2.jpg', 'https://github.com/heyywillz', '#', '["HTML", "CSS", "JavaScript"]', TRUE),

('Reading Law Chamber', 'RLC Solicitors is a law firm offering a wide range of legal services, including immigration, family, criminal, and employment law. They focus on providing personalized, client-centered legal solutions with a commitment to excellence.', 'assets/project-3.jpg', 'https://github.com/heyywilz', '#', '["HTML", "CSS", "JavaScript"]', FALSE);

-- Insert sample data for testimonials
INSERT INTO testimonials (client_name, client_position, client_company, testimonial_text, rating, featured) VALUES
('Muktar Attah', 'Ex CTO', 'Ladder', 'I have worked with Atabisa for 3+ years and I really enjoy working with him. He is very good at what he does. He designs and builds at an incredible pace.', 5, TRUE),

('Paul Fraikue', 'CEO', 'RetainXcel', 'Atabisa delivered an outstanding web application that exceeded our expectations. His attention to detail and technical expertise made the entire process smooth and efficient.', 5, TRUE),

('Samuel Setsoafia', 'CEO', 'Eggseed', 'Working with Atabisa was a game-changer for our business. He transformed our ideas into a beautiful, functional website that our customers love.', 5, TRUE),

('Alhassan Attah', 'Founder', 'Simal Company', 'Atabisa is a reliable and skilled developer. He consistently delivers high-quality work on time and communicates effectively throughout the project.', 4, TRUE);

-- Create indexes for better performance
CREATE INDEX idx_contacts_created_at ON contacts(created_at);
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_testimonials_featured ON testimonials(featured);
