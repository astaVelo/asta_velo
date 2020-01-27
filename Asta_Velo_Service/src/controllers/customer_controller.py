from flask_restplus import Resource
from src.server.instance import server
from src.models.comment_model import comment
from src.models.bike_model import bike
from src.models.date_model import date
from src.services.database_service import init_db

app, api = server.app, server.api
service_conf = api.namespace('service', description='Service operations')


@service_conf.route('/api/v1/availableBikes/<int:bike_id>')
class AvailableBikes(Resource):
    @api.marshal_list_with(bike)
    def get(self, bike_id):
        """
        Returns all available bikes
        :param bike_id: 1337 for all bikes, and specific id for one bike
        :return: Available bikes
        """
        try:
            connection = init_db()

            if bike_id == 1337:
                sql_statement = '''SELECT * FROM bikes WHERE available = 1 ORDER BY id DESC'''  # Get all available bikes
                cursor = connection.cursor()
                cursor.execute(sql_statement)
                bike_list = cursor.fetchall()
            else:
                sql_statement = '''SELECT * FROM bikes WHERE available = 1 and id = %s '''  # Get a specific available bike
                cursor = connection.cursor()
                cursor.execute(sql_statement, bike_id)
                bike_list = cursor.fetchall()

            if bike_list is ():
                response_object = {
                    'status': 'fail'
                }
                return response_object, 404
            else:
                return bike_list, 200
        except KeyError as e:
            service_conf.abort(500, e.__doc__, status="Could not retrieve information", statusCode="500")
        except Exception as e:
            service_conf.abort(400, e.__doc__, status="Could not retrieve information", statusCode="400")
        finally:
            cursor.close()
            connection.close()


@service_conf.route('/api/v1/comments/<int:bike_id>')
class AvailableComments(Resource):
    @api.marshal_list_with(comment)
    def get(self, bike_id):
        """
        Returns all available comments for a bike
        :param bike_id: specific id for one bike
        :return: Available bikes
        """
        try:
            connection = init_db()

            sql_statement = '''SELECT * FROM comments WHERE bike_id = %s ORDER BY id DESC'''  # Get all bikes
            cursor = connection.cursor()
            cursor.execute(sql_statement, bike_id)
            comment_list = cursor.fetchall()

            if comment_list is ():
                response_object = {
                    'status': 'fail'
                }
                return response_object, 404
            else:
                return comment_list, 200
        except KeyError as e:
            service_conf.abort(500, e.__doc__, status="Could not retrieve information", statusCode="500")
        except Exception as e:
            service_conf.abort(400, e.__doc__, status="Could not retrieve information", statusCode="400")
        finally:
            cursor.close()
            connection.close()


@service_conf.route('/api/v1/notAvailableBikes/<int:bike_id>')
class NotAvailableBikes(Resource):
    @api.marshal_list_with(date)
    def get(self, bike_id):
        """
        Returns all dates when a bike is reserved or on loan
        :param bike_id: specific id for one bike
        :return:
        """
        try:
            connection = init_db()

            sql_statement = '''SELECT * FROM bikes WHERE id = %s '''  # Get a specific bike
            cursor = connection.cursor()
            cursor.execute(sql_statement, bike_id)
            bike_list = cursor.fetchone()
            sql_statement_loan = '''SELECT start_date, end_date FROM loans WHERE Date(start_date) >= CURRENT_DATE() AND Locate(%s, bike_ids) > 0 '''
            cursor.execute(sql_statement_loan, str(bike_list['id']))
            loan_dates = cursor.fetchall()
            print(loan_dates)
            sql_statement_reservation = '''SELECT date_from, date_to FROM reservations WHERE Date(date_from) >= CURRENT_DATE() AND Locate(%s, bike_ids) > 0 '''
            cursor.execute(sql_statement_reservation, str(bike_list['id']))
            reservation_dates = cursor.fetchall()
            dates = []
            for i in range(0, len(loan_dates)):
                date = {"start_date": loan_dates[i]["start_date"],
                        "end_date": loan_dates[i]["end_date"]}
                dates.append(date)
            for i in range(0, len(reservation_dates)):
                date = {"start_date": reservation_dates[i]["date_from"],
                        "end_date": reservation_dates[i]["date_to"]}
                dates.append(date)

            return dates, 200
        except KeyError as e:
            service_conf.abort(500, e.__doc__, status="Could not retrieve information", statusCode="500")
        except Exception as e:
            service_conf.abort(400, e.__doc__, status="Could not retrieve information", statusCode="400")
        finally:
            cursor.close()
            connection.close()
