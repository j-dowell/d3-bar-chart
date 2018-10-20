// Helper function to return correct year and quarter, given a date
const dateFormatter = (date) => {
  const year = date.substring(0, 4);
  const month = Number(date.substring(5, 7));
  let quarter;
  if (month < 4)
    quarter = 1;
  else if (month < 7)
    quarter = 2;
  else if (month < 10)
    quarter = 3;
  else if (month < 13)
    quarter = 4;
  return `${year} Q${quarter}`;
}

// Make the bar chart 
document.addEventListener('DOMContentLoaded', () => {
  // Retreiving data on page load
  req = new XMLHttpRequest();
  req.open(
    "GET",'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json',
    true
  );
  req.send();
  req.onload = () => {
    json = JSON.parse(req.responseText);

    const dataset = json.data;
    // SVG dimensions
    const padding = 50;
    const w = 1500 - padding;
    const h = 750 - padding;
    
    // Setting x and y scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(dataset, d => new Date(d[0]) ))
      .range([0, w - padding]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(dataset, d => d[1])])
      .range([h, 0 + padding]);
    
    // Tooltip
    const div = d3.select("body")
      .append("div")	
      .attr("class", "tooltip")				
      .style("opacity", 0)
    
    const svg = d3.select("body")
      .append("svg")
      .attr("width", w )
      .attr("height", h )
      .attr('class', 'svg-container');
    
    svg.selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr('class', 'bar')
      .attr("x", (d, i) => padding +  xScale(new Date(d[0])))
      .attr("y", (d, i) => yScale(d[1]) - padding)
      .attr("width", 5)
      .attr("height", (d, i) => h - yScale(d[1]))
      .attr("fill", "navy")
      // Display tooltip on hover
      .on("mouseover", d => {		
        div.transition()
          .duration(100)		
          .style("opacity", .9);		
        div.html(`
          ${dateFormatter(d[0])}
          <br/>
          $${d[1].toLocaleString()} billion
        `)
          .style("left", (d3.event.pageX) + "px")		
          .style("top", (d3.event.pageY) + "px");	
      })
      .on("mouseout", d => {		
        div.transition()
          .duration(100)		
          .style("opacity", 0);	
      });
      
      // X and Y axis setup
      const yAxis = d3.axisLeft(yScale)
      const xAxis = d3
        .axisBottom(xScale)
        .tickFormat(d3.timeFormat("%Y"))
      
      // Adding axes
      svg.append("g")
        .attr("transform", `translate(${padding}, ${-padding})`)
        .attr("class","axis")
        .attr("id","y-axis")
        .call(yAxis)
          
      svg.append("g")
        .attr("class","axis")
        .attr("id", "x-axis")
        .attr("transform", `translate(${padding}, ${(h - padding)})`)
        .call(xAxis)
        .selectAll('text')
      
      // Axis titling
      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -padding)
        .attr("x",0 - (h / 2))
        .attr("dy", "1em")
        .attr('class', 'axis-label')
        .style("text-anchor", "middle")
        .text("USD/Billions");   

        svg.append("text")             
          .attr("transform",`translate(${w/2}, ${h + 20})`)
          .attr('class', 'axis-label')
          .style("text-anchor", "middle")
          .text("Year")
      }
})