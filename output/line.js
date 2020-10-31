$(function(){

  //get the line chart canvas
  var ctx = $("#line-chartcanvas");
  var ctx2 = $("#line-chartcanvas2");

  console.log(dataArray)

  //line chart data
  var data = {
    labels: [],
    datasets: [
      {
        label: "total",
        data: [],
        backgroundColor: "blue",
        borderColor: "lightblue",
        fill: false,
        lineTension: 0,
        radius: 3
      },
      {
        label: "O2",
        data: [],
        backgroundColor: "green",
        borderColor: "lightgreen",
        fill: false,
        lineTension: 0,
        radius: 3
      },
      {
        label: "IVL",
        data: [],
        backgroundColor: "red",
        borderColor: "red",
        fill: false,
        lineTension: 0,
        radius: 3
      },
      {
        label: "hard",
        data: [],
        backgroundColor: "gray",
        borderColor: "lightgray",
        fill: false,
        lineTension: 0,
        radius: 3
      }            
    ]
  };

  var data2 = {
    labels: [],
    datasets: [
      {
        label: "minus",
        data: [],
        backgroundColor: "blue",
        borderColor: "lightblue",
        fill: false,
        lineTension: 0,
        radius: 3
      },
      {
        label: "plus",
        data: [],
        backgroundColor: "black",
        borderColor: "gray",
        fill: false,
        lineTension: 0,
        radius: 3
      },
    
    ]
  };
  for (record of dataArray)
  {
    data.labels.push(record.date)
    data.datasets[0].data.push(record.total)
    data.datasets[1].data.push(record.O2)
    data.datasets[2].data.push(record.IVL)
    data.datasets[3].data.push(record.hard)

    data2.labels.push(record.date)
    data2.datasets[0].data.push(record.minus)
    data2.datasets[1].data.push(record.plus)
  }

  //options
  var options = {
    responsive: true,
    title: {
      display: true,
      position: "top",
      text: "Line Graph",
      fontSize: 18,
      fontColor: "#111"
    },
    legend: {
      display: true,
      position: "bottom",
      labels: {
        fontColor: "#333",
        fontSize: 16
      }
    },
    plugins: {
      zoom: {
          pan: {
              enabled: true,
              mode: 'xy'
          },
          zoom: {
              enabled: true,
              mode: 'xy'
          }
      }
    }    
  };

  
  //create Chart class object
  var chart = new Chart(ctx, {
    type: "line",
    data: data,
    options: options
  });

  var chart2 = new Chart(ctx2, {
    type: "line",
    data: data2,
    options: options
  });

});