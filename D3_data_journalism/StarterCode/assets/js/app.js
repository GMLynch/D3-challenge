//Define the svg area, margins and chart area
var svgWidth = 960;
var svgHeight = 650;

var plotMargins = {
    top:30,
    right: 30,
    bottom: 30,
    left: 30
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

    // //log a list of states
    // var states = csvData.map(data => data.abbr);
    // console.log("states", states);

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

    //linear scale
    var yScale = d3.scaleLinear()
        .domain([20, d3.max(csvData, d => d.obesity)])
        .range([plotHeight, 0]);

    //pass scales in argument
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale).ticks(10);


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
    .attr("dy", -360);

//add labels
    

}).catch(function(error) { 
    console.log(error);
});