let plotLineChart = (data) => {
  const ctx = document.getElementById("myLineChart");
  
  const dataset = {
    labels: data.hourly.time,
    datasets: [
      {
        label: "Weekly temperature",
        data: data.hourly.temperature_2m,
        fill: true,
        backgroundColor:'rgba(225, 228, 132, 0.2)',
        borderColor: "#fbbb6c",
        tension: 0.1,
      },
    ],
  };
  const config = {
    type: "line",
    data: dataset,
    options:{
      maintainAspectRatio:false,
      responsive:true
    }
  };
  const chart = new Chart(ctx, config);
};

let plotBarChart = (data) => {
  const ctx = document.getElementById("myBarChart");
  const dataset = {
    labels: data.daily.time,
    datasets: [
      {
        label: "Daily UV-Index",
        data: data.daily.uv_index_max,
        fill: false,
        backgroundColor: [
          "rgba(214, 115, 130, 0.7)",
          "rgba(240, 133, 114, 0.7)",
          "rgba(246, 157, 109, 0.7)",
          "rgba(251, 187, 108, 0.7)",
          "rgba(253, 219, 115, 0.7)",
          "rgba(242, 242, 122, 0.7)",
          "rgba(225, 228, 132, 0.7)",
        ],
        tension: 0.1,
      },
    ],
  };
  const config = {
    type: "bar",
    data: dataset,
    options:{
      indexAxis: 'y',
      maintainAspectRatio:false,
      responsive:true
    }
  };
  const chart = new Chart(ctx, config);
};
function initMap() {
  // Obtener referencia al elemento div
  var mapHolder = document.getElementById('map-container');

  // Obtener la ubicación actual del usuario si el navegador lo permite
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;

      // Crear mapa de OpenLayers con OpenStreetMap
      var map = new ol.Map({
        target: mapHolder,
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ],
        view: new ol.View({
          center: ol.proj.fromLonLat([longitude, latitude]),
          zoom: 10
        })
      });

      // Crear marcador en la ubicación actual
      var marker = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([longitude, latitude]))
      });
      var markerStyle = new ol.style.Style({
        image: new ol.style.Icon({
          src: 'https://openlayers.org/en/latest/examples/data/icon.png',
          scale: 0.5
        })
      });
      marker.setStyle(markerStyle);
      var vectorSource = new ol.source.Vector({
        features: [marker]
      });
      var vectorLayer = new ol.layer.Vector({
        source: vectorSource
      });
      map.addLayer(vectorLayer);
    });
  } else {
    mapHolder.innerHTML = "La geolocalización no es soportada por este navegador.";
  }
}
let load = (data) => {
  //Setting the data
  let timezone = data["timezone"];
  let timezoneHTML = document.getElementById("timezone");
  timezoneHTML.textContent = timezone;

  let temperature = data["hourly"]["temperature_2m"][0];
  let temperatureHTML = document.getElementById("temperature");
  temperatureHTML.textContent = temperature;

  let uvIndex = data["daily"]["uv_index_max"][0];
  let uvIndexHTML = document.getElementById("uv-index");
  uvIndexHTML.textContent = uvIndex;

  let windSpeed = data["hourly"]["windspeed_10m"][0];
  let windSpeedHTML = document.getElementById("wind-speed");
  windSpeedHTML.textContent = windSpeed;

  plotLineChart(data);
  plotBarChart(data);
};

let loadInocar = () => {
  let URL_proxy = 'http://localhost:8080/'
  let URL = URL_proxy+"https://www.inocar.mil.ec/mareas/consultan.php";

  fetch(URL)
    .then((response) => response.text())
    .then((data) => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, "text/html");
      console.log(xml);
      let contenedorMareas = xml.getElementsByTagName('div')[0];
      let contenedorHTML = document.getElementById('table-container');
      contenedorHTML.innerHTML = contenedorMareas.innerHTML;
    })
    .catch(console.error);
};




// IIFE
(function () {
  let meteo = localStorage.getItem("meteo");
  if (meteo == null) {
    let URL =
      "https://api.open-meteo.com/v1/forecast?latitude=-2.15&longitude=-79.88&hourly=temperature_2m,windspeed_10m&daily=uv_index_max&timezone=auto";
    fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        load(data);
        //Storing data in memory
        localStorage.setItem("meteo", JSON.stringify(data));
      })
      .catch(console.error);
  } else {
    //Loading data from memory
    load(JSON.parse(meteo));
  }
  loadInocar();
  initMap();
})();
