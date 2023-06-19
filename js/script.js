let plot = (data) => { 
  const ctx = document.getElementById('myChart');
  const dataset = {
    labels: data.hourly.time, /* ETIQUETA DE DATOS */   //REPRESENTA EL EJE X (TIME)
    datasets: [{
        axis:'y',
        label: 'Temperatura semanal', /* ETIQUETA DEL GRÁFICO */  //TITULO DEL GRAFICO
        data: data.hourly.temperature_2m, /* ARREGLO DE DATOS */  //SON LOS VALORES QUE SE VAN A MOSTRAR EN EL CANVAS
        fill: false,  
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        backgroundColor:'rgba(255, 99, 132, 0.2)'
    }]
};


const config = {
  type: 'bar',
  data: dataset,

};
const chart = new Chart(ctx, config)
}



let load = (data) => {
  let URL =
    "https://api.open-meteo.com/v1/forecast?latitude=-2.15&longitude=-79.97&hourly=uv_index&daily=temperature_2m_max,uv_index_max,precipitation_sum,windspeed_10m_max&timezone=auto";
  fetch(URL) //Fetch retorna una promesa. Permite hacer peticiones a un endpoint
    /*
Posibles estados de una promesa: Sale bien o sale mal, si no sale bien se usa un catch al que se manda un
callback.
Si se cumple la promesa, hay que deserializar
*/
    .then((response) => response.json())
    .then((data) => {
      load(data)
    })
    .catch(console.error);
};





(function () {
  let URL =
    "https://api.open-meteo.com/v1/forecast?latitude=-2.15&longitude=-79.97&hourly=temperature_2m&daily=uv_index_max&timezone=auto";
  fetch(URL) //Fetch retorna una promesa. Permite hacer peticiones a un endpoint
    /*
  Posibles estados de una promesa: Sale bien o sale mal, si no sale bien se usa un catch al que se manda un
  callback.
  Si se cumple la promesa, hay que deserializar
  */
    .then((response) => response.json())
    .then((data) => {
      //Timezone
      // let timezone = data["timezone"];
      // let timezoneHTML = document.getElementById("timezone");
      // timezoneHTML.textContent = timezone;

      // //Temperature
      // let temperature = data["daily"]["temperature_2m_max"][0];
      // let temperatureHTML = document.getElementById("temperature");
      // temperatureHTML.textContent = temperature;

      // //UV-Index
      // let uvIndex = data["daily"]["uv_index_max"][0];
      // let uvIndexHTML = document.getElementById("uvIndex");
      // uvIndexHTML.textContent = uvIndex;

      // //Wind speed
      // let windSpeed = data["daily"]["windspeed_10m_max"][0];
      // let temperaturaHTML = document.getElementById("windSpeed");
      // temperaturaHTML.textContent = windSpeed;

      plot(data)
    })
    .catch(console.error);
})();

(function () {
  let meteo = localStorage.getItem("meteo");
  if (meteo == null) {
    let URL = "https://api.open-meteo.com/v1/forecast?latitude=-2.15&longitude=-79.97&hourly=temperature_2m&daily=uv_index_max&timezone=auto"

    fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        load(data);
        
        /* GUARDAR DATA EN MEMORIA */
        localStorage.setItem("meteo", JSON.stringify(data))
      })
      .catch(console.error);
  } else {  
    /* CARGAR DATA EN MEMORIA */
    load(JSON.parse(meteo))
  }
})();

