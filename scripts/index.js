window.onload = initialize;

var storage = {};
var nodes = {};
var settings = {
	pins: '',
	heights: '',
	key: ''
};
var params = {
	haveDublicates: false,
	haveAlternates: false,
	showStatistic: false
}
var data = {
	pins: [],
	heights: [],
	all: [],
	woDublicates: [],
	woAlternates: [],
	strict: [],
	verificationResult: [],
	treeDataIndex: 0
};

function initialize(){
	nodes = {
		pins: document.getElementById('pins'),
		heights: document.getElementById('heights'),
		haveDublicates: document.getElementById('haveDublicates'),
		haveAlternates: document.getElementById('haveAlternates'),
		showStatistic: document.getElementById('showStatistic'),
		statistic: document.getElementById('statistic'),
		getData: document.getElementById('getData'),
		hiddenContent: document.getElementById('hidden-content'),
		progress: document.getElementById('progress'),
		showResult: document.getElementById('showResult'),
		results: document.getElementById('results'),
		vars: document.getElementById('vars'),
		verify: document.getElementById('verify'),
		system: document.getElementById('system'),
		graph: document.getElementById('graph'),
		diagram: document.getElementById('diagram')
	};

	addEvents();
	extendParams();
}

function addEvents(){
	nodes.pins.addEventListener('keyup', getPins, true);
	nodes.heights.addEventListener('keyup', getHeight, true);
	nodes.haveDublicates.addEventListener('change', haveDublicates, true);
	nodes.haveAlternates.addEventListener('change', haveAlternates, true);
	nodes.showStatistic.addEventListener('change', showStatistic, true);
	nodes.getData.addEventListener('click', getData, true);
	nodes.verify.addEventListener('click', verifySystem, true);
	nodes.diagram.addEventListener('click', buildTree, true);
}

function extendParams(){
	var opts = Object.keys(params);
	opts.forEach(function(param){
		params[param] = nodes[param].checked;
	});
}

function getPins(){
	settings.pins = this.value;
}

function getHeight(){
	settings.heights = this.value;
}

function haveDublicates(){
	params.haveDublicates = this.checked;
}

function haveAlternates(){
	params.haveAlternates = this.checked;
}

function showStatistic(){
	params.showStatistic = this.checked;
}

function buildTree(){
	nodes.graph.innerHTML = '';
	var treeData = data.verificationResult;
	var margin = {top: 20, right: 120, bottom: 20, left: 120},
		width = 960 - margin.right - margin.left,
		height = 500 - margin.top - margin.bottom;
		
	var i = 0,
		duration = 750,
		root;

	var tree = d3.layout.tree()
		.size([height, width]);

	var diagonal = d3.svg.diagonal()
		.projection(function(d) { return [d.y, d.x]; });

	var svg = d3.select("#graph").append("svg")
		.attr("width", width + margin.right + margin.left)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	root = treeData[data.treeDataIndex];
	root.x0 = height / 2;
	root.y0 = 0;
	  
	function collapse(d) {
		if (d.children) {
			d._children = d.children;
			d._children.forEach(collapse);
			d.children = null;
		}
	}

	root.children.forEach(collapse);

	update(root);

	d3.select(self.frameElement).style("height", "500px");

	function update(source) {

	  // Compute the new tree layout.
	  var nodes = tree.nodes(root).reverse(),
		  links = tree.links(nodes);

	  // Normalize for fixed-depth.
	  nodes.forEach(function(d) { d.y = d.depth * 100; });

	  // Update the nodes…
	  var node = svg.selectAll("g.node")
		  .data(nodes, function(d) { return d.id || (d.id = ++i); });

	  // Enter any new nodes at the parent's previous position.
	  var nodeEnter = node.enter().append("g")
		  .attr("class", "node")
		  .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
		  .on("click", click);

	  nodeEnter.append("circle")
		  .attr("r", 1e-6)
		  .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

	  nodeEnter.append("text")
		  .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
		  .attr("dy", ".35em")
		  .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
		  .text(function(d) { return d.name; })
		  .style("fill-opacity", 1e-6);

	  // Transition nodes to their new position.
	  var nodeUpdate = node.transition()
		  .duration(duration)
		  .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

	  nodeUpdate.select("circle")
		  .attr("r", 6)
		  .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

	  nodeUpdate.select("text")
		  .style("fill-opacity", 1);

	  // Transition exiting nodes to the parent's new position.
	  var nodeExit = node.exit().transition()
		  .duration(duration)
		  .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
		  .remove();

	  nodeExit.select("circle")
		  .attr("r", 1e-6);

	  nodeExit.select("text")
		  .style("fill-opacity", 1e-6);

	  // Update the links…
	  var link = svg.selectAll("path.link")
		  .data(links, function(d) { return d.target.id; });

	  // Enter any new links at the parent's previous position.
	  link.enter().insert("path", "g")
		  .attr("class", "link")
		  .attr("d", function(d) {
			var o = {x: source.x0, y: source.y0};
			return diagonal({source: o, target: o});
		  });

	  // Transition links to their new position.
	  link.transition()
		  .duration(duration)
		  .attr("d", diagonal);

	  // Transition exiting nodes to the parent's new position.
	  link.exit().transition()
		  .duration(duration)
		  .attr("d", function(d) {
			var o = {x: source.x, y: source.y};
			return diagonal({source: o, target: o});
		  })
		  .remove();

	  // Stash the old positions for transition.
	  nodes.forEach(function(d) {
		d.x0 = d.x;
		d.y0 = d.y;
	  });
	}

	// Toggle children on click.
	function click(d) {
	  if (d.children) {
		d._children = d.children;
		d.children = null;
	  } else {
		d.children = d._children;
		d._children = null;
	  }
	  update(d);
	}
}

