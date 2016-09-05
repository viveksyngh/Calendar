
from django.views.decorators.csrf import csrf_exempt
from django.conf.urls import url
from views import(EventView)

urlpatterns = [
                url(r'^v1/events/$',
                    csrf_exempt(EventView.as_view())),
              ]