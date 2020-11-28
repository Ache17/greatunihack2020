
var map = null;
var mapCanvas = null;

function addMap(id)
{
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWNoZSIsImEiOiJja2hzMzNiZTAwZzhzMnFsaGRrb2RiazI1In0.Kas8OyDCtoysgjokizoasg';
    map = new mapboxgl.Map({
        container : "map",
        //style: 'mapbox://styles/mapbox/satellite-v9', // stylesheet location
        style : "mapbox://styles/mapbox/dark-v10",
        center : [-74.5, 40],
        zoom : 9 // starting zoom
    });

    map.on("load", function ()
    {
        mapCanvas = document.getElementsByClassName("mapboxgl-canvas")[0];
    });
}


var app = new Vue({
    el : "#app",
    delimiters: ['$[', ']$'],
    data : {
        message : "Hello Vue!",
        messages : false,
        left : false,
        push_str : "Hide",
    },
    mounted : function ()
    {
        addMap("map");
    },
    methods :
        {
            showHide : function ()
            {
                if (this.push_str === "Hide")
                {
                    this.push_str = "Show";
                    this.left = false;
                }
                else
                {
                    this.push_str = "Hide";
                    this.left = true;
                }
            }


        }
})