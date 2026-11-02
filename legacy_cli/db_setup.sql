CREATE DATABASE IF NOT EXISTS hotel;

USE hotel;

CREATE TABLE IF NOT EXISTS guest (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    source VARCHAR(255),
    room_no INT,
    date DATE,
    type_of_room VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS staff (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    dept VARCHAR(255),
    sal INT,
    hiredate DATE
);
