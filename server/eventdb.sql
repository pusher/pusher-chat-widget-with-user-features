/* pusher-event-chat/server/eventdb.sql */
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
FLUSH PRIVILEGES;

CREATE DATABASE IF NOT EXISTS `eventdb` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `eventdb`;

CREATE TABLE IF NOT EXISTS `accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `ticket` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `fullname` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

INSERT INTO `accounts` (`id`, `username`, `ticket`, `email`, `fullname`) VALUES (1, 'admin', 'c7ad44cbad762a5da0a452f9e854fdc1e0e7a52a38015f23f3eab1d80b931dd472634dfac71cd34ebc35d16ab7fb8a90c81f975113d6c7538dc69dd8de9077ec', 'admin@demo.com', 'admin'); /* admin */
INSERT INTO `accounts` (`id`, `username`, `ticket`, `email`, `fullname`) VALUES (2, 'john', 'b7fcc6e612145267d2ffea04be754a34128c1ed8133a09bfbbabd6afe6327688aa71d47343dd36e719f35f30fa79aec540e91b81c214fddfe0bedd53370df46d', 'john@demo.com', 'John Smith'); /* john */
INSERT INTO `accounts` (`id`, `username`, `ticket`, `email`, `fullname`) VALUES (3, 'mike', 'a91d24d7eab7683bc73b857d42dfc48a9577c600ccb5e7d7adabab54eebc112232f3de2539208f22a560ad320d1f2cda5a5f1a127baf6bf871b0e282c2b85220', 'mike@demo.com', 'Mike Wilson'); /* mike */
