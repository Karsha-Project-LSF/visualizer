


/**
 * this will identify the quarter sustained links
 * */
function QuarterGraphSustained(nodes,file,svg1,width,height){
	
	var linkedByIndex = {};
	var color = d3.scale.category10();		
	
	d3.select("svg").remove();
	var svg = d3.select(svg1).append("svg").attr("width", width).attr("height", height);

var force = d3.layout.force()
    .gravity(.15)
    .distance(350)
    .charge(-350)
    .size([width, height]);
    
 //input to the file name which is taken previously
 
d3.json(file, function(error, json) {
  force
      .nodes(nodes)
      .links(json.links.filter(function(d){return d.type == "sustained"})) // this filter only edge type "sustained" from json.links()
      .on("tick", tick)
      .start();
 
  
   svg.selectAll(".link")
      .data(json.links)
    .enter().append("line");
      //.attr("class", "link");
      
 var arrow_head = svg.append("svg:defs").selectAll("marker")
    .data(["end"])      // Different link/path types can be defined here
  .enter().append("svg:marker")    // This section adds in the arrows
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", -1.5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
  .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");
 

      
      
  var path = svg.append("svg:g").selectAll("path")
    .data(force.links())
  .enter().append("svg:path")	
	.attr("class", "linkSustain") 
	.on("mouseover", mOver)
  	.on("mouseout", mOut) 
  	//.attr("marker-end", "url(#end)")
  	.attr("id",function(d,i) { return i; }); // assign id for each link/path
  	   
  
  var node = svg.selectAll(".node")
      .data(force.nodes())
    .enter().append("g")
      .attr("class", "node")
      .style("fill", function(d) { return color(d.group); })
      //.on("click",click)
      //.on("dblclick", dblclick)
       .on("mouseover", mouseOver(.001))
      .on("mouseout", mouseOut(1))
      .call(force.drag);

  node.append("circle")
      .attr("r",8);

  node.append("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text(function(d) { return d.name;});

json.links.forEach(function(d) {
//alert(d.source.index + "," + d.target.index);
  linkedByIndex[d.source.index + "," + d.target.index] = 1;
});
 
    function tick() {
    path.attr("d", function(d) {

	
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + 
            d.source.x + "," + 
            d.source.y + "A" + 
            dr + "," + dr + " 0 0,1 " + 
            d.target.x + "," + 
            d.target.y;
		
   });

    node
        .attr("transform", function(d) { 
  	    return "translate(" + d.x + "," + d.y + ")"; });
}

    //adding label to edge
    var linktext = svg.append("svg:g").selectAll("g.linklabelholder").data(force.links());
    
function mOver(d){
	//d3.selectAll($("#" + d.id)).style("stroke", "red");
	
	d3.select(this)
	.style("stroke-width", "5px")
		.style("stroke", "green")
		.attr("marker-end", "url(#end)");

	//appending label to edge in what quarters this edge has been appeared.
linktext.enter().append("g").attr("class", "linklabelholder").append("text")
	   .attr("class", "linklabel")
		 .style("font-size", "15px")
		 .style("font-weight", "bold")
	   .attr("x", "200")
		 .attr("y", "-10")
	   .attr("text-anchor", "middle")
		   .style("fill","#FF0000")
		 .append("textPath")
	  .attr("xlink:href","#"+this.id)
	   .text(function(d) { 	//making string for appending for label. "Q1","Q2".	
		   var ar=[];		   
		   		if(d.Q1 == "1"){
		   			ar.push("Q1");
		   		}if(d.Q2 == "1"){
		   			ar.push("Q2");
		   		}if(d.Q3 == "1"){
		   			ar.push("Q3");
		   		}if(d.Q4 == "1"){
		   			ar.push("Q4");
		   		}
		   		
		   		if(ar.length == 1){
		   			return ar[0];
		   		}else if(ar.length == 2){
		   			return ar[0]+","+ar[1];
		   		}		   		
		 });

	//alert(d.source.index);

d3.select(this.source).select("circle").transition()
.duration(750)
.attr("r", 25)
.style("fill", function(d) { return color(d.group); });	
}
    
function mOut(d){
	d3.select(this)
	    .style("stroke-width","1.5px")
		.style("stroke","#0066FF")
		.attr("marker-end", "url(#)");
	
	svg.selectAll("g.linklabelholder").remove();
}

function mouseOver(opacity) {
    return function(d) {
    	node.style("stroke-opacity", function(o) {
            thisOpacity = isConnected(d, o) ? 1 : opacity;
            this.setAttribute('fill-opacity', thisOpacity);
            return thisOpacity;
        });

        path.style("stroke-opacity", function(o) {
            return o.source === d || o.target === d ? 1 : opacity;                
        });

       path.style("stroke-dasharray",function(o){
    	   if(o.source === d){
    		   return "5, 5";
    	   }
       });

       arrow_head.style("opacity",function(o){
            thisOpacity = isConnected(d, o) ? 1 : opacity;
            this.setAttribute('fill-opacity', thisOpacity);
            return thisOpacity;
        });
       
       d3.select(this).select("text").transition()
       .duration(500)
       .style("fill", "black")
       .style("stroke", "lightsteelblue")
       .style("stroke-width", ".5px")
       .style("font", "20px sans-serif");
   d3.select(this).select("circle").transition()
       .duration(750)
       .attr("r", 25)
       .style("fill", function(d) { return color(d.group); });										        
    };
}

function mouseOut(opacity) {
    return function(d) {
    	 node.style("stroke-opacity", function(o) {
             thisOpacity = isConnected(d, o) ? 1 : opacity;
             this.setAttribute('fill-opacity', thisOpacity);
             return thisOpacity;
         });

         path.style("stroke-opacity", function(o) {
     //return o.source === d || o.target === d ? 1 : opacity;
             return o.source === d ? 1 : opacity;
         }); 
         
         path.style();//stroke line 

         path.style("stroke", "#0066FF");

         path.style("stroke-dasharray",0); 
         
         arrow_head.style("opacity",function(o){
             thisOpacity = isConnected(d, o) ? opacity : 1;
             this.setAttribute('fill-opacity', thisOpacity);
             return thisOpacity;
         });
         
         d3.select(this).select("circle").transition()
         .duration(750)
         .attr("r", 8)
         .style("fill", function(d) { return color(d.group); });
     d3.select(this).select("text").transition()
         .duration(750)
         .attr("x", 12)
         .style("stroke", "none")
         .style("fill", "black")
         .style("stroke", "none")
         .style("font", "10px sans-serif");
        
    };
}

function neighboring(a, b) {
  return linkedByIndex[a.index + "," + b.index];
}

function isConnected(a, b) {
//return incoming and outgoing
	return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
//return outgong
//alert(a.index + "," + b.index);
	//return linkedByIndex[a.index + "," + b.index];
	}
});

}



/**
 * this will filter the data according to attribute define in link see json data fiel
 * each edge has source,target,type,Q1,Q2,Q3,Q4,year removing element not need using 
 * js splice method
 * */
function data_set(quart,json) {
	switch (quart) {
	case 0:
		break;
    case 1:
    	for(var i = json.links.length-1; i--;){
    		if(json.links[i].Q1==0)json.links.splice(i,1);
    	}
        break;
    case 2:
    	for(var i = json.links.length-1; i--;){
    		if(json.links[i].Q2==0)json.links.splice(i,1);
    	}
        break;
    case 3:
    	for(var i = json.links.length-1; i--;){
    		if(json.links[i].Q3==0)json.links.splice(i,1);
    	}
        break;
    case 4:
    	for(var i = json.links.length-1; i--;){
    		if(json.links[i].Q4==0)json.links.splice(i,1);
    	}
        break;
    case 5:
    	for(var i = json.links.length-1; i--;){
    		if(json.links[i].year==0)json.links.splice(i,1);
    	}
    	console.log("kk ;"+json.links.length);
        break;
	}
	//alert(json.links.length);
	return json.links;
}
/**
 * this is original network graph which draw the network according to given data
 * mouse over event shows incoming and outgoing edge for mouseovered node
 * inputs are node set,link file, svg id, width and height of svg, quarter id and object
 * */
function OriginalNetworkGraph(nodes,file,svg1,width,height,quart,all_obj){
	
	/*this array used to store links as associative array*/
	var linkedByIndex = {};
	var color = d3.scale.category10();	
	//remove the previous driven svg element
	d3.select("svg").remove();
	//selecting svg object in canvas using d3
	var svg = d3.select(svg1).append("svg").attr("width", width).attr("height", height);
	
	//initiate the force layout with size and link distance
	var force = d3.layout.force()
    .gravity(.15)
    .distance(350)
    .charge(-350)
    .size([width, height]);
    
	//file is file name such as data2008.json
d3.json(file, function(error, json) {  
	force
      .nodes(nodes)
      .links(data_set(quart, json))
      .on("tick", tick)
      .start();
  
 // select all the link in the graph and append line for each link css class is link
  svg.selectAll(".link")
      .data(json.links)
    .enter().append("line")
      .attr("class", "link");
      
  // define arrow head for each link
 var arrow_head = svg.append("svg:defs").selectAll("marker")
    .data(["end"])      // Different link/path types can be defined here
  .enter().append("svg:marker")    // This section adds in the arrows
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", -1.5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
  .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");
      
     //append svg path element for each link in force links array
  var path = svg.append("svg:g").selectAll("path")
    .data(force.links()) 
  .enter().append("svg:path") // append svg path element
	.attr("class", function(d) { return "link " + d.type; })
	.on("mouseover", mOver) // if the selecting edge 
  	.on("mouseout", mOut)    // deselecting edge
	.attr("class", "link");  // css class type is link
	//.attr("marker-end", "url(#end)");

  // select all the node in the graph
  var node = svg.selectAll(".node")
      .data(force.nodes()) // node arry
    .enter().append("g") // append canvas "g" element for each node in graph
      .attr("class", "node")  // css class is  .node
      .style("fill", function(d) { return color(d.group); })
      //.on("click",click)
      //.on("dblclick", dblclick)
       .on("mouseover", mouseOver(.001)) // mouseover function of node
      .on("mouseout", mouseOut(1))       // mouseout function of node
      .call(force.drag);  // enable dragging

  node.append("circle") // append cycle for eachnode with text
      .attr("r",8);

  node.append("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text(function(d) { return d.name;});

  // iterate all the json link and put src index and trgt index in associative array manner.
json.links.forEach(function(d) {
//alert(d.source.index + "," + d.target.index);
  linkedByIndex[d.source.index + "," + d.target.index] = 1;
});
 
//curving the link 
    function tick() {
    path.attr("d", function(d) {

	
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + 
            d.source.x + "," + 
            d.source.y + "A" + 
            dr + "," + dr + " 0 0,1 " + 
            d.target.x + "," + 
            d.target.y;
		
   });

    node
        .attr("transform", function(d) { 
  	    return "translate(" + d.x + "," + d.y + ")"; });
}

    // edge mouse over function d is the current mouseover edge 
    // will call the overall_anlys
    function mOver(d){
    	d3.select(this)
    		.style("stroke-width", "5px")
    		.style("stroke", "green");
    	// fallowing js function is for edge analysis module 
    	overall_anlys(all_obj,d.source.index,d.target.index);
    	//db_overall_analysis(d.source.index,d.target.index);
    }
        
    //edge mouseout function d is the current selection
    function mOut(d){
    	d3.select(this)
    	    .style("stroke-width","1.5px") // change css style
    		.style("stroke","#666666");
    	
    }
    
    // node mouseover function  opacity is graph opacity value
function mouseOver(opacity) {
	//alert("links"+json.links.length);
	//here d is the current selected node
    return function(d) {
    	node.style("stroke-opacity", function(o) {
            thisOpacity = isConnected(d, o) ? 1 : opacity;
            this.setAttribute('fill-opacity', thisOpacity);
            return thisOpacity;
        });
    	
    	//this iterate all the link o is the edges o.source is sourde node of edge
    	//o.target node is the target node of that edge
    	// add the opacity if selected node and connected edges.
        path.style("stroke-opacity", function(o) {
            return o.source === d || o.target === d ? 1 : opacity;                
        });
        //path.style("marker-end","url(#end););

        //change the color of each path which are connected to the mouseovered node
        //if incoming edge blue
        //if outgoing edge red
        path.style("stroke",function(o){
            if (o.source === d) {
                return "blue";
            }else if (o.target === d ) {
                return "red";
            };
        });
        
        // adding arrow head for each edge 
        path.attr("marker-end",function(o){
        	if (o.source === d || o.target === d ) {
				return "url(#end)";
			}else{
				return "url(#)";
			}
        });
        
       //text transition when mouseover text wil large with node
       d3.select(this).select("text").transition()
       .duration(500)
       .style("fill", "black")
       .style("stroke", "lightsteelblue")
       .style("stroke-width", ".5px")
       .style("font", "20px sans-serif");
   d3.select(this).select("circle").transition()
       .duration(750)
       .attr("r", 25)
       .style("fill", function(d) { return color(d.group); });
        
    };
}

//node mouseout function
function mouseOut(opacity) {
    return function(d) {
    	 node.style("stroke-opacity", function(o) {
             thisOpacity = isConnected(d, o) ? 1 : opacity;
             this.setAttribute('fill-opacity', thisOpacity);
             return thisOpacity;
         });

         path.style("stroke-opacity", function(o) {
     //return o.source === d || o.target === d ? 1 : opacity;
             return o.source === d ? 1 : opacity;
         });

         path.style("stroke","#666");
         
         path.attr("marker-end","url(#)");
         
         
         d3.select(this).select("circle").transition()
         .duration(750)
         .attr("r", 8)
         .style("fill", function(d) { return color(d.group); });
     d3.select(this).select("text").transition()
         .duration(750)
         .attr("x", 12)
         .style("stroke", "none")
         .style("fill", "black")
         .style("stroke", "none")
         .style("font", "10px sans-serif");
        
    };
}

function neighboring(a, b) {
  return linkedByIndex[a.index + "," + b.index];
}

//checking node a and node b is in the array
function isConnected(a, b) {
//return incoming and outgoing
	return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
//return outgong
//alert(a.index + "," + b.index);
	//return linkedByIndex[a.index + "," + b.index];
	}
});
}

/**
 * temporal pattern graph.contain sustain,episodic,weak edge type
 * */
function QuarterGraph(nodes,file,svg1,width,height,quart){
	
	var linkedByIndex = {};
	var color = d3.scale.category10();		 
	
	d3.select("svg").remove();
	var svg = d3.select(svg1).append("svg").attr("width", width).attr("height", height);

var force = d3.layout.force()
    .gravity(.15)
    .distance(350)
    .charge(-350)
    .size([width, height]);
    
 //input to the file name which is taken previously
 
d3.json(file, function(error, json) {
  force
      .nodes(nodes)
      .links(data_set(quart, json))
      .on("tick", tick)
      .start();
 
  
   svg.selectAll(".link")
      .data(json.links)
    .enter().append("line");
      //.attr("class", "link");
      
 var arrow_head = svg.append("svg:defs").selectAll("marker")
    .data(["end"])      // Different link/path types can be defined here
  .enter().append("svg:marker")    // This section adds in the arrows
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", -1.5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
  .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");
      
      
  var path = svg.append("svg:g").selectAll("path")
    .data(force.links())
  .enter().append("svg:path")
	//.attr("class", function(d) { return "link " + d.type; })
	.attr("class", function(d){ // here identified the link and assign css class according to that.
		if(d.type == "weak"){
			return "linkWeak";
		}else if(d.type == "sustained"){
			return "linkSustain";
		}else if(d.type == "episodic"){
			return "linkEpisodic";
		}
	})
	//.attr("id",function(d,i){ return "linkID "+i;});
	.attr("marker-end", "url(#end)");

  var node = svg.selectAll(".node")
      .data(force.nodes())
    .enter().append("g")
      .attr("class", "node")
      .style("fill", function(d) { return color(d.group); })
      //.on("click",click)
      //.on("dblclick", dblclick)
       .on("mouseover", mouseOver(.001))
      .on("mouseout", mouseOut(1))
      .call(force.drag);

  node.append("circle")
      .attr("r",8);

  node.append("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text(function(d) { return d.name;});

json.links.forEach(function(d) {
//alert(d.source.index + "," + d.target.index);
  linkedByIndex[d.source.index + "," + d.target.index] = 1;
});

    function tick() {
    path.attr("d", function(d) {

	
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + 
            d.source.x + "," + 
            d.source.y + "A" + 
            dr + "," + dr + " 0 0,1 " + 
            d.target.x + "," + 
            d.target.y;
		
   });

    node
        .attr("transform", function(d) { 
  	    return "translate(" + d.x + "," + d.y + ")"; });
}


 
    
function mouseOver(opacity) {
	/*alert("json length"+json.links.length);
	alert("force links"+force.links.length);*/
	
    return function(d) {
    	node.style("stroke-opacity", function(o) {
            thisOpacity = isConnected(d, o) ? 1 : opacity;
            this.setAttribute('fill-opacity', thisOpacity);
            return thisOpacity;
        });


    	
        path.style("stroke-opacity", function(o) {
            return o.source === d || o.target === d ? 1 : opacity;                
        });
       // adding the  dash array
       path.style("stroke-dasharray",function(o){
    	   if(o.source === d){
    		   return "5, 5";
    	   }
       });

       path.attr("marker-end",function(o){
       	if (o.source === d || o.target === d ) {
				return "url(#end)";
			}else{
				return "url(#)";
			}
       });
       
       d3.select(this).select("text").transition()
       .duration(500)
       .style("fill", "black")
       .style("stroke", "lightsteelblue")
       .style("stroke-width", ".5px")
       .style("font", "20px sans-serif");
   d3.select(this).select("circle").transition()
       .duration(750)
       .attr("r", 25)
       .style("fill", function(d) { return color(d.group); });										        
    };
}

function mouseOut(opacity) {
    return function(d) {
    	 node.style("stroke-opacity", function(o) {
             thisOpacity = isConnected(d, o) ? 1 : opacity;
             this.setAttribute('fill-opacity', thisOpacity);
             return thisOpacity;
         });

         path.style("stroke-opacity", function(o) {
     //return o.source === d || o.target === d ? 1 : opacity;
             return o.source === d ? 1 : opacity;
         }); 
         
         path.style();//stroke line 
         //according to link type chanage the color of the edge
         path.style("stroke",function(d){
        		if(d.type == "weak"){
					return "#33CC33";
				}else if(d.type == "sustained"){
					return "#0066FF";
				}else if(d.type == "episodic"){
					return "#FF0000";
				}
         });
         
         path.style("stroke-dasharray",0); 
         
         path.attr("marker-end","url(#)");
         
         d3.select(this).select("circle").transition()
         .duration(750)
         .attr("r", 8)
         .style("fill", function(d) { return color(d.group); });
     d3.select(this).select("text").transition()
         .duration(750)
         .attr("x", 12)
         .style("stroke", "none")
         .style("fill", "black")
         .style("stroke", "none")
         .style("font", "10px sans-serif");
        
    };
}

function neighboring(a, b) {
  return linkedByIndex[a.index + "," + b.index];
}

function isConnected(a, b) {
//return incoming and outgoing
	return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
//return outgong
//alert(a.index + "," + b.index);
	//return linkedByIndex[a.index + "," + b.index];
	}
});
}



/**
 * this calculates the change connected in sequentilly in graph upto depth 3
 * A->B->C->D in this manner.iterating link set 3 times
 * */

/*data retrieve from the server*/

function LongerChainInQuarterData(nodes,links,svg1,width,height){

    d3.select("svg")
    .remove();
    var color = d3.scale.category10();
	 
    var svg = d3.select(svg1).append("svg").attr("width", width).attr("height", height);
    var force = d3.layout.force()
    .nodes(nodes)
    .gravity(.15)
    .distance(350)
    .links(links)
    .size([width, height])
    .linkDistance(400)
    .charge(-350)
    .on("tick", tick)
    .start();
 	
    // build the arrow.
    var arrow_head = svg.append("svg:defs").selectAll("marker")
    .data(["end"])      // Different link/path types can be defined here
    .enter().append("svg:marker")    // This section adds in the arrows
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", -1.5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");

    // add the links and the arrows
    var path = svg.append("svg:g").selectAll("path")
    .data(force.links())
    .enter().append("svg:path")
    .attr("class", function(d) {
        return "link " + d.type;
    })
    .attr("class", "link")
    .attr("marker-end", "url(#end)");


    var node = svg.selectAll(".node")
    .data(force.nodes())
    .enter().append("g")
    .attr("class", "node")
    .style("fill", function(d) {
        return color(d.group);
    })
    .on("mouseover", mouseOver(.001))
    .on("mouseout", mouseOut(1))
    .call(force.drag);

    node.append("circle")
    .attr("r", 8);

    node.append("text")
    .attr("dx", 12)
    .attr("dy", ".35em")
    .style("fill", "black")
    .text(function(d) {
        return d.name;
    });

    var linkedByIndex = {};
    var linksForSelectedNode = {};
    links.forEach(function(d) {
        //alert(d.source.index + "," + d.target.index);
        linkedByIndex[d.source.index + "," + d.target.index] = 1;
    });

    // add the curvy lines
    function tick() {
        path.attr("d", function(d) {

	 	
            var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
            return "M" + 
            d.source.x + "," + 
            d.source.y + "A" + 
            dr + "," + dr + " 0 0,1 " + 
            d.target.x + "," + 
            d.target.y;
	 		
        });

        node.attr("transform", function(d) { 
            return "translate(" + d.x + "," + d.y + ")";
        });
    }


    function mouseOver(opacity) {
        var connectedEdges = [];
        var triadCompletingEdges = [];
        var depthEdges = [];
        
        return function(d) {

        	links.forEach(function(o) {
        		 if (o.source === d) {    
                     if(connectedEdges.indexOf(o.target.index) == -1){
                         connectedEdges.push(o.target.index);
                     }

                 };
        		});

        	//alert("the length of connected edges " +connectedEdges.length);
            for(var i=0;i< connectedEdges.length;i++){
            	
                links.forEach(function(f) {
                	
                    if (isConnectedIndex(connectedEdges[i], f.target.index ) && f.target != d && f.target.index != connectedEdges[i]) { 
                        if(triadCompletingEdges.indexOf(f.target.index) == -1){                    	
                            triadCompletingEdges.push(f.target.index);                        
                            //alert("connectededge "+connectedEdges[i]+"pushed " + f.target.index);                        
                            
                            for(var j=0; j < triadCompletingEdges.length ; j++){
                            	
                            	links.forEach(function(n){ // iterate all the links for finding children edge
                            		if(isConnectedIndex(triadCompletingEdges[j], n.target.index) && n.target != d && n.target != f.target && n.target.index != triadCompletingEdges[j]){
                            			//alert("connectededge "+connectedEdges[i]+" triadCompletingEdges[j] " + triadCompletingEdges[j] + " "+ n.target.index);
                            			
                            			if(depthEdges.indexOf(n.target.index) == -1){
                            				depthEdges.push(n.target.index);                        				
                            			}
                            			if(linksForSelectedNode.indexOf(triadCompletingEdges[j]+ "," + n.target.index) == -1){
                            				linksForSelectedNode[triadCompletingEdges[j]+ "," + n.target.index] = 3;
                            				
                            				if(linksForSelectedNode.indexOf(d.index + "," + connectedEdges[i]) == -1){
                                                linksForSelectedNode[d.index + "," + connectedEdges[i]] = 1;
                                                //alert("level 1 d.index "+d.index+" "+" connectedEdges[i] "+connectedEdges[i]);
                                            }
                                			
                                			if(linksForSelectedNode.indexOf(connectedEdges[i] + "," + triadCompletingEdges[j]) == -1){// add the parent edge 
                                        		linksForSelectedNode[connectedEdges[i] + "," + triadCompletingEdges[j]] = 2;
                                        		//alert(" level 2 "+" connectedEdges[i] "+connectedEdges[i]+" " + " triadCompletingEdges[j] "+triadCompletingEdges[j]);
                                        	}
                            			} 
                            			                        			
                            		}
                            	});

                            }  
                            triadCompletingEdges = [];
                                                    
                        }                    
     
                    }
                	});

            }

            path.style("stroke-opacity", function(o) {
                var value= getConnectedNodes(o.source, o.target);
                return (value>=1) ? 1 : opacity; 
            });
    	
            path.style("stroke",function(o){
                if (getConnectedNodes(o.source, o.target)==1||getConnectedNodes(o.source, o.target)==2||getConnectedNodes(o.source, o.target)==3 || getConnectedNodes(o.source, o.target)==3) { 
                    return "blue";
                }
            });

            connectedEdges=[];
            //triadCompletingEdges = [];
            depthEdges = [];
            
            arrow_head.style("opacity",function(o){
                thisOpacity = isConnected(d, o) ? 1 : opacity;
                this.setAttribute('fill-opacity', thisOpacity);
                return thisOpacity;
            });
    	       
            d3.select(this).select("text").transition()
            .duration(500)
            .style("fill", "black")
            .style("stroke", "lightsteelblue")
            .style("stroke-width", ".5px")
            .style("font", "20px sans-serif");
            d3.select(this).select("circle").transition()
            .duration(750)
            .attr("r", 25)
            .style("fill", function(d) {
                return color(d.group);
            });
    	        
        };
    }
		
    function mouseOut(opacity) {
        return function(d) {
            
            linksForSelectedNode = [];
            node.style("stroke-opacity", function(o) {
                thisOpacity = isConnected(d, o) ? 1 : opacity;
                this.setAttribute('fill-opacity', thisOpacity);
                return thisOpacity;
            });
		
            path.style("stroke-opacity", function(o) {
                //return o.source === d || o.target === d ? 1 : opacity;
                return o.source === d ? 1 : opacity;
            });
		
            path.style("stroke","#666");
		         
            arrow_head.style("opacity",function(o){
                thisOpacity = isConnected(d, o) ? opacity : 1;
                this.setAttribute('fill-opacity', thisOpacity);
                return thisOpacity;
            });
		         
            d3.select(this).select("circle").transition()
            .duration(750)
            .attr("r", 8)
            .style("fill", function(d) {
                return color(d.group);
            });
            d3.select(this).select("text").transition()
            .duration(750)
            .attr("x", 12)
            .style("stroke", "none")
            .style("fill", "black")
            .style("stroke", "none")
            .style("font", "10px sans-serif");
		        
        };
    }


    function neighboring(a, b) {
        return linkedByIndex[a.index + "," + b.index];
    }

    function isConnected(a, b) {
        //return incoming and outgoing
        //return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
        //return outgong
        //alert(a.index + "," + b.index);
        return linkedByIndex[a.index + "," + b.index];
    }
    function isConnectedIndex(a,b){
        return linkedByIndex[a + "," + b];
    }
        
    function getConnectedNodes(a, b) {
        //return incoming and outgoing
        //return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
        //return outgong
        //alert(a.index + "," + b.index);
        //if(linkedByIndex[a.index + "," + b.index]==1){
        //  connectedEdges.push(b.index);
        //	return true ;
        //  alert( "lenght of list "+linksForSelectedNode.length) 
        return linksForSelectedNode[a.index + "," + b.index];
    // }
    }
    
    

}

