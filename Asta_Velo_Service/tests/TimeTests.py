import unittest
import requests

class MyTestCase(unittest.TestCase):
    def test_time_appointments_valid(self):
        url = "http://127.0.0.1:5000/admin/api/v1/timeAppointments/2020/10/08"
        response = requests.get(url)
        print(response.status_code)
        assert response.status_code == 200

        data = response.json()
        #assert len(data) == 4

    def test_time_appointments_invalid(self):
        url = "http://127.0.0.1:5000/admin/api/v1/timeAppointments/2020/01/22"
        response = requests.get(url)

        assert response.status_code == 404

    def test_time_loans_valid(self):
        url = "http://127.0.0.1:5000/admin/api/v1/timeLoans/2020/10"
        response = requests.get(url)


        assert response.status_code == 200



    def test_time_loans_invalid(self):
        url = "http://127.0.0.1:5000/admin/api/v1/timeAppointments/2020/01"
        response = requests.get(url)

        assert response.status_code == 404


    def test_time_reservations_valid(self):
        url = "http://127.0.0.1:5000/admin/api/v1/timeReservations/2020/01"
        response = requests.get(url)
        print(response)

        assert response.status_code == 200
        print(response.text)
        data = response.json()
        #assert len(data) == 7

    def test_time_reservations_invalid(self):
        url = "http://127.0.0.1:5000/admin/api/v1/timeReservations/2020/05/22"
        response = requests.get(url)

        assert response.status_code == 404


if __name__ == '__main__':
    unittest.main()
