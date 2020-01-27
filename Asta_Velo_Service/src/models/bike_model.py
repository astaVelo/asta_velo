from src.server.instance import server
from flask_restplus import fields


bike = server.api.model('Bike', {
    'id': fields.Integer(required=False, description='Id'),
    'size': fields.String(required=True, description='Size of the bike'),
    'image_url': fields.String(required=False, description='Image Of Bike'),
    'number_of_gears': fields.Integer(required=True, description='Number Of Gears'),
    'type_of_breaks': fields.String(required=True, description='Type Of Breaks'),
    'available': fields.Boolean(required=True, description='Availability'),
    'number_of_loans': fields.Integer(required=True, description='Number Of Loans'),
    'type': fields.String(required=True, description='Type of the bike'),
    'inventory_number': fields.String(required=False, description='Inventory number of the bike'),
    'information': fields.String(required=False, description='Additional information of the bike')
})