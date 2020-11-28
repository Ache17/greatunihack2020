
var map = null;
var mapCanvas = null;

function addMap(id) {
  mapboxgl.accessToken = 'pk.eyJ1IjoiYWNoZSIsImEiOiJja2hzMzNiZTAwZzhzMnFsaGRrb2RiazI1In0.Kas8OyDCtoysgjokizoasg';
  map = new mapboxgl.Map({
    container: "map",
    //style: 'mapbox://styles/mapbox/satellite-v9', // stylesheet location
    style: "mapbox://styles/mapbox/dark-v10",
    center: [-74.5, 40],
    zoom: 9 // starting zoom
  });

  map.on("load", function () {
    mapCanvas = document.getElementsByClassName("mapboxgl-canvas")[0];
  });
}




var app = new Vue({
  el: "#app",
  delimiters: ['$[', ']$'],
  data: {
    message: "Hello Vue!",
    messages: false,
    cityinfo: false,
    left: false,
    push_str: "Hide",
    fireBtnStateStr: "Show",
    fireBtnID: "",
    earthBtnStateStr: "Show",
    earthquakesID: ""
  },
  mounted: function () {
    addMap("map");
  },
  methods:
  {
    showFire: function () {
      if (this.fireBtnID === "")
      {
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", "/api/events");
        xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xmlhttp.setRequestHeader('Accept', 'application/json');
        xmlhttp.onreadystatechange = function () {
          if (xmlhttp.readyState === 4) {
            let data = JSON.parse(this.responseText);

          }
        }
        xmlhttp.send();
      }
      else {

      }

    },
    showEarth: function () {
      if (this.earthquakesID === "") {
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", "/api/earth");
        xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xmlhttp.setRequestHeader('Accept', 'application/json');
        xmlhttp.onreadystatechange = function () {
          if (xmlhttp.readyState === 4) {
            let data = JSON.parse(this.responseText);
            this.earthquakesID = "earthquakes";
            map.addSource(this.earthquakesID, {
              "type": "geojson",
              "data": data
            });

            map.addLayer({
              'id': 'earthquakes-heat',
              'type': 'heatmap',
              'source': 'earthquakes',
              'maxzoom': 9,
              'paint': {
                // Increase the heatmap weight based on frequency and property magnitude
                'heatmap-weight': [
                  'interpolate',
                  ['linear'],
                  ['get', 'mag'],
                  0,
                  0,
                  6,
                  1
                ],
                // Increase the heatmap color weight weight by zoom level
                // heatmap-intensity is a multiplier on top of heatmap-weight
                'heatmap-intensity': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  0,
                  1,
                  9,
                  3
                ],
                // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                // Begin color ramp at 0-stop with a 0-transparancy color
                // to create a blur-like effect.
                'heatmap-color': [
                  'interpolate',
                  ['linear'],
                  ['heatmap-density'],
                  0,
                  'rgba(33,102,172,0)',
                  0.2,
                  'rgb(103,169,207)',
                  0.4,
                  'rgb(209,229,240)',
                  0.6,
                  'rgb(253,219,199)',
                  0.8,
                  'rgb(239,138,98)',
                  1,
                  'rgb(178,24,43)'
                ],
                // Adjust the heatmap radius by zoom level
                'heatmap-radius': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  0,
                  2,
                  9,
                  20
                ],
                // Transition from heatmap to circle layer by zoom level
                'heatmap-opacity': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  7,
                  1,
                  9,
                  0
                ]
              }
            },
              'waterway-label'
            );

            map.addLayer(
              {
                'id': 'earthquakes-point',
                'type': 'circle',
                'source': 'earthquakes',
                'minzoom': 7,
                'paint': {
                  // Size circle radius by earthquake magnitude and zoom level
                  'circle-radius': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    7,
                    ['interpolate', ['linear'], ['get', 'mag'], 1, 1, 6, 4],
                    16,
                    ['interpolate', ['linear'], ['get', 'mag'], 1, 5, 6, 50]
                  ],
                  // Color circle by earthquake magnitude
                  'circle-color': [
                    'interpolate',
                    ['linear'],
                    ['get', 'mag'],
                    1,
                    'rgba(33,102,172,0)',
                    2,
                    'rgb(103,169,207)',
                    3,
                    'rgb(209,229,240)',
                    4,
                    'rgb(253,219,199)',
                    5,
                    'rgb(239,138,98)',
                    6,
                    'rgb(178,24,43)'
                  ],
                  'circle-stroke-color': 'white',
                  'circle-stroke-width': 1,
                  // Transition from heatmap to circle layer by zoom level
                  'circle-opacity': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    7,
                    0,
                    8,
                    1
                  ]
                }
              },
              'waterway-label'
            );

            this.earthBtnStateStr = "Hide";
          }
        }
        xmlhttp.send();
      }
      else {
          console.log("xd");
            if (this.earthBtnStateStr === "Hide")
            {
                this.earthBtnStateStr = "Show";
                map.setLayoutProperty(this.earthquakesID, 'visibility', 'none');
            }
            else
            {
                this.earthBtnStateStr = "Hide";
                map.setLayoutProperty(this.earthquakesID, 'visibility', 'visible');
            }
      }

    },
    messagesShow: function () {
      console.log("messages show");
    },
    messagesHide: function () {
      console.log("messages hide");
    },
    cityShow: function () {
      console.log("city show");
    },
    cityHide: function () {
      console.log("city hide");
    },
    showHide: function () {
      if (this.push_str === "Hide") {
        this.push_str = "Show";
        this.left = false;
      }
      else {
        this.push_str = "Hide";
        this.left = true;
      }
    },
    cityInfo: function () {
      console.log("city info");
    },
    getEvents: function () {

    }

  }
})