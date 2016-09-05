from django.shortcuts import render
from django.views.generic import View
from calender.utils import send_200, send_400
from calender.settings import SUCCESS_CODE
from account.models import Account
from datetime import datetime
from models import Event

# Create your views here.


class EventView(View):

	def __init__(self):
		self.response = {
				'code': SUCCESS_CODE,
				'message': '',
				'result' : {}
			}

	def dispatch(self, request, *args, **kwargs):
		return super(EventView, self).dispatch(request, *args, **kwargs)

	def post(self, request):
		request_data = request.POST
		
		self.response["code"], self.response["message"] = self._validate_params(request)
		if self.response["code"] != SUCCESS_CODE:
			return send_400(self.response)

		try:
			account = Account.objects.get(account_id=request_data.get('account_id'))
			event_start_date_time = datetime.strptime(request_data.get('event_start_time'), '%Y-%m-%d %H:%M')
			event_end_date_time = datetime.strptime(request_data.get('event_end_time'), '%Y-%m-%d %H:%M')
		except ValueError, e:
			self.response["code"] = "ITF"
			self.response["message"] = "Invalid time format."
			return send_400(self.response)
		except Account.DoesNotExist, e:
			self.response["code"] = 'ADE'
			self.response["message"] = "Account does not exists."
			return send_400(self.response)

		if event_start_date_time > event_end_date_time:
			self.response["code"] = "STGEN"
			self.response["message"] = "Event start time cannot be greater than end time."
			return send_400(self.response)

		event = Event(event_name=request_data.get('event_name'),
					  location=request_data.get('event_location'),
					  start_datetime=event_start_date_time,
					  end_datetime=event_end_date_time,
					  description=request_data.get('description'),
					  account=account)
		event.save()
		self.response["result"]["event"] = event.serialize()
		self.response["message"] = "Event created successfully."
		return send_200(self.response)

	def _validate_params(self, request):
		request_data = request.POST
		event_name = request_data.get('event_name')
		event_location = request_data.get('event_location')
		event_start_time = request_data.get('event_start_time')
		event_end_time = request_data.get('event_end_time')
		description = request_data.get('description')
		account_id = request_data.get('account_id')
		code = SUCCESS_CODE
		message = ''
		if event_name in [None, '']:
			code = "ENM"
			message = "Event name cannot be empty."
		
		if event_location in [None, '']:
			code = "ELM"
			message = "Event location cannot be empty."

		if event_start_time in [None, '']:
			code = "ESTM"
			message = "Event start time cannot be empty."

		if event_end_time in [None, '']:
			code = "EETM"
			message = "Event end time cannot be empty."

		if account_id in [None, '']:
			code = "AIE"
			message = "Account id cannot be empty."
		return code, message

	def get(self, request):
		request_data = request.GET
		account_id = request_data.get('account_id')
		from_datetime = request_data.get('from_date_time')
		to_datetime = request_data.get('to_date_time')
		print request_data
		try:
			account = Account.objects.get(account_id=request_data.get('account_id'))
			from_date_time = datetime.strptime(request_data.get('from_date_time'), 
												  '%Y-%m-%d %H:%M')
			to_date_time = datetime.strptime(request_data.get('to_date_time'),
											 '%Y-%m-%d %H:%M')
		except ValueError, e:
			self.response["code"] = "ITF"
			self.response["message"] = "Invalid time format."
			return send_400(self.response)
		except Account.DoesNotExist, e:
			self.response["code"] = 'ADE'
			self.response["message"] = "Account does not exists."
			return send_400(self.response)

		events = Event.objects.filter(account=account, 
									  start_datetime__gte=from_date_time,
									  end_datetime__lte=to_date_time)
		event_list = []
		for event in events:
			event_list.append(event.serialize())
		self.response["result"]["event_list"] = event_list
		return send_200(self.response)

