import sys
from flask_restplus import Resource
from src.server.instance import server
from src.models.comment_model import comment
from src.models.reservation_model import reservation
from src.services.date_service import convert_date_to_mysql_date
from src.models.loan_appointment_model import loan_appointment
from src.models.newsletter_model import newsletter_mail
from src.services.database_service import init_db
import os


app, api = server.app, server.api
action_conf = api.namespace('actions', description='Action operations')


@action_conf.route('/api/v1/comment')
class Comment(Resource):

    @api.doc(responses={200: 'OK', 400: 'Invalid Payload', 500: 'Server Error'})
    @api.expect(comment, validate=True)
    def post(self):
        """
        Stores a comment on a bike in the database
        :return:
        """
        new_comment = api.payload
        sql_statement = '''INSERT INTO comments (comment, bike_id, email)
                                                VALUES (%s, %s, %s)'''
        try:
            connection = init_db()

            cursor = connection.cursor()
            cursor.execute(sql_statement, (new_comment['comment'], new_comment['bike_id'], new_comment['email']))
            connection.commit()

            response_object = {
                'status': 'success',
                'message': 'Successfully inserted.'
            }
            return response_object, 200
        except Exception as e:
            print(e)
            exc_type, exc_obj, exc_tb = sys.exc_info()
            fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
            print(exc_type, fname, exc_tb.tb_lineno)
            response_object = {
                'status': 'fail'
            }
            connection.rollback()
            action_conf.abort(400, e.__doc__, status="Could not save information", statusCode="400")

            return response_object, 400
        finally:
            cursor.close()
            connection.close()


@action_conf.route('/api/v1/sendAppointmentRequest')
class SendAppointmentRequest(Resource):
    @api.doc(responses={200: 'OK', 400: 'Invalid Payload', 500: 'Server Error'})
    @api.expect(loan_appointment, validate=True)
    def post(self):
        """
        Stores and sends an appointment-request (Date-Format: dd.mm.YYYY.hh:mm)
        :return:
        """
        new_payload = api.payload
        sql_statement_appointment = '''INSERT INTO appointments (date_time, type, reservation_id, loan_id)
                                        VALUES (%s, %s, %s, %s)'''

        sql_statement_loan = '''INSERT INTO loans (start_date, end_date, loan_duration, price, email, bike_ids, first_name, last_name, phone_number, deposit, number_of_bikes, birthday, street, location)
                                                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)'''

        sql_statement_get_last_loan = '''SELECT * FROM loans ORDER BY id DESC'''

        try:
            connection = init_db()

            date_time = convert_date_to_mysql_date(new_payload['date_time'])
            start_date = convert_date_to_mysql_date(new_payload['start_date'])
            end_date = convert_date_to_mysql_date(new_payload['end_date'])

            cursor = connection.cursor()
            cursor.execute(sql_statement_loan, (start_date, end_date, new_payload['loan_duration'], new_payload['price'], new_payload['email'], new_payload['bike_ids'], new_payload['first_name'], new_payload['last_name'], new_payload['phone_number'], new_payload['deposit'], new_payload['number_of_bikes'], new_payload['birthday'], new_payload['street'], new_payload['location']))
            connection.commit()


            cursor.execute(sql_statement_get_last_loan)
            last_loan = cursor.fetchone()
            if last_loan is ():
                response_object = {
                    'status': 'fail'
                }
                return response_object, 404
            loan_id = last_loan['id']

            cursor.execute(sql_statement_appointment, (date_time, new_payload['type'], new_payload['reservation_id'], loan_id))
            connection.commit()

            response_object = {
                'status': 'success',
                'message': 'Successfully inserted.'
            }
            return response_object, 200
        except Exception as e:
            response_object = {
                'status': 'fail'
            }
            connection.rollback()

            action_conf.abort(400, e.__doc__, status="Could not save information", statusCode="400")

            return response_object, 400
        finally:
            cursor.close()
            connection.close()


@action_conf.route('/api/v1/sendReservationRequest')
class SendReservationRequest(Resource):
    @api.doc(responses={200: 'OK', 400: 'Invalid Payload', 500: 'Server Error'})
    @api.expect(reservation, validate=True)
    def post(self):
        """
        Stores and sends an reservation-request (Date-Format: dd.mm.YYYY.hh:mm)
        :return:
        """
        new_reservation = api.payload
        sql_statement = '''INSERT INTO reservations (date_from, date_to, bike_ids, email)
                                        VALUES (%s, %s, %s, %s)'''

        try:
            connection = init_db()

            start_date = convert_date_to_mysql_date(new_reservation['date_from'])
            end_date = convert_date_to_mysql_date(new_reservation['date_to'])
            cursor = connection.cursor()
            cursor.execute(sql_statement, (start_date, end_date, new_reservation['bike_ids'], new_reservation['email']))
            connection.commit()

            response_object = {
                'status': 'success',
                'message': 'Successfully inserted.'
            }
            return response_object, 200
        except Exception as e:
            response_object = {
                'status': 'fail'
            }
            connection.rollback()

            action_conf.abort(400, e.__doc__, status="Could not save information", statusCode="400")

            return response_object, 400
        finally:
            cursor.close()
            connection.close()


@action_conf.route('/api/v1/sendNewsletterRequest')
class SendNewsletterRequest(Resource):
    @api.doc(responses={200: 'OK', 400: 'Invalid Payload', 500: 'Server Error'})
    @api.expect(newsletter_mail, validate=True)
    def post(self):
        """
        Stores email for newsletter
        :return:
        """
        new_email = api.payload
        sql_statement = '''INSERT INTO newsletter_mails (email)
                                        VALUES (%s)'''

        try:
            connection = init_db()

            cursor = connection.cursor()
            cursor.execute(sql_statement, (new_email['email']))
            connection.commit()

            response_object = {
                'status': 'success',
                'message': 'Successfully inserted.'
            }
            return response_object, 200
        except Exception as e:
            response_object = {
                'status': 'fail'
            }
            connection.rollback()

            action_conf.abort(400, e.__doc__, status="Could not save information", statusCode="400")

            return response_object, 400
        finally:
            cursor.close()
            connection.close()
