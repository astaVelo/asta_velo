from src.server.instance import server
from flask_restplus import fields


login = server.api.model('Login', {
    'email': fields.String(required=True, description='Email'),
    'password': fields.String(required=True, description='Password')
})