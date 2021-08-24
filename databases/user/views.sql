
CREATE VIEW `email_password` AS
SELECT `email`, `hash` FROM `user`
INNER JOIN `password` USING (`id`)
WITH CHECK OPTION;

CREATE VIEW `password_attempt` AS
SELECT `email`, `attempt` FROM `user`
INNER JOIN `password` USING (`id`)
WITH CHECK OPTION;
