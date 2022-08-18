/* The graph is fed data about several parameters before constructing the graoh:
width -- width of browser screen
height -- height of browser screen
radius -- size of graph bubbles
renderer -- custom D3 object that renders the graph object
stage -- stage for the graph to be rendered on
lines -- individual lines to be rendered between nodes
circles -- nodes to be drawn onto the graph
color -- special style option for inner circle color
*/
const width    = viewportWidth,
      height   = viewportHeight,
      radius   = 4,
      renderer = PIXI.autoDetectRenderer(width, height, {resolution: 2}),
      stage    = new PIXI.Container(),
      lines    = new PIXI.Graphics(),
      circles  = new PIXI.Container(),
      color    = d3.scaleOrdinal(d3.schemeCategory10);
// resize checks for the current window size in case of resize'd browser 
renderer.resize(window.innerWidth-100, window.innerHeight);
// spawn location should be in central location of screen
let transform = d3.zoomIdentity.translate(width / 2, height / 2);
// simulation is the entry for the d3 renderer.
const simulation = d3.forceSimulation()
  .force('charge', d3.forceManyBody())
  .force('link',   d3.forceLink().id(d => d.id))
  .force('x',      d3.forceX())
  .force('y',      d3.forceY());

const main = () => d3.json('data.json', (error, graph) => {
  if (error) throw error;

  // appends child to newTab main list of objects
  document.body.appendChild(renderer.view);
  
  // renderer stylized options to fit with mainline CSS
  renderer.backgroundColor = 0x202023;
  renderer.backgroundAlpha = 0;
  // add nodes and lines to stage
  stage.addChild(lines);
  stage.addChild(circles);

  // for every node add options
  for (const node of graph.nodes) {
    const circle = new PIXI.Graphics();

    // draw basic nodes with edges interlinking
    circle.beginFill(Number.parseInt(color(node.user).substr(1), 16));
    circle.lineStyle(1.5, 0xffffff);
    circle.drawCircle(0, 0, radius);
    circle.endFill();

    circle.id = node.id;
    circles.addChild(circle);
  }

  const zoomed = () => {
    // transform the event with stage parameters that
    // were assigned previously
    transform = d3.event.transform;

    stage.x       = transform.x;
    stage.y       = transform.y;
    stage.scale.x = transform.k;
    stage.scale.y = transform.k;

    // request the renderer to apply the stage to the document
    requestAnimationFrame(() => renderer.render(stage));
  };

  // return simulation object given node size and positions when dragging
  const dragsubject = () => {
    return simulation
      .find(transform.invertX(d3.event.x), transform.invertY(d3.event.y), radius);
  };

  // when drag started add latency to x/y positions 
  const dragstarted = () => {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();

    d3.event.subject.fx = d3.event.subject.x;
    d3.event.subject.fy = d3.event.subject.y;
  };
  // dragged status applies transform to buffer position change
  const dragged = () => {
    d3.event.subject.fx += d3.event.dx / transform.k;
    d3.event.subject.fy += d3.event.dy / transform.k;
  };
  // end conditions for drag which release momentum from node
  const dragended = () => {
    if (!d3.event.active) simulation.alphaTarget(0);

    d3.event.subject.fx = null;
    d3.event.subject.fy = null;
  };
  // readraw function that will re-link edges to proper nodes and re-render stage properly
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
  // zoom object is some scalar factor on screen.
  const zoom = d3.zoom();
  // select the renderer to view the object and transform by
  // the appropriate zoom
  d3.select(renderer.view)
    .call(d3.drag()
      .subject(dragsubject)
      .on('start', dragstarted)
      .on('drag',  dragged)
      .on('end',   dragended))
    .call(zoom.on('zoom', zoomed))
    .call(zoom.transform, transform);
});
// add event listener for D3 functionality to main page
document.addEventListener('DOMContentLoaded', main);