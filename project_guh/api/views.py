import json
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from .models import Earthquakes
import requests
import os


class FireView(APIView):
    def get(self, request):
    	content = {"Hello" : "world"}
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
    	return Response(response, content_type='text/json')

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
		return Response(response, content_type='text/json')

class NewsViewDirect(APIView):
	def get(self, request, query="wildfires"):
		if request.method == "GET":
			payload = {"qInTitle":query,"apiKey":"487da61fbf4a4542bd67e7bcad0e3f82"}
			response = requests.get("https://newsapi.org/v2/everything",payload)
			if response.status_code == 200:
				with  open(os.path.join(os.path.dirname(__file__)+query+'newscache.json'),"w") as outfile:
					json.dump(response.json(),outfile)
				return Response(response.json())
			else: return Response({"Error":"Request failed"})
		else: return Reponse({"Error":"Method not allowed."})
