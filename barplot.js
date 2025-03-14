d3.csv("SocialMediaAvg.csv").then(function(data) {
    data.forEach(d => d.AvgLikes = +d.AvgLikes);
    
    const margin = {top: 20, right: 30, bottom: 50, left: 60},
          width = 800 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#barplot")
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                .append("g")
                  .attr("transform", `translate(${margin.left},${margin.top})`);

    const platforms = Array.from(new Set(data.map(d => d.Platform)));
    const postTypes = Array.from(new Set(data.map(d => d.PostType)));
    
    const x0 = d3.scaleBand().domain(platforms).range([0, width]).padding(0.2);
    const x1 = d3.scaleBand().domain(postTypes).range([0, x0.bandwidth()]).padding(0.05);
    const y = d3.scaleLinear().domain([0, d3.max(data, d => d.AvgLikes)]).nice().range([height, 0]);
    const color = d3.scaleOrdinal().domain(postTypes).range(["#1f77b4", "#ff7f0e", "#2ca02c"]);
    
    svg.append("g")
       .attr("transform", `translate(0,${height})`)
       .call(d3.axisBottom(x0));
    
    svg.append("g").call(d3.axisLeft(y));
    
    const groupedData = d3.group(data, d => d.Platform);

    svg.selectAll(".platform-group")
       .data(groupedData)
       .enter().append("g")
       .attr("transform", d => `translate(${x0(d[0])}, 0)`)
       .selectAll("rect")
       .data(d => d[1])
       .enter().append("rect")
       .attr("x", d => x1(d.PostType))
       .attr("y", d => y(d.AvgLikes))
       .attr("width", x1.bandwidth())
       .attr("height", d => height - y(d.AvgLikes))
       .attr("fill", d => color(d.PostType));

    const legend = svg.append("g")
                      .attr("transform", `translate(${width - 100}, 20)`);
    
    postTypes.forEach((type, i) => {
        legend.append("rect")
              .attr("x", 0).attr("y", i * 20)
              .attr("width", 15).attr("height", 15)
              .attr("fill", color(type));
        
        legend.append("text")
              .attr("x", 20).attr("y", i * 20 + 12)
              .text(type)
              .style("font-size", "12px")
              .attr("alignment-baseline","middle");
    });
});
