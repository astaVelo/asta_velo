from src.server.instance import server
from flask_restplus import fields


appointment = server.api.model('Appointment', {
    'id': fields.Integer(required=False, description='Id'),
    'date_time': fields.Date(required=True, min_length=1, max_length=200, description='DateTime: dd.mm.YY.hh:mm'),
    'confirmed': fields.Boolean(required=False, description='Confirmed'),
    'type': fields.String(required=True, description='Type Of Appointment: return or pickup'),
    'reservation_id': fields.Integer(required=False, description='Reservation ID'),
    'loan_id': fields.Integer(required=True, description='Loan ID')
})
