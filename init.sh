#!/bin/bash
#mysql
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql.service
# create random password
PASSWDDB="123"
MAINDB="forum"
# replace "-" with "_" for database username
USER="alari001"
#create database
# CREATE USER ${USER}@localhost IDENTIFIED BY '${PASSWDDB}';
sudo mysql <<MYSQL_SCRIPT

CREATE DATABASE IF NOT EXISTS  ${MAINDB} /*\!40100 DEFAULT CHARACTER SET utf8 */;
GRANT ALL PRIVILEGES ON ${MAINDB}.* TO '${USER}'@'localhost';
FLUSH PRIVILEGES;
USE ${MAINDB};
source master.sql;
MYSQL_SCRIPT