let plotLineChart = (data) => {
  const ctx = document.getElementById("myLineChart");
  const dataset = {
    labels: data.hourly.time,
    datasets: [
      {
        label: "Weekly temperature",
        data: data.hourly.temperature_2m,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };
  const config = {
    type: "line",
    data: dataset,
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
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
        ],
        tension: 0.1,
      },
    ],
  };
  const config = {
    type: "bar",
    data: dataset,
  };
  const chart = new Chart(ctx, config);
};

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
    // load(JSON.parse(meteo));
  }
  loadInocar();
})();
