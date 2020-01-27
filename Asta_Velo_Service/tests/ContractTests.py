import unittest
import requests
import json

class ContractTests(unittest.TestCase):

	def test_getContract(self):
		url = "http://localhost:5000/admin/api/v1/contracts/1"

		response = requests.get(url)
		data = response.json()

		assert response.status_code == 200
		assert data['end_date'] == "2020-10-12"
		assert data['bike_ids'] == "1"
		assert data['first_name'] == "test"
		assert data['last_name'] == "test"
		assert data['birthday'] == "12.12.1995"



	#get contract for a reservation id that doesn't exist
	def test_getContract_invalid(self):
		url = "http://127.0.0.1:5000/service/api/v1/contracts/24"

		response = requests.get(url)

		assert response.status_code == 404





if __name__ == '__main__':
    unittest.main()