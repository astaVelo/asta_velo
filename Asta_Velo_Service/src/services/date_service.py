from datetime import datetime


def convert_date_to_mysql_date(date):
    """
    Converts date format "dd.mm.YYYY.hh:mm" to a proper mysql date format
    :param datetime:
    :return: proper mysql date format
    """
    mysql_date = date.split('.')
    mysql_time = mysql_date[3].split(':')
    start = datetime(int(mysql_date[2]), int(mysql_date[1]), int(mysql_date[0]), int(mysql_time[0]), int(mysql_time[1]))
    return start.strftime('%Y-%m-%d %H-%M-%S')
