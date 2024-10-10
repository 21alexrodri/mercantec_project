CREATE DATABASE printer_archive;
USE printer_archive;
CREATE TABLE users (id INT primary KEY,
					name VARCHAR(255),
                    password VARCHAR(255),
                    is_admin BOOLEAN);
                    
CREATE TABLE projects  (id INT PRIMARY KEY,
						user_id INT,
                        name VARCHAR(255),
                        category VARCHAR(255),
                        description VARCHAR(255),
                        license BOOLEAN,
                        likes INT,
                        FOREIGN KEY (user_id) REFERENCES users (id));
                    
CREATE TABLE files (id INT PRIMARY KEY,
					project_id INT,
					file_path VARCHAR(255),
                    color VARCHAR(255),
                    size DOUBLE,
                    physical_weight DOUBLE,
                    file_weight DOUBLE,
                    material VARCHAR(255),
                    FOREIGN KEY (project_id) REFERENCES projects(id));