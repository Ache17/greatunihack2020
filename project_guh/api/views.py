import json
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from .models import Earthquakes
import requests
import os

current_path = os.path.dirname(__file__)
fire_pth = os.path.join(current_path, 'fire_data_europe.geojson')
try:
    with open(fire_pth) as f:
        fire_content = f.read()
except Exception as e:
    fire_content = "{'message' : 'not found'}"
fire_json = json.loads(fire_content)

earthquakes_pth = os.path.join(current_path, "earth_data.geojson")
try:
    with open(earthquakes_pth) as f:
        earthquakes_content = f.read()
except Exception as e:
    earthquakes_content = "{'message' : 'not found'}"
earthquakes_json = json.loads(earthquakes_content)


class FireView(APIView):
    def get(self, request):
        return Response(fire_json, content_type='text/json')

    def post(self, request):
        content = {"POST ": "This is a message"}
        return Response(content)


class EarthView(APIView):
    def get(self, request):
        return Response(earthquakes_json, content_type='text/json')


class NewsViewDirect(APIView):
    def get(self, request, query="wildfires"):
        if request.method == "GET":
            payload = {"qInTitle": query, "apiKey": "487da61fbf4a4542bd67e7bcad0e3f82"}
            response = requests.get("https://newsapi.org/v2/everything", payload)
            if response.status_code == 200:
                with  open(os.path.join(os.path.dirname(__file__) + query + 'newscache.json'), "w") as outfile:
                    json.dump(response.json(), outfile)
                return Response(response.json())
            else:
                return Response({"Error": "Request failed"})
        else:
            return Response({"Error": "Method not allowed."})

class NewsView(APIView):
	def get(self,request,query="wildfires"):
		if request.method == "GET":
			f = open(os.path.join(os.path.dirname(__file__)+query+'newscache.json'))
			response = f.read()
			f.close()
			return Response(json.loads(response))
