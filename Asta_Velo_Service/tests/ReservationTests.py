import unittest
import requests

def check_response_body_is_null(response):
    data = response.json()
    print(data)
    assert data['id'] is None
    assert data['date_from'] is None
    assert data['date_to'] is None
    assert data['bike_id'] is None
    assert data['first_name'] is None
    assert data['last_name'] is None
    assert data['phone_number'] is None
    assert data['email'] is None


class ReservationTests(unittest.TestCase):

    def test_put_reservation_valid(self):

        url ="http://127.0.0.1:5000/admin/api/v1/reservations/1"

        input_data = {'id': 1, 'date_from': '13.01.2020.19:00', 'date_to': '16.01.2020.19:00','bike_ids': "1,2",}

        response = requests.put(url, json=input_data)

        assert response.status_code == 200
        assert response.json() == {"status": "success","message": "Successfully inserted."}

    #update a nonexisting reservation
    def test_put_reservation_invalid(self):
        url ="http://127.0.0.1:5000/admin/api/v1/reservations/10"

        #incorrect id format
        input_data = {'id': 3, 'date_from': '09.01.2020.15:00', 'date_to' : '11.01.2020.20:00','bike_ids':"abc"}

        response = requests.put(url,json=input_data)

        assert response.status_code == 200
        # check_response_body_is_null(response)


    def test_get_reservation_valid(self):
        get_all_url ="http://127.0.0.1:5000/admin/api/v1/reservations/1001337"

        response = requests.get(get_all_url)
        assert len(response.json())==2
        assert response.status_code == 200

        get_1_url = "http://127.0.0.1:5000/admin/api/v1/reservations/1"
        response_1 = requests.get(get_1_url)

        assert response_1.status_code == 200

        data = response_1.json()
        # print(data)
        for d in data:
            assert d['id'] == 1
            assert d['date_from'] == "2020-01-13"
            assert d['date_to'] == "2020-01-16"
            assert d['bike_ids'] == "1,2"

    def test_get_reservation_invalid(self):
        url = "http://127.0.0.1:5000/admin/api/v1/reservations/100"

        response = requests.get(url)
        # print(response.status_code)
        assert response.status_code == 404

    #get, delete, get
    def test_delete_reservation_valid(self):
        url = "http://127.0.0.1:5000/admin/api/v1/reservations/1"

        get_response = requests.get(url)

        data = get_response.json()
        print(data)
        for d in data:
            assert d['date_from'] == '2020-01-13'
            assert d['date_to'] == '2020-01-16'
            assert d['bike_ids'] == "1,2"

        delete_response = requests.delete(url)

        assert delete_response.status_code == 200

        get_response_after = requests.get(url)

        assert get_response_after.status_code == 404


    # delete a nonexisting reservation - status code 200 but nothing happens
    def test_delete_reservation_invalid(self):
        url = "http://127.0.0.1:5000/admin/api/v1/reservations/100"
        response = requests.delete(url)

        print(response.status_code)
        assert response.status_code == 200

        # check_response_body_is_null(response)



if __name__ == '__main__':
    unittest.main()

