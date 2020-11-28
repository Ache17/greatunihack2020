import json
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from django.http import HttpResponse
from .models import Earthquakes
# Create your views here.
class TestView(APIView):
    def get(self, request):
        content = {"Hello" : "world"}
        return Response(content)

    def post(self, request):
        content = {"this " :" is another message"}
        return Response(content)
