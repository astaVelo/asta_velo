import unittest
import requests


def check_response_body_is_null(response):
    data = response.json()
    assert data['id'] is None
    assert data['email'] is None
    # Typo in response body passwort instead of password
    assert data['password'] is None


class MyTestCase(unittest.TestCase):

    def test_RegisterAdmin_valid(self):
        url ="http://127.0.0.1:5000/admin/api/v1/registerAdmin"
        input_data = {'email': "test@test.de", 'password': "hallo_test"}
        response = requests.post(url, json=input_data)

        assert response.status_code == 200
        check_response_body_is_null(response)

    def test_RegisterAdmin_invalid(self):
        url = "http://127.0.0.1:5000/admin/api/v1/registerAdmin"
        input_data = {'email': "test@test.de", 'passwort': "hallo_test"}
        response = requests.post(url, json=input_data)

        assert response.status_code == 400


if __name__ == '__main__':
    unittest.main()