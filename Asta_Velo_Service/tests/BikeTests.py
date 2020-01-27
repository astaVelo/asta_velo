import unittest
import requests
import json


def check_response_body_is_null(response):
    data = response.json()
    print(data)
    assert data['id'] is None
    assert data['color'] is None
    assert data['available'] is None
    assert data['size'] is None
    assert data['number_of_loans'] is None


class BikeTests(unittest.TestCase):

    # inserts a new bike to the database - id not required - test if id is increased
    def testPostBikes(self):
        url = "http://127.0.0.1:5000/admin/api/v1/newBikes"

        new_input_data = {'id': 1, 'size': '5', 'image_url': "abc", 'number_of_gears': 5, "type_of_breaks":"abc", 
        'available': True, 'number_of_loans': 1, 'type': "hi", 'inventory_number':"543",'information':'test'}

        response = requests.post(url, json=new_input_data)

        assert response.json() == {'status': 'success', 'message': 'Successfully inserted.'}


    # Test POST Bike with invalid Payload
    def testPostBikesInvalidPayload(self):
        url = "http://127.0.0.1:5000/admin/api/v1/newBikes"
        input_data = {'id': 2, 'available': True, 'size': 5, 'number_of_loans': 6}

        response = requests.post(url, json=input_data)
        assert response.status_code == 400

    #updates the data of a specific bike, if this bike exists
    def testPutBike(self):

        url = "http://127.0.0.1:5000/admin/api/v1/bikes/1"

        input_data = {'id': 1, 'size': '4', 'image_url': "abc", 'number_of_gears': 5, "type_of_breaks":"abc", 
        'available': True, 'number_of_loans': 2, 'type': "hi",'inventory_number':"982",'information':'test'}

        response = requests.put(url, json=input_data)

        assert response.status_code == 200
        # print("put bike",response.json())
        assert response.json() == {'status': 'success', 'message': 'Successfully inserted.'}

        get_response = requests.get(url)
        d = get_response.json()

        assert d[0]['inventory_number'] == "982"
        assert d[0]['size'] == "4"

    # try to update a bike that does not exist
    def testPutInvalidBike(self):
        url = "http://127.0.0.1:5000/admin/api/v1/bikes/15"
        input_data = {'id': 15, 'size': '5', 'image_url': "abc", 'number_of_gears': 5, "type_of_breaks":"abc", 'available': True, 
        'number_of_loans': 1, 'type': "hi", 'inventory_number':"543",'information':'test'}

        response = requests.put(url, json=input_data)
        # print(response.status_code)
        # assert response.status_code == 500

    #try to put a bike with invalid payload
    def testPutBikeInvalidPayload(self):
        url = "http://127.0.0.1:5000/admin/api/v1/bikes/6"
        input_data = {'id': 6, 'available': True, 'size': 5, " \
                     "'number_of_loans': 0, 'number_of_gears': 0, 'type_of_breaks': 'string'}

        response = requests.put(url, json=input_data)
        assert response.status_code == 400

    #get bike that is not in database
    def testGetBike(self):
        url = "http://127.0.0.1:5000/admin/api/v1/bikes/100"
        response = requests.get(url)
        # print(response.text)

        assert response.status_code == 404

    # updates a bike and check the values after a get
    def testGetSpecificBike(self):
        url = "http://127.0.0.1:5000/admin/api/v1/bikes/2"
        input_data = {'id': 2, 'size': "7", 'type':"hi",'image_url':"text",'number_of_gears': 0, 'type_of_breaks': "string",'available': False, 'number_of_loans': 11,
        'inventory_number':"543",'information':'test'}

        response_put = requests.put(url, json=input_data)

        response = requests.get(url)
        data = response.json()

        # print("data",data)
        # print(response.status_code)

        # there should only be one entry with id=8
        for res in data:
            assert res["id"] == 2
            assert res["available"] == False
            assert res["size"] == "7"
            assert res["number_of_loans"] == 11

    def testDeleteBike(self):
        url = "http://127.0.0.1:5000/admin/api/v1/bikes/13"
        response = requests.delete(url)

        assert response.status_code == 200


    def testDeleteBikeInvalidArgument(self):
        url = "http://127.0.0.1:5000/admin/api/v1/bikes/30"
        response = requests.delete(url)

        # print(response.text)
        # print(response.status_code)
        assert response.status_code == 200


if __name__ == '__main__':
    unittest.main()
