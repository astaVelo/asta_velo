import unittest
import requests
import json

class TestNewsletter(unittest.TestCase):

	def test_get_newsletterMails(self):

		url = "http://127.0.0.1:5000/admin/api/v1/newsletterMails"

		response = requests.get(url)
		print(response.text)
		assert len(response.json()) == 2
		assert response.status_code == 200


	def test_post_delete_newsletterMail(self):

		url = "http://127.0.0.1:5000/admin/api/v1/newsletterMails"

		data = {"id":1}
		response = requests.post(url, json=data)

		assert response.status_code == 200


if __name__ == '__main__':
    unittest.main()