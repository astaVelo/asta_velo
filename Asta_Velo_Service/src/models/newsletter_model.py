from src.server.instance import server
from flask_restplus import fields


newsletter_mail = server.api.model('Newsletter_mail', {
    'id': fields.Integer(required=False, description='Id'),
    'email': fields.String(required=True, min_length=1, max_length=200, description='Email')
})