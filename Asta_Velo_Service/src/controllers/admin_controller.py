import sys
from flask_restplus import Resource
from src.server.instance import server
from src.models.loan_model import loan
from src.models.login_model import login
from src.models.bike_model import bike
from src.models.appointment_model import appointment
from src.models.reservation_model import reservation
from src.models.informations_model import information
from src.models.newsletter_model import newsletter_mail
from src.models.contract_model import contract
from src.models.newLogin_model import new_login
import hashlib
from src.services.date_service import convert_date_to_mysql_date
from src.services.database_service import init_db
from src.services.mail_service import create_mailserver
import os

app, api = server.app, server.api
admin_conf = api.namespace('admin', description='Admin operations')

email_text_confirmed = '''Schön, dass du dich für eines unserer Fahrräder interessierst. Komm am zu deinem gewählten Datum und Uhrzeit in der Fahrrad-Selbsthilfewerkstatt (C 6 4) vorbei, damit du das Fahrrad ausprobieren und mitnehmen kannst. Bring den Betrag für Ausleihe und Kaution bitte passend mit.

Freundliche Grüße,
Nicole (velo@asta.uni-saarland.de, Tel.: +49 681 - 302 2900)'''

email_text_rejection = '''Leider ist zu dem gewählten Zeitpunkt kein Fahrrad ausleihbar. Vielleicht möchtest du zu einem späteren Zeitpunkt ein Fahrrad ausleihen? Dann melde dich einfach noch einmal. Wir bemühen uns ständig darum, mehr Fahrräder zu beschaffen und freuen uns sehr über Dein Interesse!

Freundliche Grüße,
Nicole (velo@asta.uni-saarland.de, Tel.: +49 681 - 302 2900)'''


def encrypt_password(password):
    """
    returns md5-encrypted password
    :param password:
    :return:
    """
    hash_value = hashlib.md5(password.encode()).hexdigest()
    return hash_value


def verify_password(hash_value, clean_value):
    """
    verifies hash_value with string
    :param hash_value:
    :param clean_value:
    :return:
    """
    if hashlib.md5(clean_value.encode()).hexdigest() == hash_value:
        return True
    return False


@admin_conf.route('/api/v1/loans/<int:loan_id>/<string:status>')
class Loans_1(Resource):
    @api.doc(params={'loan_id': 'Specify the Id associated with the loan',
                     'status': 'Specify the status of the loans'})
    @api.marshal_list_with(loan)
    def get(self, loan_id, status):
        """
        Returns a list of loans
        :param status: If status = "NONE", independent from status, otherwise pending, running, closed loans
        :param loan_id: if loan_id == 1001337 returns all loans, o.w. returns specific loan
        :return:
        """
        try:
            connection = init_db()

            if status == 'NONE':
                if loan_id == 1001337:
                    sql_statement = '''SELECT * FROM loans ORDER BY id DESC'''  # Get all loans
                    cursor = connection.cursor()
                    cursor.execute(sql_statement)
                    loan_list = cursor.fetchall()
                else:
                    sql_statement = '''SELECT * FROM loans WHERE id = %s '''  # Get a specific loan
                    cursor = connection.cursor()
                    cursor.execute(sql_statement, loan_id)
                    loan_list = cursor.fetchall()
            else:
                if loan_id == 1001337:
                    sql_statement = '''SELECT * FROM loans WHERE status = %s ORDER BY id DESC'''  # Get all loans with specific status
                    cursor = connection.cursor()
                    cursor.execute(sql_statement, status)
                    loan_list = cursor.fetchall()
                else:
                    sql_statement = '''SELECT * FROM loans WHERE id = %s and status = %s '''  # Get a specific loan with specific status
                    cursor = connection.cursor()
                    cursor.execute(sql_statement, (loan_id, status))
                    loan_list = cursor.fetchall()


            if loan_list is ():
                response_object = {
                    'status': 'fail'
                }
                return response_object, 404
            else:
                return loan_list
        except KeyError as e:
            admin_conf.abort(500, e.__doc__, status="Could not retrieve information", statusCode="500")
        except Exception as e:
            admin_conf.abort(400, e.__doc__, status="Could not retrieve information", statusCode="400")
        finally:
            cursor.close()
            connection.close()

@admin_conf.route('/api/v1/loans/<int:loan_id>')
class Loans_2(Resource):
    @api.doc(responses={200: 'OK', 400: 'Invalid Payload', 500: 'Mapping Key Error'},
             params={'loan_id': 'Specify the Id associated with the loan'})
    @api.expect(loan, validate=True)
    def put(self, loan_id):
        """
        Updates a loan form (Date-Format: dd.mm.YYYY.hh:mm)
        :param loan_id: specific loan ID
        :return:
        """
        new_loan = api.payload
        sql_command = '''UPDATE loans
                            SET start_date = %s,
                            end_date = %s,
                            loan_duration = %s,
                            price = %s,
                            status = %s,
                            email = %s,
                            bike_ids = %s,
                            first_name = %s,
                            last_name = %s,
                            phone_number = %s,
                            deposit = %s,
                            number_of_bikes = %s,
                            birthday = %s,
                            street = %s,
                            location = %s
                            WHERE id = %s '''
        try:
            connection = init_db()
            start_date = convert_date_to_mysql_date(new_loan['start_date'])
            end_date = convert_date_to_mysql_date(new_loan['end_date'])
            cursor = connection.cursor()
            cursor.execute(sql_command, (
            start_date, end_date, new_loan['loan_duration'], new_loan['price'], new_loan['status'], new_loan['email'],
            new_loan['bike_ids'], new_loan['first_name'], new_loan['last_name'], new_loan['phone_number'],
            new_loan['deposit'], new_loan['number_of_bikes'], new_loan['birthday'], new_loan['street'],
            new_loan['location'], loan_id))
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
            admin_conf.abort(400, e.__doc__, status="Could not save information", statusCode="400")

            return response_object, 400
        finally:
            cursor.close()
            connection.close()

    @api.doc(responses={200: 'OK', 400: 'Invalid Argument', 500: 'Mapping Key Error'},
             params={'loan_id': 'Specify the Id associated with the loan'})
    def delete(self, loan_id):
        """
        Deletes a loan form the database
        :param loan_id: specific loan ID
        :return:
        """
        try:
            connection = init_db()
            sql_statement = '''DELETE FROM loans WHERE id = %s'''
            cursor = connection.cursor()
            cursor.execute(sql_statement, loan_id)
            connection.commit()
            response_object = {
                'status': 'success',
                'message': 'Successfully deleted.'
            }
            return response_object, 200
        except KeyError as e:
            admin_conf.abort(500, e.__doc__, status="Could not retrieve information", statusCode="500")
        except Exception as e:
            admin_conf.abort(400, e.__doc__, status="Could not retrieve information", statusCode="400")
        finally:
            cursor.close()
            connection.close()


