import unittest
import requests
import json


class TestAPIServices(unittest.TestCase):

    # compare len of response body of available bikes and all bikes
    def testGetAllAvailableBikes(self):
        url = "http://127.0.0.1:5000/service/api/v1/availableBikes/1337"
        response = requests.get(url)

        data = response.json()

        url_all = "http://127.0.0.1:5000/admin/api/v1/bikes/1001337"
        response_all = requests.get(url_all)

        print(response_all.text)

        assert response_all.status_code == 200
        assert len(data) <= len(response_all.json())


    def test_get_commentsForABike(self):

        # bike_id that exists
        url = "http://127.0.0.1:5000/service/api/v1/comments/1"
        response = requests.get(url)

        data=response.json()
        print(data)
        assert len(data) == 2
        assert response.status_code == 200


    def test_get_BikeAvailability(self):
        url = "http://127.0.0.1:5000/service/api/v1/notAvailableBikes/1"

        response = requests.get(url)

        data = response.json()
        assert response.status_code == 200
        assert len(data)>0








if __name__ == '__main__':
    unittest.main()
