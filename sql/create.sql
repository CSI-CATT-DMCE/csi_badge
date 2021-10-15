DROP DATABASE IF EXISTS hacktober;
CREATE DATABASE hacktober;
USE hacktober;

CREATE TABLE u_users
(
  u_id INT AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  gr_no VARCHAR(255) NOT NULL UNIQUE,
  year INT NOT NULL DEFAULT 3,
  avatar VARCHAR(255) NOT NULL DEFAULT 'nature.png',
  PRIMARY KEY (u_id)
);

CREATE TABLE e_events
(
  e_id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  date DATE NOT NULL DEFAULT '2021-01-01',
  badges VARCHAR(255) DEFAULT 'nature.png',
  description VARCHAR(1000),
  short_description VARCHAR(100),
  PRIMARY KEY (e_id)
);

CREATE TABLE c_certificates
(
  u_id INT NOT NULL AUTO_INCREMENT,
  e_id INT NOT NULL,
  FOREIGN KEY (u_id) REFERENCES u_users(u_id),
  FOREIGN KEY (e_id) REFERENCES e_events(e_id),
  PRIMARY KEY(u_id,e_id)
);


CREATE TABLE a_admins
(
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  PRIMARY KEY (username)
);

-- INSERT into a_admins VALUES
-- ('admin@gmail.com', 'admin', 'admin'),
-- ('root@gmail.com', 'root', 'root')
-- ;

-- select * from a_admins;
