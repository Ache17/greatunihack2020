import requests

# https://eonet.sci.gsfc.nasa.gov/docs/v2.1

def get_events_nasa_geojson():
    return requests.get("https://eonet.sci.gsfc.nasa.gov/api/v3/events/geojson").json()

def get_events_nasa_v2():
    return requests.get("https://eonet.sci.gsfc.nasa.gov/api/v2.1/events").json()

