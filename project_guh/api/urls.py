from django.urls import path, include
from .views import *


urlpatterns = [
        path('fire',FireView.as_view(), name='fire'),
        path('earth',EarthView.as_view(), name='earth'),
        path("events", EventsView.as_view(), name="events"),
        path('news',NewsViewDirect.as_view(), name='test'),
        path('newscached',NewsView.as_view(), name="test")
]
