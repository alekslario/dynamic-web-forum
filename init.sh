#!/bin/bash
#mysql
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql.service
# create random password
PASSWDDB="123"
MAINDB="myBookshop"
# replace "-" with "_" for database username
USER="alari001"
#create database
sudo mysql <<MYSQL_SCRIPT
CREATE USER ${USER}@localhost IDENTIFIED BY '${PASSWDDB}';
CREATE DATABASE IF NOT EXISTS  ${MAINDB} /*\!40100 DEFAULT CHARACTER SET utf8 */;
GRANT ALL PRIVILEGES ON ${MAINDB}.* TO '${USER}'@'localhost';
FLUSH PRIVILEGES;
MYSQL_SCRIPT