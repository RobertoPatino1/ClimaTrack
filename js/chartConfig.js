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
      labels: data.hourly.time,
      datasets: [
        {
          label: "Hourly Wind Speed",
          data: data.hourly.windspeed_10m,
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
        // indexAxis: 'y',
        maintainAspectRatio:false,
        responsive:true
      }
    };
    const chart = new Chart(ctx, config);
  };

  let plotPolarChart = (data) => {

    const ctx = document.getElementById("myPieChart");
    
    const dataset = {
      labels: data.daily.time,
      datasets: [
        {
          data: data.daily.uv_index_max,
          fill: true,
          backgroundColor:'rgba(225, 228, 132, 0.2)',
          borderColor: [
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
      type: "polarArea",
      data: dataset,
      options:{
        maintainAspectRatio:false,
        responsive:true
      }
    };
    const chart = new Chart(ctx, config);
  };
  
  let load = (data) => {
    plotLineChart(data);
    plotBarChart(data);
    plotPolarChart(data)
  };
  

  // IIFE
  (function () {
    let meteo = localStorage.getItem("meteo");
    if (meteo == null) {
      let URL = "https://api.open-meteo.com/v1/forecast?latitude=-2.15&longitude=-79.88&hourly=temperature_2m,windspeed_10m&daily=temperature_2m_max,uv_index_max,windspeed_10m_max&timezone=auto"
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
  })();
  