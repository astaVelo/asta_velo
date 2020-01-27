from src.server.instance import server
from flask_restplus import fields


loan = server.api.model('Loan', {
    'id': fields.Integer(required=False, description='Id'),
    'start_date': fields.Date(required=True, description='Start Date: dd.mm.YY.hh:mm'),
    'end_date': fields.Date(required=True, description='End Date: dd.mm.YY.hh:mm'),
    'loan_duration': fields.Integer(required=True, description='Loan Duration'),
    'price': fields.Integer(required=True, description='Price'),
    'status': fields.String(required=False, description='Status of the loan process: pending, running, closed'),
    'email': fields.String(required=True, description='Customer Email'),
    'bike_ids': fields.String(required=True, description='Bike IDs: 1###2###3###4'),
    'first_name': fields.String(required=True, description='Customer First Name'),
    'last_name': fields.String(required=True, description='Customer Last Name'),
    'phone_number': fields.String(required=True, description='Customer Phone Number'),
    'deposit': fields.Integer(required=True, description='Deposit'),
    'number_of_bikes': fields.Integer(required=True, description='Number Of Bikes'),
    'birthday': fields.String(required=False, description='Birthday'),
    'street': fields.String(required=False, description='Streetname'),
    'location': fields.String(required=False, description='Home Location')
})