function getData(){
	for(var i = 0; i < settings.pins; i++){
		data.pins.push(settings.heights);
	}

	data.all = combinations({ arr: data.pins }, ',');
	data.woDublicates = data.all.filter(function(item){ return isKeyHasValidPairs(item.split(',')); });
	data.woAlternates = data.all.filter(function(item){ return isKeyHasAlternatePairs(item.split(',')); });
	data.strict = data.woDublicates.filter(function(item){ return isKeyHasAlternatePairs(item.split(',')); });

	if(!params.haveDublicates && params.haveAlternates){
		settings.key = 'woDublicates';
	} else if(params.haveDublicates && !params.haveAlternates){
		settings.key = 'woAlternates';
	} else if(!params.haveDublicates && !params.haveAlternates){
		settings.key = 'strict';
	} else {
		settings.key = 'all';
	}

	nodes.vars.innerHTML = data[settings.key].length; 
	nodes.results.value = data[settings.key].join('\n');

	if(params.showStatistic){
		nodes.statistic.querySelectorAll('.all > td')[1].innerHTML = data.all.length;
		nodes.statistic.querySelectorAll('.woDublicates > td')[1].innerHTML = data.woDublicates.length;
		nodes.statistic.querySelectorAll('.woAlternates > td')[1].innerHTML = data.woAlternates.length;
		nodes.progress.style.display = 'none';
		nodes.hiddenContent.style.display = 'block';
	} else {
		setTimeout(function(){
			nodes.showResult.click();
		}, 500);
	}
}

function countDepthLevel(o, key, count){
	if(!!o && o.hasOwnProperty(key)){
		for(var i = 0; i < o[key].length; i++){
			return countDepthLevel(o[key][i], key, isNaN(Number(count)) ? 1 : ++count);
		}
	} else {
		return count;
	}
}

function normalizeTree(arr, parent){
	for(var i = 0; i < arr.length; i++){
		if(!!arr[i]){
			arr[i].parent = parent || null;
			if(arr[i].hasOwnProperty('children')){
				normalizeTree(arr[i].children, arr[i].name)
			}
		}
	}
}

