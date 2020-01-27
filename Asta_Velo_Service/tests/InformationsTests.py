import unittest
import requests
import json

class TestInformations(unittest.TestCase):
	def test_postInformations(self):
		url = "http://127.0.0.1:5000/admin/api/v1/informations"

		data = {'price_weekly':10,'id':1,'opening_hours':"00:00-00:00###16:00-18:00###00:00-00:00###16:00-18:00###00:00-00:00###00:00-00:00###00:00-00:00",'price_monthly':30}

		response = requests.post(url,json=data)

		assert response.status_code == 200


	def test_postInformations_invalid(self):
		url = "http://127.0.0.1:5000/admin/api/v1/informations"

		data = {'id':2,'opening_hours':"00:00-00:00###16:00-18:00###00:00-00:00###16:00-18:00###00:00-00:00###00:00-00:00###00:00-00:00",'price_monthly':30}

		response = requests.post(url,json=data)

		assert response.status_code == 400



	def test_getInformations(self):
		url = "http://127.0.0.1:5000/admin/api/v1/informations"

		response = requests.get(url)

		data = response.json()
		print(data)
		assert data['price_weekly'] == 10
		assert data['id'] == 1
		assert data['price_monthly'] == 30
		assert data['opening_hours'] == "00:00-00:00###16:00-18:00###00:00-00:00###16:00-18:00###00:00-00:00###00:00-00:00###00:00-00:00"




if __name__ == '__main__':
    unittest.main()