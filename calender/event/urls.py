
from django.views.decorators.csrf import csrf_exempt
from django.conf.urls import url
from views import(EventView, SyncGoogleCalnder, EventListView)

urlpatterns = [
                url(r'^v1/events/$',
                    csrf_exempt(EventView.as_view())),
                 url(r'^v1/events/(?P<event_id>[0-9]+)/$',
                	csrf_exempt(EventListView.as_view())),
                url(r'^v1/sync/$',
                	csrf_exempt(SyncGoogleCalnder.as_view())),
              ]