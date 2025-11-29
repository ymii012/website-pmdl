google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawCharts);

function drawCharts() {
  // Chart 1
  var data1 = google.visualization.arrayToDataTable([
    ["Country", "Count"],
    ["Japan", 8],
    ["Taiwan", 2],
    ["Kuwait", 4],
    ["Dubai", 2],
    ["Doha Qatar", 8],
  ]);
  var options1 = { title: "Country", width: 400, height: 300 };
  var chart1 = new google.visualization.PieChart(
    document.getElementById("piechart")
  );
  chart1.draw(data1, options1);

  // Chart 2 (example: different data or same)
  var data2 = google.visualization.arrayToDataTable([
    ["Country", "Count"],
    ["Domestic Helper", 5],
    ["Nurse", 10],
    ["Factory Worker", 6],
    ["Kitchen Staff", 4],
    ["Electrician", 7],
  ]);
  var options2 = { title: "Jobs", width: 400, height: 300 };
  var chart2 = new google.visualization.PieChart(
    document.getElementById("piechart1")
  );
  chart2.draw(data2, options2);
}
