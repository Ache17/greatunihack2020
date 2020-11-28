import json
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from django.http import HttpResponse
from .models import Earthquakes
import os

# Create your views here.
class FireView(APIView):
    def get(self, request):
         current_path = os.path.dirname(__file__)
         fire_data = os.path.join(current_path, 'fire_data_europe.geojson')
         if request.method == 'GET':
            try:
                f = open(fire_data)
                json_string = f.read()
                f.close()
                data = json.loads(json_string)
                response = json.dumps(data)
            except:
                response = json.dumps([{'Error': 'No fires found.'}])
         return HttpResponse(response, content_type='text/json')

    def post(self, request):
        content = {"POST " :"This is a message"}
        return Response(content)

class EarthView(APIView):
    def get(self, request):
         current_path = os.path.dirname(__file__)
         fire_data = os.path.join(current_path, 'earth_data.geojson')
         if request.method == 'GET':
            try:
                f = open(fire_data)
                json_string = f.read()
                f.close()
                data = json.loads(json_string)
                response = json.dumps(data)
            except:
                response = json.dumps([{'Error': 'No earthquakes found.'}])
         return HttpResponse(response, content_type='text/json')

    def post(self, request):
        content = {"POST " :"This is a message"}
        return Response(content)
