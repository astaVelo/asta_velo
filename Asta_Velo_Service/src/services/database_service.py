import pymysql
import os


def init_db():
    db_connection = pymysql.connect(host=os.environ.get('MYSQL_HOST', 'localhost'),
                                         user=os.environ.get('MYSQL_USER', 'root'),
                                         password=os.environ.get('MYSQL_PW', ''),
                                         database=os.environ.get('MYSQL_DB', 'asta_velo'),
                                         charset='utf8mb4',
                                         cursorclass=pymysql.cursors.DictCursor)

    return db_connection
