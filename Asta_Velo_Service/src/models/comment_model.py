from src.server.instance import server
from flask_restplus import fields


comment = server.api.model('Comment', {
    'id': fields.Integer(required=False, description='Id'),
    'comment': fields.String(required=True, description='Comment'),
    'bike_id': fields.Integer(required=True, description='Bike ID'),
    'email': fields.String(required=True, min_length=1, max_length=200, description='Email')
})
