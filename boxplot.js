d3.csv("socialMedia 2.csv").then(function(data) {
  
    data.forEach(d => d.Likes = +d.Likes);
    

    const margin = {top: 20, right: 30, bottom: 40, left: 50},
          width = 800 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#boxplot")
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                .append("g")
                  .attr("transform", `translate(${margin.left},${margin.top})`);


    const platforms = Array.from(new Set(data.map(d => d.Platform)));
    const xScale = d3.scaleBand().domain(platforms).range([0, width]).padding(0.5);
    const yScale = d3.scaleLinear().domain([0, d3.max(data, d => d.Likes)]).nice().range([height, 0]);
    
    svg.append("g")
       .attr("transform", `translate(0,${height})`)
       .call(d3.axisBottom(xScale));
    
    svg.append("g").call(d3.axisLeft(yScale));

    const rollupFunction = v => {
        v.sort((a, b) => a.Likes - b.Likes);
        const q1 = d3.quantile(v.map(d => d.Likes), 0.25);
        const median = d3.quantile(v.map(d => d.Likes), 0.5);
        const q3 = d3.quantile(v.map(d => d.Likes), 0.75);
        const min = d3.min(v, d => d.Likes);
        const max = d3.max(v, d => d.Likes);
        return { q1, median, q3, min, max };
    };
    
    const quartilesByPlatform = d3.rollup(data, rollupFunction, d => d.Platform);

    quartilesByPlatform.forEach((quartiles, platform) => {
        const x = xScale(platform);
        const boxWidth = xScale.bandwidth();

        svg.append("line")
           .attr("x1", x + boxWidth / 2).attr("x2", x + boxWidth / 2)
           .attr("y1", yScale(quartiles.min)).attr("y2", yScale(quartiles.max))
           .attr("class", "whisker");

        svg.append("rect")
           .attr("x", x).attr("y", yScale(quartiles.q3))
           .attr("width", boxWidth)
           .attr("height", yScale(quartiles.q1) - yScale(quartiles.q3))
           .attr("class", "box");
        

        svg.append("line")
           .attr("x1", x).attr("x2", x + boxWidth)
           .attr("y1", yScale(quartiles.median)).attr("y2", yScale(quartiles.median))
           .attr("class", "median");
    });
});
