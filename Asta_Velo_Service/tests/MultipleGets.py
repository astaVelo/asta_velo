import unittest
import requests
import json

class MultipleGets(unittest.TestCase):

	def test_admin_gets(self):
		all_bikes_url = "http://127.0.0.1:5000/admin/api/v1/bikes/1001337"
		specific_bike_url = "http://127.0.0.1:5000/admin/api/v1/bikes/1"

		#funktioniert jetzt wieder nicht - "inappropriate argument type"
		# contract_url = "http://127.0.0.1:5000/admin/api/v1/contracts/1"
		informations_url = "http://127.0.0.1:5000/admin/api/v1/informations"
		loans_url = "http://127.0.0.1:5000/admin/api/v1/loans/1/pending"
		requested_apts_url = "http://127.0.0.1:5000/admin/api/v1/requestedAppointments/1"
		newsletter_url = "http://127.0.0.1:5000/admin/api/v1/newsletterMails"

		r1 = requests.get(all_bikes_url)
		d1 = r1.json()
		assert len(d1) == 3

		r2 = requests.get(specific_bike_url)
		d2 = r2.json()

		assert d2[0]['id'] == 1
		assert d2[0]['size'] == "4"
		assert d2[0]['number_of_loans'] == 2

		# r3 = requests.get(contract_url)
		# d3 = r3.json()
		# print(d3)

		r3 = requests.get(informations_url)
		d3 = r3.json()

		assert d3['price_weekly'] == 7
		assert d3['price_monthly'] == 15

		r4 = requests.get(loans_url)
		d4 = r4.json()

		#list of lists, even when one bike
		assert d4[0]['number_of_bikes'] == 3
		assert d4[0]['deposit'] == 10
		assert d4[0]['birthday'] == "12.12.1992"

		r5 = requests.get(requested_apts_url)
		d5 = r5.json()

		#list of lists, even when one apt
		assert d5[0]['type'] == "pickup"
		assert d5[0]['loan_id'] == 3

		r6 = requests.get(newsletter_url)
		d6 = r6.json()

		assert d6[0]['email'] == "test"
		assert d6[1]['email'] == "test2"



if __name__ == '__main__':
    unittest.main()