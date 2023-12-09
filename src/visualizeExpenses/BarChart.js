import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Barchart = ({ expenses }) => {
  const ref = useRef();

  useEffect(() => {
    // set the dimensions and margins of the graph
    const margin = { top: 30, right: 30, bottom: 70, left: 60 },
      width = 400 - margin.left - margin.right,
      height = 360 - margin.top - margin.bottom;

      d3.select(ref.current)
      .select('svg')
      .remove();
    // append the svg object to the body of the page
    const svg = d3
      .select(ref.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Bars
    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(expenses.map((d) => d.categoryName))
      .padding(0.2);

    svg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end');

    // Add Y axis
    const y = d3.scaleLinear().domain([0, d3.max(expenses, (d) => d.amount)]).range([height, 0]);
    svg.append('g').call(d3.axisLeft(y));

    // Bars
    svg
      .selectAll('mybar')
      .data(expenses)
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.categoryName))
      .attr('y', (d) => y(d.amount))
      .attr('width', x.bandwidth())
      .attr('height', (d) => height - y(d.amount))
      .attr('fill', '#5f0f40');
  }, [expenses]);

  return <svg width={460} height={400} id="barchart" ref={ref} />;
};

export default Barchart;
