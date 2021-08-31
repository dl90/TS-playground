
CREATE VIEW `email_password` AS
SELECT `email`, `hash`, `bad_attempt`, `locked_until` FROM `user`
INNER JOIN `password` USING (`id`)
WITH CHECK OPTION;

CREATE VIEW `password_attempt` AS
SELECT `email`, `bad_attempt` FROM `user`
INNER JOIN `password` USING (`id`)
WITH CHECK OPTION;
