import React, { useEffect } from 'react';
import * as d3 from 'd3';

function BubbleChart(props) {
  const { expenses, width, height, maxRadius } = props;

  useEffect(() => {
    drawChart();
  }, [expenses]);

  function drawChart() {
    // Remove the old svg
    d3.select('#bubble-container')
      .select('svg')
      .remove();

    // Create new svg
    const svg = d3
      .select('#bubble-container')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Calculate the maximum amount for scaling the radius
    const maxAmount = d3.max(expenses, d => d.amount);

    // Scale for mapping the amount to radius
    const radiusScale = d3
      .scaleLinear()
      .domain([0, maxAmount])
      .range([0, maxRadius]);

    // Initialize the simulation with the expenses array
    const simulation = d3
      .forceSimulation(expenses)
      .force('charge', d3.forceManyBody().strength(5))
      .force('x', d3.forceX().x(width / 2).strength(0.1))
      .force('y', d3.forceY().y(height / 2).strength(0.1))
      .force('collision', d3.forceCollide().radius(d => radiusScale(d.amount)))
      .on('tick', ticked);

      console.log(expenses)
    function ticked() {
      // Update the positions of the circles during each tick of the simulation
      svg.selectAll('.bubble')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
      svg.selectAll('.bubble-label')
        .attr('x', (d) => d.x)
        .attr('y', (d) => d.y)
        .text((d) => d.categoryName);
    }

    const bubbles = svg
      .selectAll('.bubble')
      .data(expenses)
      .enter()
      .append('circle')
      .attr('class', 'bubble')
      .attr('r', d => radiusScale(d.amount))
      .style('fill', 'blue'); // You can customize the fill color based on your data

    bubbles
      .append('title')
      .text(d => `${d.categoryName}\nAmount: ${d.amount}`);
    
    svg.selectAll('.bubble-label')
      .data(expenses)
      .enter()
      .append('text')
      .attr('class', 'bubble-label')
      .text((d) => d.categoryName)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .style('fill', 'black')
      .style('font-size', '14px');
  }

  return <div id="bubble-container" />;
}

export default BubbleChart;
