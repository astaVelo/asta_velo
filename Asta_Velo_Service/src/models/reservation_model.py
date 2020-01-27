from src.server.instance import server
from flask_restplus import fields


reservation = server.api.model('Reservation', {
    'id': fields.Integer(required=False, description='Id'),
    'date_from': fields.Date(required=True, description='Start Date: dd.mm.YY.hh:mm'),
    'date_to': fields.Date(required=True, description='End Date: dd.mm.YY.hh:mm'),
    'bike_ids': fields.String(required=True, description='Bike_IDS: 1###2###3###4'),
    'confirmed': fields.Boolean(required=False, description='Confirmed'),
    'email': fields.String(required=True, description='Email of customer')
})