@admin_conf.route('/api/v1/requestedLoans/<int:loan_id>')
class RequestedLoans(Resource):
    @api.doc(params={'loan_id': 'Specify the Id associated with the loan'})
    @api.marshal_list_with(loan)
    def get(self, loan_id):
        """
        Returns pending loans
        :param loan_id: specific loan ID; 1001337 for all requested ones and a specific id for one specific loan.
        :return:
        """

        try:
            connection = init_db()
            if loan_id == 1001337:
                sql_statement = '''SELECT * FROM loans WHERE status = 'pending' ORDER BY id DESC'''  # Get all pending loans
                cursor = connection.cursor()
                cursor.execute(sql_statement)
                loan_list = cursor.fetchall()
            else:
                sql_statement = '''SELECT * FROM loans WHERE status = 'pending' and id = %s'''  # Get one specific pending loans
                cursor = connection.cursor()
                cursor.execute(sql_statement, loan_id)
                loan_list = cursor.fetchall()


            if loan_list is ():
                response_object = {
                    'status': 'fail'
                }
                return response_object, 404
            else:
                return loan_list
        except KeyError as e:
            admin_conf.abort(500, e.__doc__, status="Could not retrieve information", statusCode="500")
        except Exception as e:
            admin_conf.abort(400, e.__doc__, status="Could not retrieve information", statusCode="400")
        finally:
            cursor.close()
            connection.close()

    @api.doc(responses={200: 'OK', 400: 'Invalid Payload', 500: 'Mapping Key Error'},
             params={'loan_id': 'Specify the Id associated with the loan'})
    @api.expect(loan, validate=True)
    def put(self, loan_id):
        """
        Change status of a loan from pending, running, closed (if running -> changes available of bikes to 0; if closed -> changes availability of bikes to 1)
        :param loan_id: specific loan ID
        :return: either a contract pdf or a reject pdf by mail
        """
        new_loan = api.payload
        sql_command = '''UPDATE loans
                                SET status = %s
                                WHERE id = %s '''

        try:
            connection = init_db()
            cursor = connection.cursor()

            cursor.execute(sql_command, (new_loan['status'], loan_id))
            connection.commit()

            bike_ids = new_loan['bike_ids'].split('###')
            sql_command_running = '''UPDATE bikes
                                SET available = 0
                                WHERE id = %s'''
            sql_command_closed = '''UPDATE bikes
                                            SET available = 1
                                            WHERE id = %s'''
            for bike_id in bike_ids:
                if new_loan['status'] == 'running':
                    cursor.execute(sql_command_running, bike_id)
                elif new_loan['status'] == 'closed':
                    cursor.execute(sql_command_closed, bike_id)
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
            admin_conf.abort(400, e.__doc__, status="Could not save information", statusCode="400")

            return response_object, 400
        finally:
            cursor.close()
            connection.close()


@admin_conf.route('/api/v1/bikes/<int:bike_id>')
class Bikes(Resource):
    @api.doc(params={'bike_id': 'Specify the Id associated with the bike'})
    @api.marshal_list_with(bike)
    def get(self, bike_id):
        """
        Returns a list of bikes
        :param bike_id: if bike_id == 100337 then returns all bikes, o.w. returns a specific bike
        :return:
        """
        try:
            connection = init_db()
            cursor = connection.cursor()

            if bike_id == 1001337:
                sql_statement = '''SELECT * FROM bikes ORDER BY id DESC'''  # Get all bikes

                cursor.execute(sql_statement)
                bike_list = cursor.fetchall()
            else:
                sql_statement = '''SELECT * FROM bikes WHERE id = %s '''  # Get a specific bike
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
            admin_conf.abort(500, e.__doc__, status="Could not retrieve information", statusCode="500")
        except Exception as e:
            admin_conf.abort(400, e.__doc__, status="Could not retrieve information", statusCode="400")
        finally:
            cursor.close()
            connection.close()

    @api.doc(responses={200: 'OK', 400: 'Invalid Payload', 500: 'Mapping Key Error'},
             params={'bike_id': 'Specify the Id associated with the bike'})
    @api.expect(bike, validate=True)
    def put(self, bike_id):
        """
        Updates a bike entry in the database
        :param bike_id: specific bike ID
        :return:
        """
        new_bike = api.payload
        sql_command = '''UPDATE bikes
                                    SET size = %s,
                                        image_url = %s,
                                        number_of_gears = %s,
                                        type_of_breaks = %s,
                                        available = %s,
                                        number_of_loans = %s,
                                        type = %s,
                                        inventory_number = %s,
                                        information = %s
                                    WHERE id = %s '''
        try:
            connection = init_db()

            cursor = connection.cursor()
            cursor.execute(sql_command, (new_bike['size'], new_bike['image_url'], new_bike['number_of_gears'],
            new_bike['type_of_breaks'], new_bike['available'], new_bike['number_of_loans'], new_bike['type'], new_bike['inventory_number'], new_bike['information'], bike_id))
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
            admin_conf.abort(400, e.__doc__, status="Could not save information", statusCode="400")

            return response_object, 400
        finally:
            cursor.close()
            connection.close()

    @api.doc(responses={200: 'OK', 400: 'Invalid Argument', 500: 'Mapping Key Error'},
             params={'bike_id': 'Specify the Id associated with the bike'})
    def delete(self, bike_id):
        """
        Deletes a specific bike from the database
        :param bike_id: specific bike ID
        :return:
        """
        try:
            connection = init_db()
            sql_statement = '''DELETE FROM bikes WHERE id = %s'''
            cursor = connection.cursor()
            cursor.execute(sql_statement, bike_id)
            connection.commit()
            response_object = {
                'status': 'success',
                'message': 'Successfully deleted.'
            }
            return response_object, 200
        except KeyError as e:
            admin_conf.abort(500, e.__doc__, status="Could not retrieve information", statusCode="500")
        except Exception as e:
            admin_conf.abort(400, e.__doc__, status="Could not retrieve information", statusCode="400")
        finally:
            cursor.close()
            connection.close()


