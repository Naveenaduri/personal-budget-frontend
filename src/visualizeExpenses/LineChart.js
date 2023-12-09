import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const LineChart = ({ expenses }) => {
  const [data, setData] = useState(expenses);

  const svgRef = useRef();

  useEffect(() => {
    // Clear existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    // setting up svg
    const w = 360;
    const h = 200;
    const svg = d3
      .select(svgRef.current)
      .attr("width", w)
      .attr("height", h)
      .style("overflow", "visible")
      .style("background", "#c5f6fa");

    // setting the scale
    // x scales
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.categoryName))
      .range([0, w]);

    // y scales
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.amount)])
      .range([h, 0]);

    // Setup functions to draw Lines
    const generateScaledLine = d3
      .line()
      .x((d) => xScale(d.categoryName) + xScale.bandwidth() / 2)
      .y((d) => yScale(d.amount))
      .curve(d3.curveCardinal);

    // setting the axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).ticks(7);

    svg.append("g").call(xAxis).attr("transform", `translate(0,${h})`);
    svg.append("g").call(yAxis);

    // setting up the data for the svg
    svg
      .selectAll(".line")
      .data([data])
      .join("path")
      .attr("d", (d) => generateScaledLine(d))
      .attr("fill", "none")
      .attr("stroke", "black");
  }, [data, expenses]);

  // Update data when expenses prop changes
  useEffect(() => {
    setData(expenses);
  }, [expenses]);

  return (
    <div>
      <svg ref={svgRef} style={{ margin: "20px", display: "block" }}></svg>
    </div>
  );
};

export default LineChart;
