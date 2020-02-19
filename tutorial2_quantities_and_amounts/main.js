// data load
// reference for d3.autotype: https://github.com/d3/d3-dsv#autoType
d3.csv("data.csv", d3.autoType).then(data => {
  console.log(data);

  // data.sort((first, second) => first.count - second.count)
  data.sort((first, second) => d3.descending(first.Goals, second.Goals))
  /** CONSTANTS */
  // constants help us reference the same values throughout our code
  const width = window.innerWidth,
      height = window.innerHeight,
      paddingInner = 0.2,
      paddingOuter = 0.2,
      margin = { top: 2, bottom: 50, left: 151, right: 170 };

  /** SCALES */
  // reference for d3.scales: https://github.com/d3/d3-scale
  const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.Goals)])
      .range([margin.left, width - margin.right])

  console.log(xScale)

  const yScale = d3
      .scaleBand()
      .domain(data.map(d => d.Player))
      .range([margin.top, height - margin.bottom]) // range!!!! might be changed
      .paddingInner(paddingInner)
      .paddingOuter(paddingOuter);


  // reference for d3.axis: https://github.com/d3/d3-axis
  const yAxis = d3
      .axisLeft(yScale)
      .ticks(data.length)
      ;

  const xAxis = d3
      .axisBottom(xScale)
  //.ticks(data.length);

  /** MAIN CODE */
  const svg = d3

      .select("#d3-container")
      .append("svg")
      .attr("width", width)
      .attr("height", height)

  //.attr("color", color = ['#0000b4', 'black', '#0094ff', '#0d4bcf', '#0066AE']);
  const colorScale = d3.scaleLinear().domain([0, d3.max(data, d => d.Goals) + 1]).range(["white", "steelblue"])

  // append rects
  const rect = svg
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("y", function (d) {
          return yScale(d.Player);
      })
      .attr("x", margin.left)
      .attr("width", d => xScale(d.Goals))
      .attr("height", yScale.bandwidth())
      //.attr("fill", (d,i) => colorScale.range()[(data.length + 1)- (i+1) ])
      .attr("fill", d => colorScale(d.Goals))
  //.attr("fill", "teal")
  //const color = d3.scaleBand().range['#0000b4', 'black', '#0094ff', '#0d4bcf', '#0066AE']
  //const colorScale = d3.scaleLinear().domain([0, d3.max(data, d => d.count) + 30]).range(["teal", "blue"])

  //.attr(colors = ['#0000b4', '#0082ca', '#0094ff', '#0d4bcf', '#0066AE']);

  // append text
  const text = svg
      .selectAll("text")
      .data(data)
      .join("text")
      .attr("class", "label")
      // this allows us to position the text in the center of the bar
      .attr("y", d => yScale(d.Player))
      //.text(d => d.activity)
      .attr("x", d => xScale(d.Goals))


      .text(d => d.Goals)
      .attr("dy", "1.7em")
  //.attr("dx", "-.8");

  svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(150,1)`)
      .call(yAxis);

  svg
      .append("g")
      .attr("class", "axis") // .attr("class, "axis") - x axis shows up on the top
  // .attr("transform", 'translate(0,0)')
  //.call(xAxis);
});
