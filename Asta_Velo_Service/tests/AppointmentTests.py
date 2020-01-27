import unittest
import requests


def check_response_body_is_null(response):
    data = response.json()
    # print(data)
    assert data['id'] is None
    assert data['date_time'] is None
    assert data['type'] is None
    # assert data['bike_id'] is None
    assert data['confirmed'] is None
    assert data['reservation_id'] is None
    assert data['loan_id'] is None

class MyTestCase(unittest.TestCase):

    # get all requested appointments
    def test_get_all_requested_appointments(self):
        url = "http://127.0.0.1:5000/admin/api/v1/requestedAppointments/1001337"
        response = requests.get(url)

        data = response.json()
        print(data)
        assert len(data) == 2
        assert response.status_code == 200


    def test_get_requested_appointment(self):
        url = "http://127.0.0.1:5000/admin/api/v1/requestedAppointments/11"
        response = requests.get(url)

        data = response.json()
        print(response.text)

        assert response.status_code == 200

        assert data[0]['reservation_id'] == 12
        assert data[0]['loan_id'] == 4


    def test_put_confirm_appointment(self):

        url = "http://127.0.0.1:5000/admin/api/v1/requestedAppointments/5"

        input_data = {'date_time':"12.12.2020.14:00",'reservation_id':5,'loan_id':4,'id':5,'confirmed':True,'type':'pickup'}
        response = requests.put(url, json=input_data)

        print(response.text)

        assert response.status_code == 200
        # check_response_body_is_null(response)


    # test get, put, get
    def test_requested_appointments(self):
        #first, get and assert that confirmed is NULL, then that it got properly set to True/False
        url = "http://127.0.0.1:5000/admin/api/v1/requestedAppointments/11"

        #empty at first
        get_resp = requests.get(url)
        data = get_resp.json()

        assert get_resp.status_code == 200
        assert data[0]['reservation_id'] == 12
        assert data[0]['loan_id'] == 4
        assert data[0]['confirmed'] == None


        input_data = {'date_time':"12.12.2020.14:00",'reservation_id':12,'loan_id':4,'id':12,'confirmed':True,'type':'pickup'}
        put_resp = requests.put(url, json=input_data)

        assert put_resp.status_code == 200


        get_resp2 = requests.get(url)
        data2 = get_resp2.json()

        assert get_resp2.status_code == 200
        assert data[0]['confirmed'] == 1


    def test_delete_requested_appointment(self):
        url = "http://127.0.0.1:5000/admin/api/v1/appointments/5"

        response = requests.delete(url)

        print("delete", response.text)

        assert response.status_code == 200


if __name__ == '__main__':
    unittest.main()
