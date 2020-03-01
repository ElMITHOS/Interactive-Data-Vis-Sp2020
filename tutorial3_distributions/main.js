/**This scatterplot shows the players that have scored the most in the History of the World Cup as in my bar chart,
 * but this time, the graph included the country to which each player bolongs to and the average goals per match played. 
 * The Accidents Data graph Would have the "Hour" on the yAxis and the Number of "Crashes" on the xAxis,
 * (the sum of the Count during an hour).
 *  * The dropdown should show the list of the different causes of crashes.
 * The viewer would then be able to see at what time certain causes of crashes occured.
 * Then add another dropdown to select a different date or a different Team too* 
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 },
  radius = 17;

/** these variables allow us to access anything we manipulate in
 * All these variables are empty before we assign something to them.*/
let svg;
let xScale;
let yScale;

/**
 * APPLICATION STATE
 * */
let state = {
  data: [],
  selectedTeam: "All",
};

/**
 * LOAD DATA
 * */
d3.csv("TopStrikers.csv", d3.autoType).then(raw_data => {
  console.log("raw_data", raw_data);
  state.data = raw_data;
  init();
});

/**
 * INITIALIZING FUNCTION
 * this will be run *one time* when the data finishes loading in
 * */
function init() {
  // SCALES
  xScale = d3
    .scaleLinear()
    .domain(d3.extent(state.data, d => d.MatchesPlayed))
    .range([margin.left, width - margin.right]);

  yScale = d3
    .scaleLinear()
    .domain(d3.extent(state.data, d => d.Goals))
    .range([height - margin.bottom, margin.top]);

  // AXES
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  // UI ELEMENT SETUP
  // add dropdown (HTML selection) for interaction
  // HTML select reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
  const selectElement = d3.select("#dropdown").on("change", function() {
    console.log("new selected Team is", this.value);
    // `this` === the selectElement
    // this.value holds the dropdown value a user just selected
    state.selectedTeam = this.value;
    draw(); // re-draw the graph based on this new selection
  });

  // add in dropdown options from the unique values in the data
  selectElement
    .selectAll("option")
    .data(["All", "Argentina", "Austria", "Brazil", "Bulgaria", "Colombia", "Croatia", "Czechoslovakia",
    "England", "France", "Germany", "Ghana", "Hungary", "Italy", "Netherlands",
    "Peru", "Poland", "Portugal", "Russia", "Spain", "Switzerland", "Uruguay", "West Germany"
    ]) // unique data values-- (hint: to do this programmatically take a look `Sets`)
    .join("option")
    .attr("value", d => d)
    .text(d => d);

  // create an svg element in our main `d3-container` element
  svg = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // add the xAxis
  svg
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("x", "50%")
    .attr("dy", "3em")
    .text("Matches Played");

  // add the yAxis
  svg
    .append("g")
    .attr("class", "axis y-axis")
    .attr("transform", `translate(${margin.left},0)`,)
    .call(yAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("y", "50%")
    .attr("dx", "-3em")
    .attr("writing-mode", "vertical-rl")
    .text("Goals")

  draw(); // calls the draw function
}

/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */
function draw() {
  // filter the data for the selectedParty
  let filteredData = state.data;
  // if there is a selectedParty, filter the data before mapping it to our elements
  if (state.selectedTeam !== "All") {
    filteredData = state.data.filter(d => d.Team === state.selectedTeam);
  }

  const dot = svg
    .selectAll(".dot")
    .data(filteredData, d => d.Player) // use `d.name` as the `key` to match between HTML and data elements
    .join(
      enter =>
        // enter selections -- all data elements that don't have a `.dot` element attached to them yet
        enter
          .append("circle")
          .attr("class", "dot") // Note: this is important so we can identify it in future updates
          .attr("stroke", "lavenderblush")
          .attr("opacity", 0.7)
          .attr("fill", d => {
            if (d.Team === "Argentina") return "Steelblue";
            else if (d.Team === "Austria") return "HotPink";
            else if (d.Team === "Brazil") return "Limegreen";
            else if (d.Team === "Bulgaria") return "Darkred";
            else if (d.Team === "Colombia") return "Yellow";
            else if (d.Team === "Croatia") return "Pink";
            else if (d.Team === "Czechoslovakia") return "Aquamarine";
            else if (d.Team === "England") return "DeepPink";
            else if (d.Team === "France") return "Blue";
            else if (d.Team === "Germany") return "Black";
            else if (d.Team === "Ghana") return "DarkGreen";
            else if (d.Team === "Hungary") return "DeepGreen";
            else if (d.Team === "Italy") return "Green";
            else if (d.Team === "Netherlands") return "PaleVioletRed";
            else if (d.Team === "Peru") return "Red";
            else if (d.Team === "Poland") return "GreenYellow";
            else if (d.Team === "Portugal") return "Crimson";
            else if (d.Team === "Russia") return "LightBlue";
            else if (d.Team === "Spain") return "Orange";
            else if (d.Team === "Switzerland") return "Tomato";
            else if (d.Team === "Uruguay") return "LightBlue";
            else return "Grey";
          })
          .attr("r", radius)
          .attr("cy", d => yScale(d.Goals))
          .attr("cx", d => margin.left) // initial value - to be transitioned
          .call(enter =>
            enter
              .transition() // initialize transition
              .delay(d => 150 * d.MatchesPlayed) // delay on each element
              .duration(150) // duration 500ms
              .attr("cx", d => xScale(d.MatchesPlayed))
          ),
      update =>
        update.call(update =>
          // update selections -- all data elements that match with a `.dot` element
          update
            .transition()
            .duration(250)
            .attr("stroke", "black")
            .transition()
            .duration(250)
            .attr("stroke", "lightgrey")
        ),
      exit =>
        exit.call(exit =>
          // exit selections -- all the `.dot` element that no longer match to HTML elements
          exit
            .transition()
            .delay(d => 50 * d.MatchesPlayed)
            .duration(400)
            .attr("cx", width)
            .remove()
        )
    );
}