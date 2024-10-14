DROP DATABASE printer_archive;
CREATE DATABASE printer_archive;
USE printer_archive;
CREATE TABLE users (id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
					username VARCHAR(255),
                    user_password VARCHAR(255),
                    email VARCHAR(255),
                    is_admin BOOLEAN
                    );

CREATE TABLE projects (id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
					   user_id INT,
					   project_name VARCHAR(255),
					   project_description VARCHAR(255),
					   license BOOLEAN,
					   likes INT,
					   FOREIGN KEY (user_id) REFERENCES users (id)
                       );
                    
CREATE TABLE files (id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
					project_id INT,
					file_path VARCHAR(255),
                    color VARCHAR(255),
                    size DOUBLE,
                    physical_weight DOUBLE,
                    file_weight DOUBLE,
                    material VARCHAR(255),
                    FOREIGN KEY (project_id) REFERENCES projects(id)
                    );

CREATE TABLE tags (id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
				  name_tag VARCHAR(255)
                  );
                  
CREATE TABLE project_tag (id_project INT,
						   id_tag INT,
						   FOREIGN KEY (id_project) REFERENCES projects(id),
						   FOREIGN KEY (id_tag) REFERENCES tags(id)
						   );
CREATE TABLE project_comment (id_project INT,
							  id_user INT,
                              pr_comment VARCHAR(255),
							  FOREIGN KEY (id_project) REFERENCES projects(id),
						      FOREIGN KEY (id_user) REFERENCES users(id)
                              );