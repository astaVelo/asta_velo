import unittest
import requests


def check_response_body_is_null(response):
    data = response.json()
    assert data['id'] is None
    assert data['start_date'] is None
    assert data['end_date'] is None
    assert data['loan_duration'] is None
    assert data['price'] is None
    assert data['permitted'] is None
    assert data['customer_email'] is None
    assert data['bike_id'] is None


class MyTestCase(unittest.TestCase):

    def test_put_loan(self):
        url = "http://127.0.0.1:5000/admin/api/v1/loans/1"

        input_data = {'end_date':"26.12.2020.18:00",'loan_duration':3,'location':"test",'status':"closed",'bike_ids':"1,2",'first_name':"test",
        'number_of_bikes':2,'id':1,'price':30,'deposit':20,'birthday':"26.11.1994",'start_date':"23.12.2020.14:00",'email':"test",'phone_number':'test',
        'street':"test",'last_name':"test"}

        response = requests.put(url, json=input_data)

        print(response.text)
        assert response.status_code == 200

    #update a loan that doesn't exist
    def test_put_loan_invalid(self):
        url = "http://127.0.0.1:5000/admin/api/v1/loans/5"

        input_data = {'end_date':"26.12.2020.18:00",'loan_duration':3,'location':"test",'status':"closed",'biked_ids':"1,2",'first_name':"test",
        'number_of_bikes':2,'id':5,'price':30,'deposit':20,'birthday':"26.11.1994",'start_date':"23.12.2020.14:00",'email':"test",'phone_number':'test',
        'street':"test",'last_name':"test"}

        response = requests.put(url, json=input_data)

        assert response.status_code == 400

    # invalid payload 
    def test_put_loan_invalid_payload(self):
        url = "http://127.0.0.1:5000/admin/api/v1/loans/2"

        input_data = {'end_date':"26.12.2020.18:00",'loan_duration':3,'location':"test",'biked_ids':"1,2",'first_name':"test",
        'number_of_bikes':2,'id':5,'price':30,'deposit':20,'birthday':"26.11.1994",'email':"test",'phone_number':'test',
        'street':"test",'last_name':"test"}

        response = requests.put(url, json=input_data)
        print(response.text)

        assert response.status_code == 400

    def test_get_loans(self):
        url = "http://127.0.0.1:5000/admin/api/v1/loans/1"

        data = {'status':'closed'}


        response = requests.get(url,json=data)
        print(response.text)
        data = response.json()

        assert response.status_code == 200
        print(data)
        for d in data:
            assert d["id"] == 1
            assert d["loan_duration"] == 3
            assert d["price"] == 30
            assert d["bike_ids"] == "1,2"
            assert d["birthday"]== "26.11.1994"

    def test_delete_loan(self):
        url = "http://127.0.0.1:5000/admin/api/v1/loans/1"
        response = requests.delete(url)

        assert response.status_code == 200
        assert response.json() == {'status': 'success', 'message': 'Successfully inserted.'}
    # # get and put
    # def test_requested_loans(self):

    #     send_loan_request_url = "http://127.0.0.1:5000/actions/api/v1/sendLoanRequest"
    #     get_url = "http://127.0.0.1:5000/admin/api/v1/requestedLoans/1001337"
    #     put_url = "http://127.0.0.1:5000/admin/api/v1/requestedLoans/1"

    #     input_data = {'id': 1, 'start_date': '10.12.2020.16:00', 'end_date': '12.12.2020.18:00', 'loan_duration': 2,
    #           'price': 6, 'permitted': True, 'bike_id':0, 'customer_email': 'string', 'first_name':'Test',
    #           'last_name': 'Test','phone_number':'+1234', 'deposit':50, 'number_of_bikes':1}

    #     get_response = requests.get(get_url)
    #     assert get_response.status_code == 200

    #     send_response = requests.post(send_loan_request_url, json=input_data)

    #     print(send_response.json())
    #     put_response = requests.put(put_url, json=input_data)

    #     assert put_response.status_code == 200
    #     check_response_body_is_null(put_response)



if __name__ == '__main__':
    unittest.main()
