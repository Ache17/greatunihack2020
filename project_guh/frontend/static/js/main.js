
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
        cityinfo : false,
        left : false,
        push_str : "Hide",
    },
    mounted : function ()
    {
        addMap("map");
    },
    methods :
        {
            messagesShow : function ()
            {
                console.log("messages show");
            },
            messagesHide : function ()
            {
                console.log("messages hide");
            },
            cityShow : function ()
            {
                console.log("city show");
            },
            cityHide : function ()
            {
                console.log("city hide");
            },
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
            },
            cityInfo : function ()
            {
                console.log("city info");
            },
            getEvents : function ()
            {
                const xmlhttp = new XMLHttpRequest();
                xmlhttp.open("GET", "/api/events");
                xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
                xmlhttp.setRequestHeader('Accept', 'application/json');
                xmlhttp.onreadystatechange = function ()
                {
                    if (xmlhttp.readyState === 4 )
                    {
                        let data = JSON.parse(this.responseText);

                    }
                }
                xmlhttp.send();
            }

        }
})