function verifySystem(){
	data.verificationResult = data[settings.key].map(findLargestArray);
	data.verificationResult.forEach(checkLevel);

	data.verificationResult = data.verificationResult.filter(function(item){ return !!item; });
	normalizeTree(data.verificationResult);

	// console.log(data.verificationResult);

	data.verificationResult.forEach(function(item, i){
		if(!!item){
			nodes.system.tBodies[0].insertRow();
			nodes.system.tBodies[0].rows[i].insertCell();
			nodes.system.tBodies[0].rows[i].insertCell();
			nodes.system.tBodies[0].rows[i].cells[0].className = 'mdl-data-table__cell--non-numeric';
			nodes.system.tBodies[0].rows[i].cells[0].innerHTML = item.base;
			nodes.system.tBodies[0].rows[i].cells[1].innerHTML = countDepthLevel(item, 'children') || 0;
		}
	});

	nodes.system.addEventListener('click', function(e){
		if(e.target.parentNode.tagName.toLowerCase() === 'tr'){
			var trs = Array.prototype.slice.call(nodes.system.tBodies[0].rows);
			data.treeDataIndex = trs.indexOf(e.target.parentNode);
			for(var i = 0; i < nodes.system.tBodies[0].rows.length; i++){
				nodes.system.tBodies[0].rows[i].className = '';
			}
			e.target.parentNode.className = 'active';
		}
	}, true);
}

function deepVerification(o){
	o.children = o.largest.map(findLargestArray);
	o.children = o.children.filter(function(item){ return !!item; });
	o.children.forEach(checkLevel);
}

function checkLevel(item){
	if(!!item && item.largest.length > 1){
		deepVerification(item);
	}
}

function findLargestArray(arr, i, base){
	var result = [];
	for(var n = 0; n < base.length; n++){
		var a1 = typeof arr === 'string' ? arr.split(',') : arr;
		var a2 = typeof base[n] === 'string' ? base[n].split(',') : base[n];
		if(i !== n){
			if(compareArrays(a1, a2)){
				result.push(a2)
			}
		}
	}
	if(result.length > 0){
		return {base: arr, largest: result, name: typeof arr === 'string' ? arr : arr.join()};
	}
}

function compareArrays(a1, a2){
	var itIsLess = true;
	if(a1.length === a2.length){
		for(var i = 0; i < a1.length; i++){
			itIsLess = Number(a1[i]) <= Number(a2[i]);
			if(!itIsLess){
				return false;
			}
		}
		return true;
	} else {
		return false;
	}
}

function isKeyHasValidPairs(pins){
	for(var i = 0; i < pins.length; i++){
		if(isPinEquals(pins, i)){
			return false;
		}
	}
	return true;
}

function isKeyHasAlternatePairs(pins){
	for(var i = 0; i < pins.length; i++){
		if(isAlternatePinEquals(pins, i)){
			return false;
		}
	}
	return true;
}

function isPinEquals(arr, i){
	return arr[i - 1] === undefined ? false : arr[i - 1] === arr[i];
}

function isAlternatePinEquals(arr, i){
	return arr[i - 1] === undefined || arr[i + 1] === undefined ? false : arr[i - 1] === arr[i + 1];
}

function isArray(arr){
	return arr instanceof Array;
}

function combinations(args, joinWith) {
  var n, inputArr = [], copyArr = [], results = [],
  subfunc = function(copies, prefix, joinWith) {
    var i, myCopy = [], exprLen, currentChar = "", result = "";
    if (typeof prefix === "undefined") {
      prefix = "";
    }
    if (!isArray(copies) || typeof copies[0] === "undefined") {
      return;
    }
    myCopy = copies.splice(0, 1)[0];
    exprLen = myCopy.length;
    for (i = 0; i < exprLen; i += 1) {
      currentChar = myCopy[i];
      result = prefix + (joinWith || '') + currentChar;
      if(!!joinWith){
      	  if(result[0] === joinWith){
      	  	result = result.substr(1);
      	  }
	      if (result.split(joinWith).length === n) {
	        results.push(result);
	      }
      } else {
	      if (result.length === n) {
	        results.push(result);
	      }
      }
      if (typeof copies[0] !== "undefined") {
        subfunc(copies.slice(0), result, joinWith);
      }
    }
  };
  if (typeof args.str === "string") {
    inputArr = args.str.split("");
    for (n = 0; n < inputArr.length; n += 1) {
      copyArr.push(inputArr.slice(0));
    }
  }
  if (isArray(args.arr)) {
    for (n = 0; n < args.arr.length; n += 1) {
      copyArr.push(args.arr[n].split(","));
    }
  }
  subfunc(copyArr, '', joinWith);
  return results;
};