import unittest
import requests
import json


def check_response_body_comment_is_null(response):
    data = response.json()
    assert data['id'] is None
    assert data['comment'] is None
    assert data['bike_id'] is None

def check_response_body_appointment_is_null(response):
    data = response.json()
    assert data['id'] is None
    assert data['date_time'] is None
    assert data['email'] is None
    assert data['confirmed'] is None
    assert data['first_name'] is None
    assert data['last_name'] is None
    assert data['phone_number'] is None
    assert data['deposit'] is None
    assert data['number_of_bikes'] is None
    assert data['type'] is None
    assert data['reservation_id'] is None

def check_response_body_loan_is_null(response):
    data = response.json()
    assert data['id'] is None
    assert data['start_date'] is None
    assert data['end_date'] is None
    assert data['loan_duration'] is None
    assert data['price'] is None
    assert data['permitted'] is None
    assert data['bike_id'] is None
    assert data['customer_email'] is None
    assert data['first_name'] is None
    assert data['last_name'] is None
    assert data['phone_number'] is None
    assert data['deposit'] is None
    assert data['number_of_bikes'] is None

def check_response_body_reservation_is_null(response):
    data = response.json()
    assert data['id'] is None
    assert data['date_from'] is None
    assert data['date_to'] is None
    assert data['bike_id'] is None
    assert data['first_name'] is None
    assert data['last_name'] is None
    assert data['phone_number'] is None
    assert data['email'] is None


class ActionTests(unittest.TestCase):

    def test_post_comment(self):
        url_post_comment = "http://127.0.0.1:5000/actions/api/v1/comment"
        input_data_comment = {'id': 3, 'comment': "test", 'bike_id': 2, 'email':'abc'}

        response_comment = requests.post(url_post_comment, json=input_data_comment)
        #print(response_comment.json())
        assert response_comment.json() == {'status': 'success', 'message': 'Successfully inserted.'}


       #check_response_body_appointment_is_null(response_comment)


    def test_post_sendAppointmentRequest(self):
        url = "http://127.0.0.1:5000/actions/api/v1/sendAppointmentRequest"
        input_data = {'bike_ids':"5",'date_time':"08.10.2020.18:00", 'end_date':"12.10.2020.14:00", 'loan_duration':3,'reservation_id':2,'location':"test",
        'loan_id':5, 'first_name':"test", 'number_of_bikes': 1, 'type':"pickup", 'price':50, 'confirmed':True, 
        'deposit':50,'birthday':"12.12.1995",'start_date':"10.10.2020.16:00",'email':"test",'phone_number':"1234",'id':2,'street':"test",'last_name':"test"}
        # input_data = {'id': 1, 'date_time': "08.10.2020.18:00",'confirmed': False,'type': "pickup",'reservation_id': 1, 'loan_id': 1,'start_date': "08.10.2020.18:00", 'end_date': "10.10.2020.18:00", 'loan_duration': 2, 'price': 0, 'status': 'string', 'email': "string",
        #               'bike_ids': 'string', 'first_name': "Test", 'last_name': "Test", 'phone_number': "012389024", 'deposit': 40,
        #               'number_of_bikes': 1, 'birthday': 'string', 'street': 'string', 'location':'string'}

        response = requests.post(url, json=input_data)
        # print(response.json())

        assert response.json() == {'status': 'success', 'message': 'Successfully inserted.'}


    # def test_post_sendLoanRequest(self):
    #     url = "http://127.0.0.1:5000/actions/api/v1/sendLoanRequest"
    #     input_data = {'id': 1, 'start_date': "08.10.2020.18:00", 'end_date': "10.10.2020.18:00",'loan_duration': 2, 'price': 25, 'permitted': True, 'bike_id': 1, 'customer_email': "string",'first_name': "Test", 'last_name':"Test",'phone_number':"+71234",'deposit': 30, 'number_of_bikes':1}

    #     response = requests.post(url, json=input_data)
    #     print(response.text)
    #     assert response.status_code == 200

    #     check_response_body_loan_is_null(response)



    def test_post_sendReservationRequest(self):
        url = "http://127.0.0.1:5000/actions/api/v1/sendReservationRequest"

        input_data = {'id': 1, 'date_from': "08.10.2020.18:00", 'date_to': "10.10.2020.18:00",
        'bike_ids': 'string'}

        response = requests.post(url, json=input_data)

        assert response.json() == {'status': 'success', 'message': 'Successfully inserted.'}

        #check_response_body_reservation_is_null(response)

    def test_post_sendNewsletterRequest(self):
    	url = "http://127.0.0.1:5000/actions/api/v1/sendNewsletterRequest"

    	data = {'email':"test",'id':1}


if __name__ == '__main__':
    unittest.main()
