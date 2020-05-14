//Define the svg area, margins and chart area
var svgWidth = 1050;
var svgHeight = 760;

var plotMargins = {
    top: 100,
    right: 80,
    bottom: 80,
    left: 100
};
//define the actual margins
var plotWidth = svgWidth - plotMargins.left - plotMargins.right;
var plotHeight = svgHeight - plotMargins.top - plotMargins.bottom;

//append the scatter id and define the dimensions
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

//append a group and translate based on the plotMargins
var plotGroup = svg.append("g")
    .attr("transform",`translate(${plotMargins.left}, ${plotMargins.top})`);

// Read the CSV file and store the data
d3.csv("assets/data/data.csv").then(function(csvData) {
    console.log(csvData);

    //convert the poverty and obesity in to a numeric value
    csvData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.obesity = +data.obesity;
        data.abbr = data.abbr;
        //console.log("Poverty:", data.poverty);
        //console.log("Obesity:", data.obesity);
    });
    //liner scale
    var xScale = d3.scaleLinear()
        .domain(csvData.map(d => d.poverty))
        .range([0, plotWidth]);
        //.padding(0.05);

    //linear scale
    var yScale = d3.scaleLinear()
        .domain([20, d3.max(csvData, d => d.obesity)]) 
        .range([plotHeight, 0]);

    //pass scales to axes in argument
    var yAxis = d3.axisLeft(yScale);
    var xAxis = d3.axisBottom(xScale);

    //add the axis elements to the svg group 
    plotGroup.append("g")
            .classed("axis", true)
            .call(yAxis);

    plotGroup.append("g")
        .attr("transform", `translate(0, ${plotHeight})`)
        .call(xAxis);


// append circles to the svg area
plotGroup.selectAll("circle")
    .data(csvData)
    .enter()
    .append("circle")
    .attr("class", "stateCircle")
    .attr("cx", d => xScale(d.poverty))
    .attr("cy", d => yScale(d.obesity))
    .attr("r", 15) //radius of the circle
    .attr("opacity", "0.5");
    

//append the svg to include the state text to the circle
plotGroup.append("g").selectAll("circle")
    .data(csvData)
    .enter()
    .append("text")
    .text(d => d.abbr)
    .attr("class", ".stateText")
    .attr("x", d => xScale(d.poverty))
    .attr("y", d => yScale(d.obesity))
    .attr("dy", ".21em");

//add labels  http://bl.ocks.org/weiglemc/6185069
plotGroup.append("text")
.attr("class", "label")
.attr("transform", "rotate(-90)")
.attr("x", -180)
.attr("y", -40)
.attr("dy", "1em")
.attr("class", "yAxisText")
.style("fill", "black")
.text("Obesity %");  

plotGroup.append("text")
    .attr("transform", `translate(${svgWidth / 2} + ${svgHeight + plotMargins.top + 40})`)
    .attr("class", "xAxisText")
    .attr("x", 0)
    .attr("y", 625)
    .text("In Poverty %");

}).catch(function(error) { 
    console.log(error);
});