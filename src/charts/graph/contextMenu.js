function contextMenu() {
  var height,
      width, 
      margin = 0.1, // fraction of width
      items = [], 
      rescale = false, 
      style = {
        'rect': {
          'mouseout': {
            'fill': 'rgb(244,244,244)', 
            'stroke': 'white', 
            'stroke-width': '1px'
          }, 
          'mouseover': {
            'fill': 'rgb(200,200,200)'
          }
        }, 
        'text': {
          'fill': 'steelblue', 
          'font-size': '13'
        }
      }; 
    
  function menu(x, y) {
    d3.select('.context-menu').remove();
    scaleItems();

    // Draw the menu
    d3.select('svg')
      .append('g').attr('class', 'context-menu')
      .selectAll('tmp')
      .data(items).enter()
      .append('g').attr('class', 'menu-entry')
      .style({'cursor': 'pointer'})
      .on('mouseover', function(){ 
        d3.select(this).select('rect').style(style.rect.mouseover) })
      .on('mouseout', function(){ 
        d3.select(this).select('rect').style(style.rect.mouseout) });
        
    d3.selectAll('.menu-entry')
      .append('rect')
      .attr('class', style.text)
      .attr('x', x)
      .attr('y', function(d, i){ return y + (i * height); })
      .attr('width', width)
      .attr('height', height)
      .style(style.rect.mouseout);
        
    d3.selectAll('.menu-entry')
      .append('text')
      .text(function(d){ return d; })
      .attr('x', x)
      .attr('y', function(d, i){ return y + (i * height); })
      .attr('dy', height - margin / 2)
      .attr('dx', margin)
      .style(style.text);

    d3.selectAll('.menu-entry')
      .on('click', function (d, index){ 
        var name = focused_node.name, round = focused_node.round;
        
        if (index == 0) { // Incoming Block Dist.
          if (round == 1) { alert("First round no incoming!"); return; }
          
          graphG.selectAll(".nodetexts").remove();
          d3.selectAll('.in_block_path_block').remove();
          d3.selectAll('.in_block_path').remove();
          d3.selectAll('.in_block_path_rect').remove();
          updateNodeSelection_Links(2);
/*
          selected_block = -1;
          nodes_transfer = [];
          for (var i = 0; i < max_round; i ++) 
            nodes_transfer[i] = {};
*/
          if (indistselected_nodes[round-1][name] == 1)
            indistselected_nodes[round-1][name] = 0;
          else 
            indistselected_nodes[round-1][name] = 1;

          computeInDistNodesSource();
 
          if (selected_block == -1)
            updateNodesRelated(); 
          updateInBlockPathDist(); 
          if (selected_block != -1)
            updateBlockTransfer(); // TODO
        } else if (index == 1) { // Outgoing Block Dist.
          graphG.selectAll(".nodetexts").remove();
          d3.selectAll('.block_path_block').remove();
          d3.selectAll('.block_path').remove();
          d3.selectAll('.block_path_rect').remove();
          updateNodeSelection_Links(2);
/*
          selected_block = -1;
          nodes_transfer = [];
          for (var i = 0; i < max_round; i ++) 
            nodes_transfer[i] = {};
*/
          if (outdistselected_nodes[round-1][name] == 1)
            outdistselected_nodes[round-1][name] = 0;
          else 
            outdistselected_nodes[round-1][name] = 1;

          computeOutDistNodesTarget()

          if (selected_block == -1)
            updateNodesRelated();
          updateOutBlockPathDist();
          if (selected_block != -1)
            updateBlockTransfer(); // TODO
        } else {
          graphG.selectAll(".noderects").remove();
          graphG.selectAll(".nodetexts").remove();

          d3.selectAll('.in_block_path_block').remove();
          d3.selectAll('.in_block_path').remove();
          d3.selectAll('.in_block_path_rect').remove();

          d3.selectAll('.block_path_block').remove();
          d3.selectAll('.block_path').remove();
          d3.selectAll('.block_path_rect').remove();
        
          for (var i = 0; i < max_round; i ++) {
            selected_nodes[i] = {};
            selected_nodes[i][name] = 1;

            outdistnodes_target[i] = {};
            outdistselected_nodes[i] = {};

            indistnodes_source[i] = {};
            indistselected_nodes[i] = {};
          }

          if (index == 2) { // Sources/Targets
            computeNodesSourceTarget();
            updateNodesRelated();
            updateNodeSelection_Links(2);
          } else { // 'Focused Sources/Targets'
            computeDBLNodesSourceTarget(round, name);
            updateNodesRelated(); 
            updateDBLNodeSelection_Links(round, name);
          }

          for (var i = 0; i < max_round; i ++) {
            nodes_source[i] = {};
            nodes_target[i] = {};
            selected_nodes[i] = {};
          }
        }
      });

    // Other interactions
    d3.select('body')
      .on('click', function() {
        d3.select('.context-menu').remove();
      });
  }
    
  menu.items = function(e) {
    if (!arguments.length) return items;
    for (i in arguments) items.push(arguments[i]);
    rescale = true;
    return menu;
  }

  // Automatically set width, height, and margin;
  function scaleItems() {
    if (rescale) {
      d3.select('svg').selectAll('tmp')
        .data(items).enter()
        .append('text')
        .text(function(d){ return d; })
        .style(style.text)
        .attr('x', -1000)
        .attr('y', -1000)
        .attr('class', 'tmp');
      
      var z = d3.selectAll('.tmp')[0]
                .map(function(x){ return x.getBBox(); });
      width = d3.max(z.map(function(x){ return x.width; }));
      margin = margin * width;
      width =  width + 2 * margin;
      height = d3.max(z.map(function(x){ return x.height + margin / 2; }));
            
      // cleanup
      d3.selectAll('.tmp').remove();
      rescale = false;
    }
  }

  return menu;
}