// Random data for the bar chart
const data = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100));

// Set up chart dimensions
const margin = { top: 20, right: 30, bottom: 40, left: 40 };
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create the SVG canvas
const svg = d3
  .select("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// X and Y scales
const x = d3
  .scaleBand()
  .domain(d3.range(data.length))
  .range([0, width])
  .padding(0.1);

const y = d3
  .scaleLinear()
  .domain([0, d3.max(data)])
  .nice()
  .range([height, 0]);

// X axis
svg
  .append("g")
  .attr("class", "x-axis")
  .attr("transform", `translate(0,${height})`)
  .call(d3.axisBottom(x).tickFormat((i) => `Item ${i + 1}`));

// Y axis
svg.append("g").attr("class", "y-axis").call(d3.axisLeft(y));

// Create bars but set initial height to zero (invisible)
const bars = svg
  .selectAll(".bar")
  .data(data)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("x", (d, i) => x(i))
  .attr("y", height)
  .attr("width", x.bandwidth())
  .attr("height", 0);

// Set up Scrollama instance
const scroller = scrollama();

function handleStepEnter(response) {
  const step = response.index;

  // Animate only the bar corresponding to the current step
  if (step >= 0 && step < data.length) {
    bars
      .filter((d, i) => i === step) // Select only the bar for the current step
      .transition()
      .duration(400)
      .attr("y", (d) => y(d))
      .attr("height", (d) => height - y(d));
  }
}

function handleStepExit(response) {
  const step = response.index;

  // Reset the bar when scrolling up, only for the current step
  if (response.direction === "up" && step >= 0 && step < data.length) {
    bars
      .filter((d, i) => i === step) // Select only the bar for the current step
      .transition()
      .duration(400)
      .attr("y", height)
      .attr("height", 0);
  }
}

// Initialize the Scrollama instance
scroller
  .setup({
    step: ".step",
    offset: 0.3,
    debug: false,
  })
  .onStepEnter(handleStepEnter)
  .onStepExit(handleStepExit);

// Resize handler
window.addEventListener("resize", scroller.resize);
