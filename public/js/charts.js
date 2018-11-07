window.onload = function () {
    CanvasJS.addColorSet("greenShades",
        [ //colorSet Array
            "#7CBB00",
            "rgb(5, 96, 241)",
            "#512da8"
        ]);
    var chart = new CanvasJS.Chart("salesChartContainer", {
        //theme: "light1", // "light2", "dark1", "dark2"
        colorSet: "greenShades",
        animationEnabled: true, // change to true		
        title: {
            text: "Yearly Sales Data"
        },
        data: [{
            // Change type to "bar", "area", "spline", "pie",etc.
            type: "column",
            dataPoints: [{
                    label: "2013",
                    y: 10000
                },
                {
                    label: "2014",
                    y: 15000
                },
                {
                    label: "2015",
                    y: 25000
                },
                {
                    label: "2016",
                    y: 30000
                },
                {
                    label: "2017",
                    y: 28000
                }
            ]
        }],
        axisY: {
            prefix: "₹",
            suffix: "K"
        }
    });
    chart.render();

}