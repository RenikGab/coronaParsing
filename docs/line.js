let chart, chart2
let dataArray = []

function updateChart(reg, regName) {
    /*
    chart.data.datasets.forEach((dataset) => {
      dataset.data.length = 0;
    });*/

    $.ajaxSetup({
        async: false
    });

    let ss = 'data/' + reg + '/data.json'

    $.getJSON(ss, function(data) {
        dataArray.length = 0
        $.each(data, function(key, val) {
            //console.log(key + "" + val + "")
            dataArray.push(val)
        });
    });

    $.ajaxSetup({
        async: true
    });

    var data = {
        labels: [],
        datasets: [{
                label: "total",
                data: [],
                backgroundColor: "blue",
                borderColor: "lightblue",
                fill: false,
                lineTension: 0,
                radius: 2
            },
            /*{
              label: "O2",
              data: [],
              backgroundColor: "green",
              borderColor: "lightgreen",
              fill: false,
              lineTension: 0,
              radius: 3
            },*/
            {
                label: "corona",
                data: [],
                backgroundColor: "green",
                borderColor: "lightgreen",
                fill: false,
                lineTension: 0,
                radius: 2
            },
            {
                label: "IVL",
                data: [],
                backgroundColor: "red",
                borderColor: "red",
                fill: false,
                lineTension: 0,
                radius: 2
            },
            {
                label: "hard",
                data: [],
                backgroundColor: "gray",
                borderColor: "lightgray",
                fill: false,
                lineTension: 0,
                radius: 2
            }
        ]
    };

    var data2 = {
        labels: [],
        datasets: [{
                label: "minus",
                data: [],
                backgroundColor: "blue",
                borderColor: "lightblue",
                fill: false,
                lineTension: 0,
                radius: 2
            },
            {
                label: "plus",
                data: [],
                backgroundColor: "black",
                borderColor: "gray",
                fill: false,
                lineTension: 0,
                radius: 2
            },
        ]
    };

    for (record of dataArray) {
        data.labels.push(record.date)
        data.datasets[0].data.push(record.total)
            //data.datasets[1].data.push(record.O2)
        data.datasets[1].data.push(record.corona)
        data.datasets[2].data.push(record.IVL)
        data.datasets[3].data.push(record.hard)

        data2.labels.push(record.date)
        data2.datasets[0].data.push(record.minus)
        data2.datasets[1].data.push(record.plus)
    }

    chart.data = data
    chart2.data = data2
    chart.options.title.text = regName + " info"
    chart2.options.title.text = regName + " plus-minus"

    chart.update();
    chart2.update();

}


$(function() {

    let regions = document.getElementById("regions");
    console.log(regions)

    function changeOption() {
        var selection = document.getElementById("selection");
        var selectedOption = regions.options[regions.selectedIndex];
        //selection.textContent = "Вы выбралdи: " + selectedOption.value;

        dataArray.length = 0
        updateChart(selectedOption.value, selectedOption.text)

    }
    regions.addEventListener("change", changeOption);

    /*
      $.ajaxSetup({
        async: false
      }); 

      $.getJSON('data/43/data.json', function(data) {
                  dataArray.length = 0
                  $.each(data, function(key, val) {
                    //console.log(key + "" + val + "")
                    dataArray.push(val)
                  });
      });

      $.ajaxSetup({
        async: true
      });
      */
    //get the line chart canvas
    var ctx = $("#line-chartcanvas");
    var ctx2 = $("#line-chartcanvas2");

    //console.log(dataArray)

    //line chart data
    var data = {
        labels: [],
        datasets: []
    };

    var data2 = {
        labels: [],
        datasets: []
    };

    /*
  for (record of dataArray)
  {
    data.labels.push(record.date)
    data.datasets[0].data.push(record.total)
    //data.datasets[1].data.push(record.O2)
    data.datasets[1].data.push(record.corona)
    data.datasets[2].data.push(record.IVL)
    data.datasets[3].data.push(record.hard)

    data2.labels.push(record.date)
    data2.datasets[0].data.push(record.minus)
    data2.datasets[1].data.push(record.plus)
  }
*/
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
    chart = new Chart(ctx, {
        type: "line",
        data: data,
        options: options
    });

    chart2 = new Chart(ctx2, {
        type: "line",
        data: data2,
        options: options
    });

    updateChart(12, "Republic of Mari El")
});