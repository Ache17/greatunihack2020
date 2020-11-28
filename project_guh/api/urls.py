from django.urls import path, include
from .views import FireView, EarthView, NewsViewDirect, NewsView


urlpatterns = [
        path('fire',FireView.as_view(), name='test'),
        path('earth',EarthView.as_view(), name='test'),
        path('news/<str:query>',NewsViewDirect.as_view(), name='test'),
        path('newscached/<str:query>',NewsView.as_view(), name="test")
]
