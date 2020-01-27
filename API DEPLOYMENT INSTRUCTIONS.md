# API Deployment Guide
#### Abtract

In this instruction we will guide you through the steps of deploying the API provided by us.

## Introduction
The API is the server where all the logic of the application is handled. To be more accurate, it is the place where the communication and the data flow between the user/admin and the database is controlled. 
The API is written in python using the flask restplus module.
Furthermore we are using a mysql database.

For deployment you have to options, namely:
1.	 Deployment on a cloud hoster like https://scalingo.com/ 
2.	Deployment on your own server

### Deployment of MySQL database
To proper deploy the database you have to choose a domain/database hoster. We recommend you to use strato ([https://www.strato.de/](https://www.strato.de/)). 
Here you can choose the PowerWeb Basic packet. With that you can manage databases. Here you need to establish a new database. After that you will be rooted to the phpmyadmin userinterface where you can add a new database. Afterwards you can import an existing database. Choose the **_asta_velo.sql_** file. After that you have imported the asta velo database and you can use it.

### 1. Deployment of the API on a cloud hosting service
This is perhaps the most simple method. There are several different cloud hosting service in the web, where you can deploy the API. We would recommend you to use scalingo where you also can follow the instruction on their website https://scalingo.com/ . But the counterpart of this method is, that is is not for free.

### 2. Deployment of the API on your own server
This method demands more effort.
1. First of all make sure your server is accesible from the outside.
2. Install python 3.7 on your server (https://www.python.org/downloads/).
3. Install all the needed modules to run the API on your server. 
Use the command **_python -m pip install module-name_** or **_pip install module-name_**.
4. You need to set the following environment variables:
			- *MYSQL_HOST* -> the host address of the database (e.g. localhost)
			- *MYSQL_USER* -> the user which has access to the database (e.g. root)
			- *MYSQL_PW* -> the password to access the database with the user above
			- *MYSQL_DB* -> the name of the database (e.g. asta_velo)
			- *MAIL_SENDER* -> your central email address (e.g. asta_velo_test@web.de)
			- *MAIL_PASSWORD* -> the password of your email address (e.g. 42astavelo42)
			- *MAIL_HOST* -> the smtp host address (e.g. smtp.web.de)
			- *MAIL_PORT* -> the open port of your smtp host (e.g. 587)
			- *PYTHON_ENV* = **production** (important!!)
			- *PORT* -> the port for your API (e.g. 5000)
5. Afterwards you can run the API using the command **_python app.py_**
6. The API should now be reachable. Test it by following this url:
		**_http://your-server-name.de/v1/api/swagger_**
7. Now you have to be able to see the swagger documentation of the API	![Asta Velo Swagger Documentation](https://i.ibb.co/SvdpPnz/astaveloswagger.jpg)

