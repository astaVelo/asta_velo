from src.server.instance import server
from flask_restplus import fields


date = server.api.model('Date', {
    'start_date': fields.Date(required=True, min_length=1, max_length=200, description='start date'),
    'end_date': fields.Date(required=True, description='end date')
})