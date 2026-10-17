

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


CREATE DATABASE IF NOT EXISTS `konyvtar` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `konyvtar`;



CREATE TABLE `kolcsonzesek` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `konyvId` int(11) DEFAULT NULL,
  `olvasoId` int(11) DEFAULT NULL,
  `datum` varchar(512) DEFAULT NULL,
  `visszahozva` varchar(512) DEFAULT NULL,
  `visszahozasDatum` DATE DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_konyvek` (`konyvId`),
  KEY `fk_olvasok` (`olvasoId`),
  CONSTRAINT `fk_konyvek` FOREIGN KEY (`konyvId`)
    REFERENCES `konyvek` (`id`),
  CONSTRAINT `fk_olvasok` FOREIGN KEY (`olvasoId`)
    REFERENCES `olvasok` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



INSERT INTO `kolcsonzesek` (`id`, `konyvId`, `olvasoId`, `datum`, `visszahozva`) VALUES
(1, 2, 1, '2026-09-01', 'true'),
(2, 3, 1, '2026-09-15', 'false'),
(3, 5, 2, '2026-09-20', 'false');





CREATE TABLE `konyvek` (
  `id` int(11) NOT NULL,
  `cim` varchar(512) DEFAULT NULL,
  `szerzo_id` int(11) NOT NULL,
  `ev` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



INSERT INTO `konyvek` (`id`, `cim`, `szerzo_id`, `ev`) VALUES
(1, 'A Pál utcai fiúk', 1, 1906),
(2, 'Egri csillagok', 2, 1899),
(3, 'Tüskevár', 3, 1957),
(4, 'Vuk', 3, 1965),
(5, 'Abigél', 4, 1970),
(6, 'A kőszívű ember fiai', 5, 1869);



CREATE TABLE `olvasok` (
  `id` int(11) NOT NULL,
  `nev` varchar(512) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



INSERT INTO `olvasok` (`id`, `nev`) VALUES
(1, 'Kiss Anna'),
(2, 'Nagy Péter'),
(3, 'Szabó Lili');


CREATE TABLE `szerzok` (
  `id` int(11) NOT NULL,
  `szerzo` varchar(512) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `szerzok` (`id`, `szerzo`) VALUES
(1, 'Molnár Ferenc'),
(2, 'Gárdonyi Géza'),
(3, 'Fekete István'),
(4, 'Szabó Magda'),
(5, 'Jókai Mór');


ALTER TABLE `kolcsonzesek`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_konyvek` (`konyvId`),
  ADD KEY `fk_olvasok` (`olvasoId`);


ALTER TABLE `konyvek`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_szerzok` (`szerzo_id`);


ALTER TABLE `olvasok`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `szerzok`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `kolcsonzesek`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;


ALTER TABLE `konyvek`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;


ALTER TABLE `olvasok`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;


ALTER TABLE `szerzok`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;


ALTER TABLE `kolcsonzesek`
  ADD CONSTRAINT `fk_konyvek` FOREIGN KEY (`konyvId`) REFERENCES `konyvek` (`id`),
  ADD CONSTRAINT `fk_olvasok` FOREIGN KEY (`olvasoId`) REFERENCES `olvasok` (`id`);


ALTER TABLE `konyvek`
  ADD CONSTRAINT `fk_szerzok` FOREIGN KEY (`szerzo_id`) REFERENCES `szerzok` (`id`);
COMMIT;

