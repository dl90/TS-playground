DROP DATABASE IF EXISTS user;
CREATE DATABASE user;
ALTER DATABASE user CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
USE user;


DROP ROLE IF EXISTS 'user_db_query';
CREATE ROLE 'user_db_query';
GRANT SELECT, INSERT, UPDATE, DELETE, EXECUTE ON user.* TO 'user_db_query';


DROP USER IF EXISTS 'user_db'@'%';
CREATE USER 'user_db'@'%' IDENTIFIED BY 'CHANGE_ME!';
GRANT 'user_db_query' TO 'user_db'@'%';
FLUSH PRIVILEGES;


SET DEFAULT ROLE ALL TO
  'user_db'@'%';
