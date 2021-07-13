DROP DATABASE IF EXISTS ts_playground_user;
CREATE DATABASE ts_playground_user;
ALTER DATABASE ts_playground_user CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
USE ts_playground_user;


DROP ROLE IF EXISTS 'user_db_query';
CREATE ROLE 'user_db_query';
GRANT SELECT, INSERT, UPDATE, DELETE, EXECUTE ON ts_playground_user.* TO 'user_db_query';


DROP USER IF EXISTS 'user_db'@'%';
CREATE USER 'user_db'@'%' IDENTIFIED BY 'password';
GRANT 'user_db_query' TO 'user_db'@'%';
FLUSH PRIVILEGES;


SET DEFAULT ROLE ALL TO
  'user_db'@'%';
