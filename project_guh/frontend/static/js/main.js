
var map = null;
var mapCanvas = null;
var geoLocalization = null;

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

  // Add geolocate control to the map.
  geoLocalization = new mapboxgl.GeolocateControl({positionOptions: { enableHighAccuracy: true},
    trackUserLocation: true});
  map.addControl(geoLocalization);
  geoLocalization.on("geolocate", function ()
  {
    console.log("a geolocate event has occured");
  });
}



var app = new Vue({
  el: "#app",
  delimiters: ['$[', ']$'],
  data: {
    message: "Hello Vue!",
    messages: false,
    cityinfo: false,
    nearyouinfo: false,
    left: true,
    push_str: "Hide",
    fireBtnStateStr: "Show",
    fireID: null,
    earthBtnStateStr: "Show",
    earthquakesID: null,
    tab: 'twitter',
    cities: [],
    options_dict: {},
    columns: [
        {
          name: 'name',
          required: true,
          label: 'Air Quality Data Unit',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: false
        },
        { name: 'data_value', align: 'center', label: 'Value', field: 'data_value', sortable: false },
      ],
      air_data: [],
      fire_info: '',
      biggest_pollutant: '',
      conc_level: '',
      pollution_category: ''
  },
  mounted: function () {
    addMap("map");
  },
  methods:
  {
    nearYou : function()
    {
      geoLocalization.trigger();
      this.nearyouinfo = true;
      this.fire_info = 'There is currently no risk of fire happening around you!';

     setTimeout(() => {  fetch("https://api.ambeedata.com/latest/fire?lat=" + geoLocalization._lastKnownPosition.coords.latitude.toString() + "&lng=" + geoLocalization._lastKnownPosition.coords.longitude.toString(), {
      "method": "GET",
      "headers": {
      "x-api-key": "cjAt7Bj4mD2oAdCQHOgMH6RoVqRNJR5N5XuDCO39",
      "Content-type": "application/json"
      }
      }).then(response => response.json()).then(data => {
          if(data.data.length != 0) {
            this.fire_info = 'There might be fire around you! Be careful!'
          }
      })}, 5000);

     setTimeout(() => {
        fetch("https://api.ambeedata.com/latest/by-lat-lng?lat="+geoLocalization._lastKnownPosition.coords.latitude.toString()+"&lng=" + geoLocalization._lastKnownPosition.coords.longitude.toString(), { "method": "GET", "headers": { "x-api-key": "cjAt7Bj4mD2oAdCQHOgMH6RoVqRNJR5N5XuDCO39", "Content-type": "application/json" } }).then(response => response.json()).then(data => { 
            this.biggest_pollutant = data.stations[0].aqiInfo.pollutant;
            this.conc_level = data.stations[0].aqiInfo.concentration;
            this.pollution_category = data.stations[0].aqiInfo.category;
        })
     }, 
     5000)
    
      
    },
    showFire: function () {
      if (this.fireID === null) {
        this.fireID = "fires";
        this.fireBtnStateStr = "Hide";
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", "/api/fire");
        xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xmlhttp.setRequestHeader('Accept', 'application/json');
        xmlhttp.onreadystatechange = function () {
          if (xmlhttp.readyState === 4) {
            let data = JSON.parse(this.responseText);

            map.addSource(app.fireID, {
              "type": "geojson",
              "data": data
            });

            map.addLayer({
              'id': app.fireID + "-heat",
              'type': 'heatmap',
              'source': app.fireID,
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
                'id': app.fireID + "-point",
                'type': 'circle',
                'source': app.fireID,
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

          }
        }
        xmlhttp.send();
      }
      else {
        if (this.fireBtnStateStr === "Hide") {
          this.fireBtnStateStr = "Show";
          map.setLayoutProperty(this.fireID + "-heat", 'visibility', 'none');
        }
        else {
          this.fireBtnStateStr = "Hide";
          map.setLayoutProperty(this.fireID + "-heat", 'visibility', 'visible');
        }
      }
    },
    showEarth: function () {
      console.log(this.earthquakesID);
      if (this.earthquakesID === null) {
        this.earthquakesID = "earthquakes";
        this.earthBtnStateStr = "Hide";
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", "/api/earth");
        xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xmlhttp.setRequestHeader('Accept', 'application/json');
        xmlhttp.onreadystatechange = function () {
          if (xmlhttp.readyState === 4) {
            let data = JSON.parse(this.responseText);

            map.addSource(app.earthquakesID, {
              "type": "geojson",
              "data": data
            });

            map.addLayer({
              'id': app.earthquakesID + "-heat",
              'type': 'heatmap',
              'source': app.earthquakesID,
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
                'id': app.earthquakesID + "-point",
                'type': 'circle',
                'source': app.earthquakesID,
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

          }
        }
        xmlhttp.send();
      }
      else {
        if (this.earthBtnStateStr === "Hide") {
          this.earthBtnStateStr = "Show";
          map.setLayoutProperty(this.earthquakesID + "-heat", 'visibility', 'none');
        }
        else {
          this.earthBtnStateStr = "Hide";
          map.setLayoutProperty(this.earthquakesID + "-heat", 'visibility', 'visible');
        }
      }

    },
    messagesShow: function () {
      let ckeditor = document.createElement('script');
      ckeditor.setAttribute('src', "https://platform.twitter.com/widgets.js");
      document.head.appendChild(ckeditor);
    $.ajax({
        url: "/api/newscached",
        type:"GET",
        dataType: "json",
        success: function(data){
          var titles = [];
          var imgs = [];
          var links = [];
          for (i=0;i<20;i++){
            titles.push(data.articles[i].title);
            imgs.push(data.articles[i].urlToImage);
            links.push(data.articles[i].url);
          }
          localStorage.setItem("titles",JSON.stringify(titles));
          localStorage.setItem("imgs",JSON.stringify(imgs));
          localStorage.setItem("links",JSON.stringify(links));
          }});

    },
    messagesHide: function () {
      console.log("messages hide");
    },
    twitterShow: function () {
      let ckeditor = document.createElement('script');
      ckeditor.setAttribute('src', "https://platform.twitter.com/widgets.js");
      document.head.appendChild(ckeditor);
      //alert("Twitter Showed")
    },
    newsShow: function(){
      let toRun = document.createElement('script');
      toRun.setAttribute('src',"/static/js/toIns.js");
      document.head.appendChild(toRun);
    },
    cityShow: function () {
      console.log("city show");
    },
    cityHide: function () {
      console.log("city hide");
    },
    searchCities: function(input) {
      const url = "https://api.waqi.info/search/?token=" + "8b37278c5f31eded23ca96cebfea5c8e32559a5d" + "&keyword=" + input;

      return new Promise(resolve => {
        if (input.length < 2) {
          return resolve([])
        }

        fetch(url)
          .then(response => response.json())
          .then(data => {
            let limit = 10;
            let options = [];

           // console.log(data.data[0]);

            if(data.data.length < limit) limit = data.data.length;

            this.options_dict = {};
            for(let i=0;i<limit;i++) {
              options.push(data.data[i].station.name);
              this.options_dict[data.data[i].station.name] = data.data[i].uid;
            }

            resolve(options);
          })
      })
    },
    handleSubmit: function(input) {
      const url = "https://api.waqi.info/feed/@" + this.options_dict[input] + "/?token=" + "8b37278c5f31eded23ca96cebfea5c8e32559a5d";

      fetch(url)
          .then(response => response.json())
          .then(data => {
            var names = {
              pm25: "PM2.5",
              pm10: "PM10",
              o3: "Ozone",
              no2: "Nitrogen Dioxide",
              so2: "Sulphur Dioxide",
              co: "Carbon Monoxyde",
              t: "Temperature",
              w: "Wind",
              r: "Rain (precipitation)",
              h: "Relative Humidity",
              d: "Dew",
              p: "Atmostpheric Pressure",
            };

            this.air_data = [];
            for (var specie in data.data.iaqi) {
              if(!names[specie]) continue;

              this.air_data.push({name: names[specie], data_value:data.data.iaqi[specie].v.toString()});
            }

            console.log("Done");
          })
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
      const xmlhttp = new XMLHttpRequest();
      xmlhttp.open("GET", "/api/events");
      xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      xmlhttp.setRequestHeader('Accept', 'application/json');
      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4) {
          let data = JSON.parse(this.responseText);
          map.loadImage('https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
              function (error, image) {
              if (error) throw error;
              map.addImage('custom-marker', image);
              map.addSource('events', { 'type': 'geojson', 'data': data});

              // Add a symbol layer
              map.addLayer({
                'id': 'events',
                'type': 'symbol',
                'source': 'events',
                'layout': {
                  'icon-image': 'custom-marker',
                  // get the title name from the source's "title" property
                  'text-field': ['get', 'title'],
                  'text-font': [
                    'Open Sans Semibold',
                    'Arial Unicode MS Bold'
                  ],
                  'text-offset': [0, 1.25],
                  'text-anchor': 'top'
                }
              });
            }
          );


        }
      }
      xmlhttp.send();
    }

  }
})
