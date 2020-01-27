import unittest
import requests


def check_response_body_is_null(response):
    data = response.json()
    assert data['id'] is None
    assert data['email'] is None
    assert data['password'] is None
    #assert data['passwort'] is None #so funktioniert's


class MyTestCase(unittest.TestCase):

    def test_register_new_admin(self):
        url = "http://127.0.0.1:5000/admin/api/v1/registerAdmin"
        data = {'email': "Hermann", 'password': "Hallo_Hermann"}

        response = requests.post(url, json=data)
        assert response.status_code == 200
        assert response.json() == {'status': 'success', 'message': 'Successfully inserted.'}
        # check_response_body_is_null(response)

    def test__post_login_valid(self):
        url = "http://127.0.0.1:5000/admin/api/v1/login"
        data = {'email': "Hermann", 'password': "Hallo_Hermann"}


        response = requests.post(url, json=data)
        # print(response.json())
        assert response.json() == {'status': 'Success'}

    def test__post_login_invalid(self):
        url = "http://127.0.0.1:5000/admin/api/v1/login"
        data = {'email': "Hallo", 'password': "Hallo"}

        response = requests.post(url, json=data)
        assert response.status_code == 404

    def test__post_login_invalid_payload(self):
        url = "http://127.0.0.1:5000/admin/api/v1/login"
        data = {'mail': "Hallo", 'password': "Hallo"}

        response = requests.post(url, json=data)
        assert response.status_code == 400


if __name__ == '__main__':
    unittest.main()