@admin_conf.route('/api/v1/newBikes')
class NewBikes(Resource):
    @api.doc(responses={200: 'OK', 400: 'Invalid Payload', 500: 'Mapping Key Error'})
    @api.expect(bike, validate=True)
    def post(self):
        """
        Inserts a new bike to the database
        :return:
        """
        try:
            connection = init_db()

            new_bike = api.payload
            sql_statement = '''INSERT INTO bikes (size, image_url, number_of_gears, type_of_breaks, available, number_of_loans, type, inventory_number, information)
                                                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)'''
            cursor = connection.cursor()
            cursor.execute(sql_statement, (new_bike['size'], new_bike['image_url'], new_bike['number_of_gears'],
                new_bike['type_of_breaks'], new_bike['available'], new_bike['number_of_loans'], new_bike['type'], new_bike['inventory_number'], new_bike['information']))
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

            admin_conf.abort(400, e.__doc__, status="Could not save information", statusCode="400")

            return response_object, 400
        finally:
            cursor.close()
            connection.close()


@admin_conf.route('/api/v1/login')
class Login(Resource):

    @api.expect(login, validate=True)
    @api.doc(responses={200: 'OK', 400: 'Invalid Payload', 500: 'Server Error'})
    def post(self):
        """
        Login for admin
        :return:
        """
        login_load = api.payload
        sql_command = '''SELECT * FROM admins WHERE email = %s and password = %s'''
        try:
            connection = init_db()

            cursor = connection.cursor()
            cursor.execute(sql_command, (login_load['email'], encrypt_password(login_load['password'])))
            admin_login = cursor.fetchone()
            if admin_login is None:
                response_object = {
                    'status': 'fail'
                }
                return response_object, 404
            response_object = {
                'status': 'Success'
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
            admin_conf.abort(400, e.__doc__, status="Could not login as an admin", statusCode="400")

            return response_object, 400
        finally:
            cursor.close()
            connection.close()


@admin_conf.route('/api/v1/registerAdmin')
class RegisterAdmin(Resource):

    @api.expect(login, validate=True)
    @api.doc(responses={200: 'OK', 400: 'Invalid Payload', 500: 'Server Error'})
    def post(self):
        """
        Registration for admin
        :return:
        """
        login_load = api.payload
        sql_command = '''INSERT INTO admins (email, password)
                                        VALUES (%s, %s)'''
        try:
            connection = init_db()

            cursor = connection.cursor()
            cursor.execute(sql_command, (login_load['email'], encrypt_password(login_load['password'])))
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
            admin_conf.abort(400, e.__doc__, status="Could not login as an admin", statusCode="400")

            return response_object, 400
        finally:
            cursor.close()
            connection.close()

    @api.doc(responses={200: 'OK', 400: 'Invalid Payload', 500: 'Mapping Key Error'})
    @api.expect(new_login, validate=True)
    def put(self):
        """
        changes password and email of an admin; to not change a property insert the same value again
        :return:
        """
        new_login = api.payload
        sql_command = '''UPDATE admins
                            SET password = %s,
                            email = %s
                            WHERE email = %s AND password = %s '''
        try:
            connection = init_db()

            cursor = connection.cursor()
            cursor.execute(sql_command, (encrypt_password(new_login['newPassword']), new_login['newEmail'], new_login['oldEmail'], encrypt_password(new_login['oldPassword'])))
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
            admin_conf.abort(400, e.__doc__, status="Could not save information", statusCode="400")

            return response_object, 400
        finally:
            cursor.close()
            connection.close()


@admin_conf.route('/api/v1/requestedAppointments/<int:appointment_id>')
class RequestedAppointments(Resource):
    @api.doc(params={'appointment_id': 'Specify the Id associated with the appointment'})
    @api.marshal_list_with(appointment)
    def get(self, appointment_id):
        """
        Returns requested appointments
        :param appointment_id: appointment ID; 1001337 for all requested ones and a specific id for one specific appointment
        :return:
        """
        try:
            connection = init_db()

            if appointment_id == 1001337:
                sql_statement = '''SELECT * FROM appointments where confirmed is NULL ORDER BY id DESC'''  # Get all requested loans
                cursor = connection.cursor()
                cursor.execute(sql_statement)
                appointment_list = cursor.fetchall()
            else:
                sql_statement = '''SELECT * FROM appointments where confirmed is NULL and id = %s'''  # Get specific requested loans
                cursor = connection.cursor()
                cursor.execute(sql_statement, appointment_id)
                appointment_list = cursor.fetchall()

            if appointment_list is ():
                response_object = {
                    'status': 'fail'
                }
                return response_object, 404
            else:
                return appointment_list
        except KeyError as e:
            admin_conf.abort(500, e.__doc__, status="Could not retrieve information", statusCode="500")
        except Exception as e:
            admin_conf.abort(400, e.__doc__, status="Could not retrieve information", statusCode="400")
        finally:
            cursor.close()
            connection.close()

    @api.doc(responses={200: 'OK', 400: 'Invalid Payload', 500: 'Mapping Key Error'},
             params={'appointment_id': 'Specify the Id associated with the appointment'})
    @api.expect(appointment, validate=True)
    def put(self, appointment_id):
        """
        Confirms an appointment or reject it by setting confirmed either to 1 or 0
        :param appointment_id: specific appointment ID
        :return:
        """
        new_appointment = api.payload
        sql_command = '''UPDATE appointments
                                SET confirmed = %s
                                WHERE id = %s '''
        try:
            connection = init_db()

            cursor = connection.cursor()
            cursor.execute(sql_command, (new_appointment['confirmed'], appointment_id))
            connection.commit()

            mail_server = create_mailserver()
            sql_command_loan = '''SELECT * FROM loans WHERE id = %s '''
            cursor.execute(sql_command_loan, new_appointment['loan_id'])
            new_loan = cursor.fetchone()
            if new_appointment['confirmed'] == 1:
                mail_server.send_mail(new_loan['email'], 'ASTA VELO Rückmeldung - Ausleihe', email_text_confirmed)
            else:
                mail_server.send_mail(new_loan['email'], 'ASTA VELO Rückmeldung - Ausleihe', email_text_rejection)

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
            admin_conf.abort(400, e.__doc__, status="Could not save information", statusCode="400")

            return response_object, 400
        finally:
            cursor.close()
            connection.close()
            mail_server.destruct()


@admin_conf.route('/api/v1/appointments/<int:appointment_id>/<string:confirmed>')
class Appointments_1(Resource):
    @api.doc(params={'appointment_id': 'Specify the Id associated with the appointment',
                     'confirmed': 'specify the confirmation status (1001337 if rejected and confirmed ones)'})
    @api.marshal_list_with(appointment)
    def get(self, appointment_id, confirmed):
        """
        Returns all appointments
        :param confirmed: confirmation status (1, 0 or 1001337)
        :param appointment_id: appointment ID; 1001337 for all and a specific id for one specific appointment
        :return:
        """
        try:
            connection = init_db()

            if confirmed == '1001337':
                if appointment_id == 1001337:
                    sql_statement = '''SELECT * FROM appointments WHERE confirmed is NULL ORDER BY id DESC'''  # Get all requested  appointments
                    cursor = connection.cursor()
                    cursor.execute(sql_statement)
                    appointment_list = cursor.fetchall()
                else:
                    sql_statement = '''SELECT * FROM appointments WHERE id = %s confirmed is NULL '''  # Get specific requested  appointments
                    cursor = connection.cursor()
                    cursor.execute(sql_statement, appointment_id)
                    appointment_list = cursor.fetchall()
            else:
                if appointment_id == 1001337:
                    sql_statement = '''SELECT * FROM appointments WHERE confirmed = %s ORDER BY id DESC'''  # Get all requested appointments with specific confirmationstatus
                    cursor = connection.cursor()
                    cursor.execute(sql_statement, confirmed)
                    appointment_list = cursor.fetchall()
                else:
                    sql_statement = '''SELECT * FROM appointments WHERE id = %s AND confirmed = %s'''  # Get specific requested  appointments with specific confirmationstatus
                    cursor = connection.cursor()
                    cursor.execute(sql_statement, (appointment_id, confirmed))
                    appointment_list = cursor.fetchall()

            if appointment_list is ():
                response_object = {
                    'status': 'fail'
                }
                return response_object, 404
            else:
                return appointment_list
        except KeyError as e:
            admin_conf.abort(500, e.__doc__, status="Could not retrieve information", statusCode="500")
        except Exception as e:
            admin_conf.abort(400, e.__doc__, status="Could not retrieve information", statusCode="400")
        finally:
            cursor.close()
            connection.close()


@admin_conf.route('/api/v1/appointments/<int:appointment_id>')
class Appointments_2(Resource):
    @api.doc(responses={200: 'OK', 400: 'Invalid Argument', 500: 'Mapping Key Error'},
             params={'appointment_id': 'specify the Id associated with the appointment'})
    def delete(self, appointment_id):
        """
        Deletes a specific appointment from the database
        :param appointment_id: specific appoinment_id
        :return:
        """
        try:
            connection = init_db()

            sql_statement = '''DELETE FROM appointments WHERE id = %s'''
            cursor = connection.cursor()
            cursor.execute(sql_statement, appointment_id)
            connection.commit()
            response_object = {
                'status': 'success',
                'message': 'Successfully deleted.'
            }
            return response_object, 200
        except KeyError as e:
            admin_conf.abort(500, e.__doc__, status="Could not retrieve information", statusCode="500")
        except Exception as e:
            admin_conf.abort(400, e.__doc__, status="Could not retrieve information", statusCode="400")
        finally:
            cursor.close()
            connection.close()

    @api.doc(responses={200: 'OK', 400: 'Invalid Payload', 500: 'Mapping Key Error'},
             params={'appointment_id': 'Specify the Id associated with the appointment'})
    @api.expect(appointment, validate=True)
    def put(self, appointment_id):
        """
        (Date-Format: dd.mm.YYYY.hh:mm)
        Updates an appointment
        :param appointment_id: specific appointment ID
        :return:
        """
        new_appointment = api.payload
        sql_command = '''UPDATE appointments
                            SET date_time = %s,
                                confirmed = %s,
                                type = %s,
                                reservation_id = %s,
                                loan_id = %s
                            WHERE id = %s '''
        try:
            connection = init_db()

            cursor = connection.cursor()
            cursor.execute(sql_command, (
            new_appointment['date_time'], new_appointment['confirmed'], new_appointment['type'],
            new_appointment['reservation_id'], new_appointment['loan_id'], appointment_id))
            connection.commit()

            response_object = {
                'status': 'success',
                'message': 'Successfully deleted.'
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
            admin_conf.abort(400, e.__doc__, status="Could not save information", statusCode="400")

            return response_object, 400
        finally:
            cursor.close()
            connection.close()


@admin_conf.route('/api/v1/reservations/<int:reservation_id>')
class Reservations(Resource):
    @api.doc(params={'reservation_id': 'Specify the Id associated with the reservation'})
    @api.marshal_list_with(reservation)
    def get(self, reservation_id):
        """
        Returns a list of reservation
        :param reservation_id: if reservation_id == 1001337 returns all reservations, o.w. returns specific reservations
        :return:
        """
        try:
            connection = init_db()

            if reservation_id == 1001337:
                sql_statement = '''SELECT * FROM reservations ORDER BY id DESC'''  # Get all loans
                cursor = connection.cursor()
                cursor.execute(sql_statement)
                loan_list = cursor.fetchall()
            else:
                sql_statement = '''SELECT * FROM reservations WHERE id = %s '''  # Get a specific loan
                cursor = connection.cursor()
                cursor.execute(sql_statement, reservation_id)
                loan_list = cursor.fetchall()

            if loan_list is ():
                response_object = {
                    'status': 'fail'
                }
                return response_object, 404
            else:
                return loan_list
        except KeyError as e:
            admin_conf.abort(500, e.__doc__, status="Could not retrieve information", statusCode="500")
        except Exception as e:
            admin_conf.abort(400, e.__doc__, status="Could not retrieve information", statusCode="400")
        finally:
            cursor.close()
            connection.close()

    @api.doc(responses={200: 'OK', 400: 'Invalid Payload', 500: 'Mapping Key Error'},
             params={'reservation_id': 'Specify the Id associated with the reservation'})
    @api.expect(reservation, validate=True)
    def put(self, reservation_id):
        """
        Updates a reservation form (Date-Format: dd.mm.YYYY.hh:mm)
        :param reservation_id: specific reservation ID
        :return:
        """
        new_reservation = api.payload
        sql_command = '''UPDATE reservations
                            SET date_from = %s,
                            date_to = %s,
                            bike_ids = %s,
                            confirmed = %s,
                            email = %s
                            WHERE id = %s '''
        try:
            connection = init_db()

            start_date = convert_date_to_mysql_date(new_reservation['date_from'])
            end_date = convert_date_to_mysql_date(new_reservation['date_to'])
            cursor = connection.cursor()
            cursor.execute(sql_command, (start_date, end_date, new_reservation['bike_ids'], new_reservation['confirmed'], new_reservation['email'], reservation_id))
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
            admin_conf.abort(400, e.__doc__, status="Could not save information", statusCode="400")

            return response_object, 400
        finally:
            cursor.close()
            connection.close()

    @api.doc(responses={200: 'OK', 400: 'Invalid Argument', 500: 'Mapping Key Error'},
             params={'reservation_id': 'Specify the Id associated with the reservation'})
    def delete(self, reservation_id):
        """
        Deletes a reservation form the database
        :param reservation_id: specific reservation ID
        :return:
        """
        try:
            connection = init_db()

            sql_statement = '''DELETE FROM reservations WHERE id = %s'''
            cursor = connection.cursor()
            cursor.execute(sql_statement, reservation_id)
            connection.commit()
            response_object = {
                'status': 'success',
                'message': 'Successfully deleted.'
            }
            return response_object, 200
        except KeyError as e:
            admin_conf.abort(500, e.__doc__, status="Could not retrieve information", statusCode="500")
        except Exception as e:
            admin_conf.abort(400, e.__doc__, status="Could not retrieve information", statusCode="400")
        finally:
            cursor.close()
            connection.close()


@admin_conf.route('/api/v1/requestedReservations/<int:reservation_id>')
class RequestedReservations(Resource):
    @api.doc(params={'reservation_id': 'Specify the Id associated with the reservation'})
    @api.marshal_list_with(reservation)
    def get(self, reservation_id):
        """
        Returns requested reservations
        :param reservation_id: appointment ID; 1001337 for all requested ones and a specific id for one specific reservation
        :return:
        """
        try:
            connection = init_db()

            if reservation_id == 1001337:
                sql_statement = '''SELECT * FROM reservations where confirmed is NULL ORDER BY id DESC'''  # Get all requested loans
                cursor = connection.cursor()
                cursor.execute(sql_statement)
                reservation_list = cursor.fetchall()
            else:
                sql_statement = '''SELECT * FROM reservations where confirmed is NULL and id = %s'''  # Get specific requested loans
                cursor = connection.cursor()
                cursor.execute(sql_statement, reservation_id)
                reservation_list = cursor.fetchall()

            if reservation_list is ():
                response_object = {
                    'status': 'fail'
                }
                return response_object, 404
            else:
                return reservation_list
        except KeyError as e:
            admin_conf.abort(500, e.__doc__, status="Could not retrieve information", statusCode="500")
        except Exception as e:
            admin_conf.abort(400, e.__doc__, status="Could not retrieve information", statusCode="400")
        finally:
            cursor.close()
            connection.close()

    @api.doc(responses={200: 'OK', 400: 'Invalid Payload', 500: 'Mapping Key Error'},
             params={'reservation_id': 'Specify the Id associated with the reservation'})
    @api.expect(reservation, validate=True)
    def put(self, reservation_id):
        """
        Confirms an reservation or reject it by setting confirmed either to 1 or 0
        :param reservation_id: specific appointment ID
        :return:
        """
        new_reservation = api.payload
        sql_command = '''UPDATE reservations
                                SET confirmed = %s
                                WHERE id = %s '''
        try:
            connection = init_db()

            cursor = connection.cursor()
            cursor.execute(sql_command, (new_reservation['confirmed'], reservation_id))
            connection.commit()

            mail_server = create_mailserver()
            if new_reservation['confirmed'] == 1:
                mail_server.send_mail(new_reservation['email'], 'ASTA VELO Rückmeldung - Reservierung',
                                      email_text_confirmed)
            else:
                mail_server.send_mail(new_reservation['email'], 'ASTA VELO Rückmeldung - Reservierung',
                                      email_text_rejection)
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
            admin_conf.abort(400, e.__doc__, status="Could not save information", statusCode="400")

            return response_object, 400
        finally:
            cursor.close()
            connection.close()
            mail_server.destruct()


@admin_conf.route('/api/v1/timeAppointments/<int:year>/<int:month>/<int:day>')
class TimeAppointments(Resource):
    @api.doc(params={'year': 'Specify the year',
                     'month': 'Specify the month',
                     'day': 'Specifiy the day'})
    @api.marshal_list_with(appointment)
    def get(self, year, month, day):
        """
        Returns all appointments corresponding to the date
        :param year:
        :param month:
        :param day: if day = 1001337 -> ALL appointments of the month
        :return:
        """
        try:
            connection = init_db()

            if day != 1001337:
                sql_statement = '''SELECT * FROM appointments WHERE Date(date_time) = '%s-%s-%s'  '''  # Get all appointments within a day
                cursor = connection.cursor()
                cursor.execute(sql_statement, (year, month, day))
                appointment_list = cursor.fetchall()
            else:
                print('hello')
                sql_statement = '''SELECT * FROM appointments WHERE Date(date_time) >= '%s-%s-01' AND Date(date_time) <= '%s-%s-31'  '''  # Get appointments within a month
                cursor = connection.cursor()
                cursor.execute(sql_statement, (year, month, year, month))
                appointment_list = cursor.fetchall()

            if appointment_list is ():
                response_object = {
                    'status': 'fail'
                }
                return response_object, 404
            else:
                return appointment_list
        except KeyError as e:
            admin_conf.abort(500, e.__doc__, status="Could not retrieve information", statusCode="500")
        except Exception as e:
            admin_conf.abort(400, e.__doc__, status="Could not retrieve information", statusCode="400")
        finally:
            cursor.close()
            connection.close()


@admin_conf.route('/api/v1/timeLoans/<int:year>/<int:month>')
class TimeLoans(Resource):
    @api.doc(params={'year': 'Specify the year',
                     'month': 'Specify the month'})
    @api.marshal_list_with(loan)
    def get(self, year, month):
        """
        Returns all loans within a month of a given year and month
        :param year:
        :param month:
        :return:
        """
        try:
            connection = init_db()

            sql_statement = '''SELECT * FROM loans WHERE Date(start_date) >= '%s-%s-01' AND Date(start_date) <= '%s-%s-31' '''  # Get all requested loans
            cursor = connection.cursor()
            cursor.execute(sql_statement, (year, month, year, month))
            loan_list = cursor.fetchall()
            if loan_list is ():
                response_object = {
                    'status': 'fail'
                }
                return response_object, 404
            else:
                return loan_list
        except KeyError as e:
            admin_conf.abort(500, e.__doc__, status="Could not retrieve information", statusCode="500")
        except Exception as e:
            admin_conf.abort(400, e.__doc__, status="Could not retrieve information", statusCode="400")
        finally:
            cursor.close()
            connection.close()


@admin_conf.route('/api/v1/timeReservations/<int:year>/<int:month>')
class TimeReservations(Resource):
    @api.doc(params={'year': 'Specify the year',
                     'month': 'Specify the month'})
    @api.marshal_list_with(reservation)
    def get(self, year, month):
        """
        Returns all reservations within a month of a given year and month
        :param year:
        :param month:
        :return:
        """
        try:
            connection = init_db()

            sql_statement = '''SELECT * FROM reservations WHERE Date(date_from) >= '%s-%s-01' AND Date(date_from) <= '%s-%s-31' '''  # Get all requested loans
            cursor = connection.cursor()
            cursor.execute(sql_statement, (year, month, year, month))
            reservation_list = cursor.fetchall()

            if reservation_list is ():
                response_object = {
                    'status': 'fail'
                }
                return response_object, 404
            else:
                return reservation_list
        except KeyError as e:
            admin_conf.abort(500, e.__doc__, status="Could not retrieve information", statusCode="500")
        except Exception as e:
            admin_conf.abort(400, e.__doc__, status="Could not retrieve information", statusCode="400")
        finally:
            cursor.close()
            connection.close()


@admin_conf.route('/api/v1/informations')
class Informations(Resource):
    @api.marshal_with(information)
    def get(self):
        """
        Returns the latest shop informations: weekly_price, monthly_price and opening_hours in the following format: 00:00-00:00###16:00-18:00###00:00-00:00###16:00-18:00###00:00-00:00###00:00-00:00###00:00-00:00
        :return:
        """
        try:
            connection = init_db()
            cursor = connection.cursor()

            sql_statement = '''SELECT * FROM informations ORDER BY id DESC'''  # Get the latest changed shop informations

            cursor.execute(sql_statement)
            information = cursor.fetchone()

            if information is ():
                response_object = {
                    'status': 'fail'
                }
                return response_object, 404
            else:
                return information

        except KeyError as e:
            admin_conf.abort(500, e.__doc__, status="Could not retrieve information", statusCode="500")
        except Exception as e:
            admin_conf.abort(400, e.__doc__, status="Could not retrieve information", statusCode="400")
        finally:
            cursor.close()
            connection.close()

    @api.doc(responses={200: 'OK', 400: 'Invalid Payload', 500: 'Mapping Key Error'})
    @api.expect(information, validate=True)
    def post(self):
        """
        Inserts new shop informations
        :return:
        """
        try:
            connection = init_db()
            new_information = api.payload
            sql_statement = '''INSERT INTO informations (price_weekly, price_monthly, opening_hours)
                                                    VALUES (%s, %s, %s)'''
            cursor = connection.cursor()
            cursor.execute(sql_statement, (
            new_information['price_weekly'], new_information['price_monthly'], new_information['opening_hours']))
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

            admin_conf.abort(400, e.__doc__, status="Could not save information", statusCode="400")

            return response_object, 400
        finally:
            cursor.close()
            connection.close()


@admin_conf.route('/api/v1/newsletterMails')
class NewsletterMails(Resource):
    @api.marshal_list_with(newsletter_mail)
    def get(self):
        """
        Returns all newsletter emails
        :return:
        """
        try:
            connection = init_db()
            cursor = connection.cursor()

            sql_statement = '''SELECT * FROM newsletter_mails'''  # Get the latest changed shop informations

            cursor.execute(sql_statement)
            information = cursor.fetchall()

            if information is ():
                response_object = {
                    'status': 'fail'
                }
                return response_object, 404
            else:
                return information

        except KeyError as e:
            admin_conf.abort(500, e.__doc__, status="Could not retrieve information", statusCode="500")
        except Exception as e:
            admin_conf.abort(400, e.__doc__, status="Could not retrieve information", statusCode="400")
        finally:
            cursor.close()
            connection.close()

    @api.doc(responses={200: 'OK', 400: 'Invalid Payload', 500: 'Mapping Key Error'},
             params={'email_id': 'specify the id associated with the email'})
    @api.expect(newsletter_mail, validate=True)
    def delete(self):
        """
        Deletes all newsletter email (no id required)
        :param email_id:
        :return:
        """
        try:
            connection = init_db()

            sql_statement = '''DELETE FROM newsletter_mails'''
            cursor = connection.cursor()
            cursor.execute(sql_statement)
            connection.commit()

            response_object = {
                'status': 'success',
                'message': 'Successfully deleted.'
            }
            return response_object, 200
        except Exception as e:
            response_object = {
                'status': 'fail'
            }
            connection.rollback()

            admin_conf.abort(400, e.__doc__, status="Could not save information", statusCode="400")

            return response_object, 400
        finally:
            cursor.close()
            connection.close()


@admin_conf.route('/api/v1/contracts/<int:appointment_id>/<int:confirmed>')
class Contracts(Resource):
    @api.marshal_list_with(contract)
    @api.doc(params={'appointment_id': 'Specify the appointment',
                     'confirmed': 'Specify the confirmation status'})
    def get(self, appointment_id, confirmed):
        """
         Returns a list of contract json containing appointment, loan and reservation
        :param confirmed: 1, 0, or 1001337 for not confirmed
        :param appointment_id: if 1001337 -> returns all
        :return:
        """
        try:
            connection = init_db()
            cursor = connection.cursor()

            contract_entities = []
            if appointment_id == 1001337:
                if confirmed == 1001337:
                    sql_statement = '''SELECT * FROM appointments WHERE confirmed is NULL '''
                    cursor.execute(sql_statement)
                else:
                    sql_statement = '''SELECT * FROM appointments WHERE confirmed = %s '''
                    cursor.execute(sql_statement, confirmed)
                appointment_entities = cursor.fetchall()
            else:
                if confirmed == 1001337:
                    sql_statement = '''SELECT * FROM appointments WHERE id = %s AND confirmed is NULL '''
                    cursor.execute(sql_statement, appointment_id)
                else:
                    sql_statement = '''SELECT * FROM appointments WHERE id = %s AND confirmed = %s '''
                    cursor.execute(sql_statement, (appointment_id, confirmed))
                appointment_entities = cursor.fetchall()

            if appointment_entities is ():
                response_object = {
                    'status': 'fail'
                }
                return response_object, 404
            else:
                for appointment_entity in appointment_entities:
                    sql_statement_loan = '''SELECT * FROM loans WHERE id = %s'''
                    cursor.execute(sql_statement_loan, appointment_entity['loan_id'])
                    loan_entity = cursor.fetchone()
                    if loan_entity is None:
                        continue
                    if appointment_entity['reservation_id'] != 0 and not appointment_entity['reservation_id'] is None:
                        sql_statement_reservation = '''SELECT * FROM reservations WHERE id = %s '''
                        cursor.execute(sql_statement_reservation, appointment_entity['reservation_id'])
                        reservation_entity = cursor.fetchone()
                        if reservation_entity is None:
                            continue
                        contract_entity = {'id': appointment_entity['id'],
                                    'date_time': appointment_entity['date_time'],
                                    'confirmed': appointment_entity['confirmed'],
                                    'type': appointment_entity['type'],
                                    'reservation_id': appointment_entity['reservation_id'],
                                    'loan_id': appointment_entity['loan_id'],
                                    'start_date': loan_entity['start_date'],
                                    'end_date': loan_entity['end_date'],
                                    'loan_duration': loan_entity['loan_duration'],
                                    'price': loan_entity['price'],
                                    'status': loan_entity['status'],
                                    'email': loan_entity['email'],
                                    'bike_ids': loan_entity['bike_ids'],
                                    'first_name': loan_entity['first_name'],
                                    'last_name': loan_entity['last_name'],
                                    'phone_number': loan_entity['phone_number'],
                                    'deposit': loan_entity['deposit'],
                                    'number_of_bikes': loan_entity['number_of_bikes'],
                                    'birthday': loan_entity['birthday'],
                                    'street': loan_entity['street'],
                                    'location': loan_entity['location'],
                                    'date_from': reservation_entity['date_from'],
                                    'date_to': reservation_entity['date_to']}
                    else:
                        contract_entity = {'id': appointment_entity['id'],
                                           'date_time': appointment_entity['date_time'],
                                           'confirmed': appointment_entity['confirmed'],
                                           'type': appointment_entity['type'],
                                           'reservation_id': appointment_entity['reservation_id'],
                                           'loan_id': appointment_entity['loan_id'],
                                           'start_date': loan_entity['start_date'],
                                           'end_date': loan_entity['end_date'],
                                           'loan_duration': loan_entity['loan_duration'],
                                           'price': loan_entity['price'],
                                           'status': loan_entity['status'],
                                           'email': loan_entity['email'],
                                           'bike_ids': loan_entity['bike_ids'],
                                           'first_name': loan_entity['first_name'],
                                           'last_name': loan_entity['last_name'],
                                           'phone_number': loan_entity['phone_number'],
                                           'deposit': loan_entity['deposit'],
                                           'number_of_bikes': loan_entity['number_of_bikes'],
                                           'birthday': loan_entity['birthday'],
                                           'street': loan_entity['street'],
                                           'location': loan_entity['location'],
                                           'date_from': None,
                                           'date_to': None}
                    contract_entities.append(contract_entity)
                return contract_entities

        except KeyError as e:
            admin_conf.abort(500, e.__doc__, status="Could not retrieve information", statusCode="500")
        except Exception as e:
            admin_conf.abort(400, e.__doc__, status="Could not retrieve information", statusCode="400")
        finally:
            cursor.close()
            connection.close()


@admin_conf.route('/api/v1/timeContracts/<int:appointment_id>/<int:confirmed>/<int:year>/<int:month>/')
class TimeContracts(Resource):
    @api.marshal_list_with(contract)
    @api.doc(params={'appointment_id': 'Specify the appointment',
                     'confirmed': 'Specify the confirmation status',
                     'year': 'specify the year',
                     'month': 'specify the month'})
    def get(self, appointment_id, confirmed, year, month):
        """
         Returns a list of contract json containing appointment, loan and reservation
        :param year:
        :param month:
        :param confirmed: 1, 0, or 1001337 for not confirmed
        :param appointment_id: if 1001337 -> returns all
        :return:
        """
        try:
            connection = init_db()
            cursor = connection.cursor()
            contract_entities = []
            if appointment_id == 1001337:
                if confirmed == 1001337:
                    sql_statement = '''SELECT * FROM appointments WHERE confirmed is NULL AND Date(date_time) >= '%s-%s-01' AND Date(date_time) <= '%s-%s-31' '''
                    cursor.execute(sql_statement, (year, month, year, month))
                else:
                    sql_statement = '''SELECT * FROM appointments WHERE confirmed = %s AND Date(date_time) >= '%s-%s-01' AND Date(date_time) <= '%s-%s-31' '''
                    cursor.execute(sql_statement, (confirmed, year, month, year, month))
                appointment_entities = cursor.fetchall()
            else:
                if confirmed == 1001337:
                    sql_statement = '''SELECT * FROM appointments WHERE id = %s AND confirmed is NULL AND Date(date_time) >= '%s-%s-01' AND Date(date_time) <= '%s-%s-31' '''
                    cursor.execute(sql_statement, (appointment_id, year, month, year, month))
                else:
                    sql_statement = '''SELECT * FROM appointments WHERE id = %s AND confirmed = %s AND Date(date_time) >= '%s-%s-01' AND Date(date_time) <= '%s-%s-31' '''
                    cursor.execute(sql_statement, (appointment_id, confirmed, year, month, year, month))
                appointment_entities = cursor.fetchall()

            if appointment_entities is ():
                response_object = {
                    'status': 'fail'
                }
                return response_object, 404
            else:
                for appointment_entity in appointment_entities:
                    sql_statement_loan = '''SELECT * FROM loans WHERE id = %s'''
                    cursor.execute(sql_statement_loan, appointment_entity['loan_id'])
                    loan_entity = cursor.fetchone()
                    if loan_entity is None:
                        continue
                    if appointment_entity['reservation_id'] != 0 and not appointment_entity['reservation_id'] is None:
                        sql_statement_reservation = '''SELECT * FROM reservations WHERE id = %s '''
                        cursor.execute(sql_statement_reservation, appointment_entity['reservation_id'])
                        reservation_entity = cursor.fetchone()
                        if reservation_entity is None:
                            continue
                        contract_entity = {'id': appointment_entity['id'],
                                    'date_time': appointment_entity['date_time'],
                                    'confirmed': appointment_entity['confirmed'],
                                    'type': appointment_entity['type'],
                                    'reservation_id': appointment_entity['reservation_id'],
                                    'loan_id': appointment_entity['loan_id'],
                                    'start_date': loan_entity['start_date'],
                                    'end_date': loan_entity['end_date'],
                                    'loan_duration': loan_entity['loan_duration'],
                                    'price': loan_entity['price'],
                                    'status': loan_entity['status'],
                                    'email': loan_entity['email'],
                                    'bike_ids': loan_entity['bike_ids'],
                                    'first_name': loan_entity['first_name'],
                                    'last_name': loan_entity['last_name'],
                                    'phone_number': loan_entity['phone_number'],
                                    'deposit': loan_entity['deposit'],
                                    'number_of_bikes': loan_entity['number_of_bikes'],
                                    'birthday': loan_entity['birthday'],
                                    'street': loan_entity['street'],
                                    'location': loan_entity['location'],
                                    'date_from': reservation_entity['date_from'],
                                    'date_to': reservation_entity['date_to']}
                    else:
                        contract_entity = {'id': appointment_entity['id'],
                                           'date_time': appointment_entity['date_time'],
                                           'confirmed': appointment_entity['confirmed'],
                                           'type': appointment_entity['type'],
                                           'reservation_id': appointment_entity['reservation_id'],
                                           'loan_id': appointment_entity['loan_id'],
                                           'start_date': loan_entity['start_date'],
                                           'end_date': loan_entity['end_date'],
                                           'loan_duration': loan_entity['loan_duration'],
                                           'price': loan_entity['price'],
                                           'status': loan_entity['status'],
                                           'email': loan_entity['email'],
                                           'bike_ids': loan_entity['bike_ids'],
                                           'first_name': loan_entity['first_name'],
                                           'last_name': loan_entity['last_name'],
                                           'phone_number': loan_entity['phone_number'],
                                           'deposit': loan_entity['deposit'],
                                           'number_of_bikes': loan_entity['number_of_bikes'],
                                           'birthday': loan_entity['birthday'],
                                           'street': loan_entity['street'],
                                           'location': loan_entity['location'],
                                           'date_from': None,
                                           'date_to': None}
                    contract_entities.append(contract_entity)
                return contract_entities

        except KeyError as e:
            admin_conf.abort(500, e.__doc__, status="Could not retrieve information", statusCode="500")
        except Exception as e:
            admin_conf.abort(400, e.__doc__, status="Could not retrieve information", statusCode="400")
        finally:
            cursor.close()
            connection.close()
