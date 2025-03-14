const marginBar = { top: 40, right: 30, bottom: 50, left: 60 },
    widthBar = 800 - marginBar.left - marginBar.right,
    heightBar = 500 - marginBar.top - marginBar.bottom;

const svgBar = d3.select("#barplot")
    .append("svg")
    .attr("width", widthBar + marginBar.left + marginBar.right)
    .attr("height", heightBar + marginBar.top + marginBar.bottom)
    .append("g")
    .attr("transform", `translate(${marginBar.left},${marginBar.top})`);

d3.csv("data/SocialMediaAvg.csv").then(data => {
    data.forEach(d => d.AvgLikes = +d.AvgLikes);
    const x0Scale = d3.scaleBand()
        .domain([...new Set(data.map(d => d.Platform))])
        .range([0, widthBar])
        .padding(0.2);

    const x1Scale = d3.scaleBand()
        .domain([...new Set(data.map(d => d.PostType))])
        .range([0, x0Scale.bandwidth()])
        .padding(0.05);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.AvgLikes)])
        .nice()
        .range([heightBar, 0]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    svgBar.append("g")
        .attr("transform", `translate(0,${heightBar})`)
        .call(d3.axisBottom(x0Scale));

    svgBar.append("g")
        .call(d3.axisLeft(yScale));

    const platformGroups = svgBar.selectAll(".platform-group")
        .data(d3.group(data, d => d.Platform))
        .enter().append("g")
        .attr("transform", d => `translate(${x0Scale(d[0])},0)`);

    platformGroups.selectAll("rect")
        .data(d => d[1])
        .enter().append("rect")
        .attr("x", d => x1Scale(d.PostType))
        .attr("y", d => yScale(d.AvgLikes))
        .attr("width", x1Scale.bandwidth())
        .attr("height", d => heightBar - yScale(d.AvgLikes))
        .attr("fill", d => colorScale(d.PostType));
});
