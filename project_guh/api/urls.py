from django.urls import path
from .views import FireView, EarthView


urlpatterns = [
        path('fire',FireView.as_view(), name='test'),
        path('earth',EarthView.as_view(), name='test'),
]