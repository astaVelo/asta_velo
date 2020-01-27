from src.server.instance import server
from flask_restplus import fields


new_login = server.api.model('newLogin', {
    'oldEmail': fields.String(required=True, description='Email'),
    'oldPassword': fields.String(required=True, description='Password'),
    'newEmail': fields.String(required=True, description='Email'),
    'newPassword': fields.String(required=True, description='Password')
})