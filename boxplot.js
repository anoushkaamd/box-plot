const margin = { top: 40, right: 30, bottom: 50, left: 60 },
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

const svg = d3.select("#boxplot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

d3.csv("data/socialMedia 2.csv").then(data => {
    data.forEach(d => d.Likes = +d.Likes);
    const platforms = Array.from(new Set(data.map(d => d.Platform)));
    const quartilesByPlatform = d3.rollup(data, v => {
        const sorted = v.map(d => d.Likes).sort(d3.ascending);
        const q1 = d3.quantile(sorted, 0.25);
        const median = d3.quantile(sorted, 0.5);
        const q3 = d3.quantile(sorted, 0.75);
        return { q1, median, q3, min: d3.min(sorted), max: d3.max(sorted) };
    }, d => d.Platform);

    const xScale = d3.scaleBand()
        .domain(platforms)
        .range([0, width])
        .padding(0.4);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Likes)])
        .nice()
        .range([height, 0]);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .call(d3.axisLeft(yScale));

    quartilesByPlatform.forEach((q, platform) => {
        const x = xScale(platform);
        const boxWidth = xScale.bandwidth();

        svg.append("line")
            .attr("x1", x + boxWidth / 2)
            .attr("x2", x + boxWidth / 2)
            .attr("y1", yScale(q.min))
            .attr("y2", yScale(q.max))
            .attr("stroke", "black");

        svg.append("rect")
            .attr("x", x)
            .attr("y", yScale(q.q3))
            .attr("width", boxWidth)
            .attr("height", yScale(q.q1) - yScale(q.q3))
            .attr("fill", "lightblue")
            .attr("stroke", "black");

        svg.append("line")
            .attr("x1", x)
            .attr("x2", x + boxWidth)
            .attr("y1", yScale(q.median))
            .attr("y2", yScale(q.median))
            .attr("stroke", "black");
    });
});
