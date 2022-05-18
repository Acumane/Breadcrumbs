const width    = viewportWidth,
      height   = viewportHeight,
      radius   = 4,
      renderer = PIXI.autoDetectRenderer(width-100, height, { autoResize: true, resolution: 2, }),
      stage    = new PIXI.Container(),
      lines    = new PIXI.Graphics(),
      circles  = new PIXI.Container(),
      color    = d3.scaleOrdinal(d3.schemeCategory10);

// spawn location
let transform = d3.zoomIdentity.translate(width / 2, height / 2);

const simulation = d3.forceSimulation()
  .force('charge', d3.forceManyBody())
  .force('link',   d3.forceLink().id(d => d.id))
  .force('x',      d3.forceX())
  .force('y',      d3.forceY());

const main = () => d3.json('data.json', (error, graph) => {
  if (error) throw error;

  document.body.appendChild(renderer.view);
  
  
  renderer.autoResize      = true;
  renderer.backgroundColor = 0x202023;

  stage.addChild(lines);
  stage.addChild(circles);

  for (const node of graph.nodes) {
    const circle = new PIXI.Graphics();

    circle.beginFill(Number.parseInt(color(node.user).substr(1), 16));
    circle.lineStyle(1.5, 0xffffff);
    circle.drawCircle(0, 0, radius);
    circle.endFill();

    circle.id = node.id;
    circles.addChild(circle);
  }

  const zoomed = () => {
    transform = d3.event.transform;

    stage.x       = transform.x;
    stage.y       = transform.y;
    stage.scale.x = transform.k;
    stage.scale.y = transform.k;

    requestAnimationFrame(() => renderer.render(stage));
  };

  const dragsubject = () => {
    return simulation
      .find(transform.invertX(d3.event.x), transform.invertY(d3.event.y), radius);
  };

  const dragstarted = () => {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();

    d3.event.subject.fx = d3.event.subject.x;
    d3.event.subject.fy = d3.event.subject.y;
  };

  const dragged = () => {
    d3.event.subject.fx += d3.event.dx / transform.k;
    d3.event.subject.fy += d3.event.dy / transform.k;
  };

  const dragended = () => {
    if (!d3.event.active) simulation.alphaTarget(0);

    d3.event.subject.fx = null;
    d3.event.subject.fy = null;
  };

  const redraw = () => requestAnimationFrame(() => {
    lines.clear();
    lines.lineStyle(1, 0x999999, 0.6);

    for (const link of graph.links) {
      lines.moveTo(link.source.x, link.source.y);
      lines.lineTo(link.target.x, link.target.y);
    }

    renderer.render(stage);
  });

  simulation
    .on('tick.redraw', redraw)
    .nodes(circles.children)
    .force('link').links(graph.links);

  const zoom = d3.zoom();

  d3.select(renderer.view)
    .call(d3.drag()
      .subject(dragsubject)
      .on('start', dragstarted)
      .on('drag',  dragged)
      .on('end',   dragended))
    .call(zoom.on('zoom', zoomed))
    .call(zoom.transform, transform);
});

document.addEventListener('DOMContentLoaded', main);