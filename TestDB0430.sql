CREATE DATABASE TestDB0430;

USE TestDB0430;

CREATE TABLE `admin` (
  `id` varchar(45) NOT NULL,
  `pw` varchar(45) NOT NULL,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
);

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` VALUES ('admin01','admin01','admin01');

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `feedback_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `contents` varchar(128) NOT NULL,
  PRIMARY KEY (`feedback_id`),
  KEY `user_id_idx` (`user_id`),
  CONSTRAINT `user_id2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` VALUES (1,1,'피드백 내용!! ~~~~~~~'),(2,1,'또 다른 피드백 내용222'),(3,1,'추가 피드백 내용3333333'),(4,2,'피드백 11111');

--
-- Table structure for table `text`
--

CREATE TABLE `text` (
  `text_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `category` varchar(8) NOT NULL,
  `title` varchar(32) NOT NULL,
  `contents` longtext NOT NULL,
  PRIMARY KEY (`text_id`),
  KEY `user_id_idx` (`user_id`),
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

--
-- Dumping data for table `text`
--

INSERT INTO `text` VALUES (1,1,'과학','과학 지문 01','과학 지문 내용~~~~~~~~'),(2,2,'철학','철학 지문 01','철학 지문 내용~~~~~~~~');

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(48) NOT NULL,
  `name` varchar(8) NOT NULL,
  `phone` varchar(12) NOT NULL,
  `d_day` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`)
);

--
-- Dumping data for table `user`
--

INSERT INTO `user` VALUES (1,'aaa@email.com','testuser','01011111111','2024-04-30 00:00:00'),(2,'bbb@email.com','test02','01022222222','2024-05-15 00:00:00'),(3,'ccc@email.com','test01','01033333333','2024-11-11 00:00:00');

-- Dump completed on 2024-04-30  4:05:27
