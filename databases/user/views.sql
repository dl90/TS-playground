
CREATE VIEW `emailPassword` AS
SELECT `email`, `hash` FROM `user`
INNER JOIN `password` USING (`id`)
WITH CHECK OPTION;

CREATE VIEW `passwordAttempt` AS
SELECT `email`, `attempt` FROM `user`
INNER JOIN `password` USING (`id`)
WITH CHECK OPTION;
