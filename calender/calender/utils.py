import hashlib
from django.http.response import JsonResponse
from datetime import datetime, timedelta
import json

def gen_password_hash(passwd):
    return str(hashlib.sha256(passwd).hexdigest())


def validate_params(req_data, required_params):
    missing_params = []
    for param in required_params:
        if req_data.get(param) in [None, '']:
            missing_params.append(param)
    if len(missing_params) > 0:
        return False, 'Paramteres missing: ' + ','.join(missing_params)
    return True, None


def _send(data, status_code):
    return JsonResponse(data=data, status=status_code)


def send_200(data):
    return _send(data, 200)


def send_201(data):
    return _send(data, 201)


def send_400(data):
    return _send(data, 400)


def send_404(data):
    return _send(data, 404)


def send_204(data):
    return _send(data, 204)


def send_401(data):
    return _send(data, 401)


def send_410(data):
    return _send(data, 410)


def send_403(data):
    return _send(data, 403) 

