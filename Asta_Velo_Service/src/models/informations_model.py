from src.server.instance import server
from flask_restplus import fields


information = server.api.model('Informations', {
    'id': fields.Integer(required=False, description='Id'),
    'price_weekly': fields.Integer(required=True, description='Price For Weekly Loan'),
    'price_monthly': fields.Integer(required=True, description='Price For Monthly Loan'),
    'opening_hours': fields.String(required=True, description='Opening Hours For Every Day Of The Week: 00:00-00:00###16:00-18:00###00:00-00:00###16:00-18:00###00:00-00:00###00:00-00:00###00:00-00:00')
})

