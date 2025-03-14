const marginLine = { top: 40, right: 30, bottom: 50, left: 60 },
    widthLine = 800 - marginLine.left - marginLine.right,
    heightLine = 500 - marginLine.top - marginLine.bottom;

const svgLine = d3.select("#lineplot")
    .append("svg")
    .attr("width", widthLine + marginLine.left + marginLine.right)
    .attr("height", heightLine + marginLine.top + marginLine.bottom)
    .append("g")
    .attr("transform", `translate(${marginLine.left},${marginLine.top})`);

d3.csv("data/SocialMediaTime.csv").then(data => {
    data.forEach(d => {
        d.AvgLikes = +d.AvgLikes;
        d.Date = new Date(d.Date.split(' ')[0]);
    });

    const xScale = d3.scaleTime()
        .domain(d3.extent(data, d => d.Date))
        .range([0, widthLine]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.AvgLikes)])
        .nice()
        .range([heightLine, 0]);

    svgLine.append("g")
        .attr("transform", `translate(0,${heightLine})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%m/%d")))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-25)");

    svgLine.append("g")
        .call(d3.axisLeft(yScale));

    const line = d3.line()
        .x(d => xScale(d.Date))
        .y(d => yScale(d.AvgLikes))
        .curve(d3.curveNatural);

    svgLine.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);
});
