-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 26. Jan 2020 um 20:56
-- Server-Version: 10.4.8-MariaDB
-- PHP-Version: 7.3.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `asta_velo`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `email` varchar(256) NOT NULL,
  `password` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `appointments`
--

CREATE TABLE `appointments` (
  `id` int(11) NOT NULL,
  `date_time` datetime NOT NULL,
  `confirmed` tinyint(4) DEFAULT NULL,
  `type` varchar(256) NOT NULL,
  `reservation_id` int(11) DEFAULT NULL,
  `loan_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `bikes`
--

CREATE TABLE `bikes` (
  `id` int(11) NOT NULL,
  `size` varchar(256) NOT NULL,
  `image_url` varchar(256) DEFAULT NULL,
  `number_of_gears` int(11) NOT NULL,
  `type_of_breaks` varchar(256) NOT NULL,
  `available` tinyint(4) NOT NULL,
  `number_of_loans` int(11) NOT NULL,
  `type` varchar(256) NOT NULL,
  `inventory_number` varchar(256) DEFAULT NULL,
  `information` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `comment` text NOT NULL,
  `bike_id` int(11) NOT NULL,
  `email` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `informations`
--

CREATE TABLE `informations` (
  `id` int(11) NOT NULL,
  `price_weekly` int(11) NOT NULL,
  `price_monthly` int(11) NOT NULL,
  `opening_hours` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `informations`
--

INSERT INTO `informations` (`id`, `price_weekly`, `price_monthly`, `opening_hours`) VALUES
(1, 7, 15, '00:00-00:00###16:00-18:00###00:00-00:00###16:00-18:00###00:00-00:00###00:00-00:00###00:00-00:00');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `loans`
--

CREATE TABLE `loans` (
  `id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `loan_duration` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `status` varchar(256) DEFAULT 'pending',
  `email` varchar(256) NOT NULL,
  `bike_ids` text NOT NULL,
  `first_name` varchar(256) NOT NULL,
  `last_name` varchar(256) NOT NULL,
  `phone_number` varchar(256) NOT NULL,
  `deposit` int(11) NOT NULL,
  `number_of_bikes` int(11) NOT NULL,
  `birthday` text DEFAULT NULL,
  `street` text DEFAULT NULL,
  `location` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `newsletter_mails`
--

CREATE TABLE `newsletter_mails` (
  `id` int(11) NOT NULL,
  `email` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `reservations`
--

CREATE TABLE `reservations` (
  `id` int(11) NOT NULL,
  `date_from` date NOT NULL,
  `date_to` date NOT NULL,
  `bike_ids` text NOT NULL,
  `confirmed` tinyint(4) DEFAULT NULL,
  `email` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `bikes`
--
ALTER TABLE `bikes`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `informations`
--
ALTER TABLE `informations`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `loans`
--
ALTER TABLE `loans`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `newsletter_mails`
--
ALTER TABLE `newsletter_mails`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `bikes`
--
ALTER TABLE `bikes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `informations`
--
ALTER TABLE `informations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT für Tabelle `loans`
--
ALTER TABLE `loans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `newsletter_mails`
--
ALTER TABLE `newsletter_mails`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
