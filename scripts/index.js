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
	treeDataIndex: 0,
	pinsCount: 3,
	pinHeightsValid: false,
	markers: {}
};

function initialize(){
	nodes = {
		pins: document.getElementById('pins'),
		heights: document.getElementById('heights'),
		counter: document.getElementById('pins-count'),
		buildPinsMarkers: document.getElementById('build-pins-marker'),
		pinsMarkers: document.getElementById('pins-marker'),
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

function extras(){
	data.build = buildPinsMarker();
	data.build();
}

function addEvents(){
	nodes.pins.addEventListener('keyup', getPins, true);
	nodes.buildPinsMarkers.addEventListener('click', extras, true);
	nodes.pinsMarkers.addEventListener('keyup', changeColor, true);
	nodes.heights.addEventListener('keyup', getHeight, true);
	nodes.haveDublicates.addEventListener('change', haveDublicates, true);
	nodes.haveAlternates.addEventListener('change', haveAlternates, true);
	nodes.showStatistic.addEventListener('change', showStatistic, true);
	nodes.getData.addEventListener('click', getData, true);
	nodes.verify.addEventListener('click', verification, true);
	nodes.diagram.addEventListener('click', buildTree, true);
	nodes.counter.addEventListener('click', countingPins, true);
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

function changeColor(e){
	var val = e.target.value;
	var colEl = e.target.parentNode.parentNode;
	var nodes = Array.prototype.slice.call( colEl.parentNode.children );
	var svg = colEl.querySelector('svg');
	var border = colEl.querySelector('.border');
	var duration = 500;
	var index = nodes.indexOf(colEl);
	
	data.markers[index + 1] = val;

	animatePin(/\d*\.?\d+/.test(val) ? 'green' : 'red');

	function animatePin(color){
		d3.select(svg).select('circle').transition().duration(duration).attr("stroke", color);
		d3.select(svg).select('line').transition().duration(duration).attr("stroke", color);
		d3.select(border).transition().duration(duration).style("border-color", color);
	}
}

function countingPins(e){
	switch(e.target.className){
		case 'minus':
			data.pinsCount--;
			if(data.pinsCount <= 0) {
				data.pinsCount = 0;
			}
			e.target.parentNode.querySelector('.num-holder').innerHTML = data.pinsCount;
			break;
		case 'plus':
			data.pinsCount++;
			if(data.pinsCount > 12) {
				data.pinsCount = 12;
			}
			e.target.parentNode.querySelector('.num-holder').innerHTML = data.pinsCount;
			break;
	}
	data.build();
}

function buildPinsMarker(){
	var templateOrigin = nodes.pinsMarkers.innerHTML;
	nodes.pinsMarkers.innerHTML = '';
	return function(){
		var template = '';
		var html = '';
		var cols = Math.floor(275/data.pinsCount);
		nodes.pinsMarkers.innerHTML = '';
		for(var i = 0; i < data.pinsCount; i++){
			template = templateOrigin.replace('<div class="col">', '<div class="col" style="width:' + cols + 'px;">' + createMarker(i));
			html += template;
		}
		nodes.pinsMarkers.innerHTML = html;
	}
}

function createMarker(label){
	var fragment = document.createDocumentFragment();
	var div = document.createElement('div');
	fragment.appendChild(div);
	var svg = attrs(d3.select(fragment.firstChild).append("svg"), {
		width: 20,
		height: 40
	});

	var elemEnter = svg.append('g');

	attrs(elemEnter.append("circle"), {
		cy: 10,
		cx: 10,
		r: '30%',
		stroke: '#757575',
		fill: '#fff'
	});

	attrs(elemEnter.append('line'), {
		x1: 10,
		y1: 20,
		x2: 10,
		y2: 40,
		strokeWidth: 1,
		stroke: '#757575'
	});

	var labelEl = attrs(elemEnter.append("text"), {
		dx: 7,
		dy: 14,
		fill: '#757575'
	});

	labelEl.text(label + 1);

	labelEl = styles(labelEl, {
		'font-size': 12,
		'line-height': 20
	});


	return fragment.firstChild.innerHTML;
}

function attrs(svgObj, attr){
	for(var key in attr){
		svgObj.attr(key, attr[key]);
	}
	return svgObj;
}

function styles(svgObj, attr){
	for(var key in attr){
		svgObj.style(key, attr[key]);
	}
	return svgObj;
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
	settings.heights = Object.keys(data.markers).join();

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

function createGroupedArray(arr, chunkSize) {
    var groups = [], i;
    for (i = 0; i < arr.length; i += chunkSize) {
        groups.push(arr.slice(i, i + chunkSize));
    }
    return groups;
}

function joinGroupedArray(arr){
	return [].concat.apply([], arr);
}

function doIt(largeArray){
	var group = createGroupedArray(largeArray, 50);
	var results = [];

	for(var i = 0, l = group.length; i < l; i++){
		for(var y = 0, s = group[i].length; y < s; y++){
			results.push(findLargestArray(group[i][y], y, largeArray));
		}
	}

	return joinGroupedArray(results);
}

function levelDown(arr, base, callback){
	var results = [];
	var i = 0, l = arr.length, p;

	foLoop();

	function foLoop(){
		if(isDone()){
			callback(results);
		}

		new Parallel(arr[i].largest, {env: {base: base}}).require(findLargestArray, compareArrays).spawn(function(data){
			var res = [];
			for (var i = 0, len = data.length; i < len; i++) {
			 	res.push(findLargestArray(data[i], i, global.env.base));
			}
			return res;
		}).then(function(data){
			results.push(data);
			i++;
			foLoop();
		});
	}

	function isDone(){
		return i === l - 1; 
	}
}

function verification(){
	var arr = data[settings.key];
	var obj = {};
debugger;
	for(var i = 0, l = arr.length; i < l; i++){
		obj[arr[i]] = [];
	}

	var target = arr.map(function(it){ return it = it.split(',').map(function(ti){ return Number(ti); }); });
	var min = 1;
	var currentIndex = 0;
	var keys = Object.keys(obj);
	var targetSize = target.length;
	var str = '';

	for(var key in obj){
		var base = key.split(',').map(function(it){ return Number(it); });
		currentIndex = keys.indexOf(key);
		min = 1;
		mapOne(target, key);
	}

	for(var key in obj){
		obj[key].s = obj[key].join();
	}

	for(var i = 1, l = keys.length; i < l; i++){
		str = keys[i] + ',';
		if(str + obj[keys[i]].s === obj[keys[i-1]].s){
			obj[keys[i]].r = true;
		}
	}

	clearObject();
	
	for(var key in obj){
		var s = obj[key].s;

		for(var i = 1, l = keys.length; i < l; i++){
			str = keys[i] + ',';
			if(str + obj[keys[i]].s === s){
				obj[keys[i]].r = true;
			}
		}
	}

	clearObject();

	output('Step 1');
	output('------');
	for(var t in obj){
		output(t + ' => ' + obj[t].length);
	}
	output('------');
	output('');
	

	// try to build a tree

	var o = JSON.parse(JSON.stringify(obj));
	var k = Object.keys(o);

	var ress = [];
	var res = {};
debugger;
	
	for(var pin in o){
		if(o.hasOwnProperty(pin)){
			ress.push(buildBranch({}, pin, obj[pin]));
		}
	}

	output('Step 2');
	output('------');

	output(JSON.stringify(ress[0], "", 4))
	
	output('------');
	output('');

	function buildBranch(ob, name, array){
		ob.name = name;
		ob.children = array.map(function(el){
			var e = el.join();
			if(o[e] && o[e].length > 0){
				var a = o[e].slice();
				delete o[e];
				return buildBranch({}, e, a);
			} else {
				return {name: e};
			}
		});
		return ob;
	}

	debugger;
	//

	var results = [];
	var same = [];
	var resKeys = Object.keys(obj);
	var targetA = resKeys[0].split(',').map(function(it){ return Number(it); });

	for(var i = 0, l = resKeys.length; i < l; i++){
		var targetA = resKeys[i].split(',').map(function(it){ return Number(it); });
		if(resKeys[i + 1]){
			for(var y = i + 1; y < l; y++){
				var targetB = resKeys[y].split(',').map(function(it){ return Number(it); });
				if(itemsNotMore(targetA, targetB)){
					same.push(targetA);
					targetA = targetB;
				}
			}
			if(same.length > 0){
				results.push(same);
			}
			same = [];
		}
	}

	output('Step 3');
	output('------');
	var ttt = results.map(function(it){ 
		it = it.map(function(ti){ return String(ti); }); 
		return it;
	});
	for(var t = 0, tt = ttt.length; t < tt; t++){
		output(JSON.stringify(ttt[t], "", 4))
	}

	output('------');
	output('');

	debugger;

	var rootKey = Object.keys(obj)[0].split(',').map(function(it){ return Number(it); });
	var separate = [];
	var trees = [];


	trees.push(rootKey.join());

	for(var i = 1, l = Object.keys(obj).length; i < l; i ++){
		var testArr = Object.keys(obj)[i].split(',').map(function(it){ return Number(it); });
		if(itemsNotMore(rootKey, testArr)){
			trees.push(testArr.join())
		} else {
			separate.push(testArr.join());
		}
	}

	function buildTree(){
		var tree = {};
		trees.forEach(function(item){
			tree[item] = [];
		});

		separate.forEach(function(item){
			tree[item] = [];
		});
	}

	for(var key in obj){
		nodes.system.tBodies[0].insertRow();
		var row = nodes.system.tBodies[0].rows[nodes.system.tBodies[0].rows.length - 1];
		row.insertCell();
		row.insertCell();
		row.cells[0].className = 'mdl-data-table__cell--non-numeric';
		row.cells[0].innerHTML = key;
		row.cells[1].innerHTML = obj[key].length;
	}

	// nodes.diagram.style.display = 'none';

	function clearObject(){
		for(var key in obj){
			if(!!obj[key].r){
				delete obj[key];
			}
		}
		keys = Object.keys(obj);
	}

	function itemsNotMore(a, b){
		if(a.join() !== b.join()){
			for(var i = 0, l = a.length; i < l; i++){
				if(a[i] > b[i]){
					return false;
				}
			}
			return true;
		} else {
			return false;
		}
	}

	function arraysEqual(a, b) {
		if (a === b) return true;
		if (a == null || b == null) return false;
		if (a.length != b.length) return false;

		for (var i = 0; i < a.length; ++i) {
			if (a[i] !== b[i]) return false;
		}
		return true;
	}

	function sum(target) {
		return target.reduce(function(a, b){ return a + b }, 0);
	}

	function mapOne(test, key) {
		var origin = base.slice();
		var baseSum = sum(base);
		var testSum = 0;

		for(var i = 0, l = test.length; i < l; i++){
			testSum = sum(test[i]);
			if(testSum - baseSum === min){
				if(itemsNotMore(base, test[i])){
					base = test[i];
					obj[key].push(base);
					test = test.slice(i + 1);
					break;
				}
			}
		}
		if(!!test.length && test.length < targetSize){
			var hasMore = test.some(function(item){ return itemsNotMore(base, item) });
			var isEquals = arraysEqual(origin, base);

			if(hasMore){
				min = isEquals ? min + 1 : 1;
				mapOne(test, key);
			} else {
				return;
			}
		} else {
			if(test.length === targetSize){
				var hasMore = test.some(function(item){ return itemsNotMore(base, item) })
				if(hasMore){
					min++;
					mapOne(test, key);
				} else {
					return;
				}
			} else {
				return;
			}
		}
	}

}

function output(msg){
	var output = document.getElementById('output');
	if(!output){
		output = document.createElement('div');
		output.id = 'output';
		document.body.appendChild(output);
		output = document.getElementById('output');
		css(output, {
			position: 'fixed',
			left: '0px',
			top: '0px',
			border: '1px solid #e2e2e2',
			width: '300px',
			height: '300px',
			overflow: 'auto'
		});
	}
	var html = output.innerHTML;

	output.innerHTML += '<br>' + msg;

}

function css(node, attr){
	for(var key in attr){
		node.style[key] = attr[key];
	}
}

function verifySystem(){
	var base = data[settings.key];

	var p = new Parallel(base, {env: {base: base}}).require(findLargestArray, compareArrays).spawn(function(data){
		var res = [], o;
		for (var i = 0, len = data.length; i < len; i++) {
		 	res.push(findLargestArray(data[i], i, global.env.base));
		}
		return res;
	}).then(function(arr){
		data.verificationResult = arr.slice();
		// levelDown(data, base, function(results){
		// 	console.log(results);
		// });

		var a = data[settings.key];
		var obj = {};
		var objB = {};
		console.log(a);
debugger;
		for(var i = 0, l = a.length; i < l; i++){
			obj[a[i]] = []; //mapLargestArray(a[i], i, a);
		}

		// for(var key in obj){
		// 	obj[key]._ = [];
		// 	for(var n = 0, m = obj[key].length; n < m; n++){
		// 		obj[key]._.push(obj[key], obj[obj[key][n]]);
		// 	}
		// }

		for(var key in obj){
			for(var n = 0, m = obj[key].length; n < m; n++){
				// obj[key][n] = obj[key][n].map(function(it){ return Number(it); });
			}
		}
		var ser = {};
		var tar = a.map(function(it){ return it = it.split(',').map(function(ti){ return Number(ti); }); });
		var ttt = tar.slice();
		var min = 1;
		var currentIndex = 0;
		var keys = Object.keys(obj);
		
		console.log(tar);
		var tarL = tar.length;

		function itemsNotMore(a, b){
			if(a.join() !== b.join()){
				for(var i = 0, l = a.length; i < l; i++){
					if(a[i] > b[i]){
						return false;
					}
				}
				return true;
			} else {
				return false;
			}
		}

		function arraysEqual(a, b) {
			if (a === b) return true;
			if (a == null || b == null) return false;
			if (a.length != b.length) return false;

			for (var i = 0; i < a.length; ++i) {
				if (a[i] !== b[i]) return false;
			}
			return true;
		}

		function mapOne(test, key) {
			var origin = base.slice();
			var baseSum = sum(base);
			var testSum = 0;

			for(var i = 0, l = test.length; i < l; i++){
				testSum = sum(test[i]);
				if(testSum - baseSum === min){
					if(itemsNotMore(base, test[i])){
						base = test[i];
						obj[key].push(base);
						test = test.slice(i + 1);
						ttt[currentIndex] = null;
						break;
					}
				}
			}
			if(!!test.length && test.length < tarL){
				var hasMore = test.some(function(item){ return itemsNotMore(base, item) });
				var isEquals = arraysEqual(origin, base);

				if(hasMore){
					min = isEquals ? min + 1 : 1;
					mapOne(test, key);
				} else {
					return;
				}
			} else {
				if(test.length === tarL){
					var hasMore = test.some(function(item){ return itemsNotMore(base, item) })
					if(hasMore){
						min++;
						mapOne(test, key);
					} else {
						return;
					}
				} else {
					return;
				}
			}
		}
		for(var key in obj){
			currentIndex = keys.indexOf(key);
			var base = key.split(',').map(function(it){ return Number(it); });
			min = 1;
			mapOne(tar, key);
		}
		console.log(obj);
		console.log(ttt);

		for(var key in obj){
			obj[key].s = obj[key].join();
		}

		var str = '';
		for(var i = 1, l = keys.length; i < l; i++){
			str = keys[i] + ',';
			if(str + obj[keys[i]].s === obj[keys[i-1]].s){
				obj[keys[i]].r = true;
			}
		}

		for(var key in obj){
			if(!!obj[key].r){
				delete obj[key];
			}
		}
		keys = Object.keys(obj);
		
		for(var key in obj){
			var s = obj[key].s;

			for(var i = 1, l = keys.length; i < l; i++){
				str = keys[i] + ',';
				if(str + obj[keys[i]].s === s){
					obj[keys[i]].r = true;
				}
			}
		}

		for(var key in obj){
			if(!!obj[key].r){
				delete obj[key];
			}
		}

		console.log(obj);

		return;
		console.log(obj[Object.keys(obj)[0]]);
		// console.log(obj[Object.keys(obj)[0]].sort(sortLarge));
		// var avgs = obj[Object.keys(obj)[0]].map(findAvg);
		// console.log(avgs);

		var bar = Object.keys(obj)[0].split(',').map(function(it){ return Number(it); });

		obj[Object.keys(obj)[0]].forEach(function(ar){
			sortLarge(bar, ar);
		});

		var aa = obj[Object.keys(obj)[0]].map(function(ii){
			return sortLarge(bar, ii);
		})
		console.log(aa);

		function sum(target) {
			return target.reduce(function(a, b){ return a + b }, 0);
		}

		function findAvg(target){
			return target.reduce(function(a, b){ return a + b }, 0) / target.length;
		}

		function sortLarge(a, b){
			var res = [];
			for(var i = 0, n = a.length; i < n; i++){
				// if(a[i] > b[i]) res.push(1);
				if(a[i] < b[i]) res.push(a[i] - b[i]);
				if(a[i] === b[i]) res.push(0);
			}
			var diff = res.reduce(function(z,x){ return z - x }, 0);
			if(diff === 1) return b;
			// console.log(a.join(), b.join(), res, res.reduce(function(z,x){ return z - x }, 0));
			// return 0;
		}

		function mapLargestArray(arr, i, base){
			var result = [];
			var isStr = typeof arr === 'string';
			var l = base.length, n = 0, a1 = isStr ? arr.split(',') : arr, a2;
			for(n = 0; n < l; n++){
				a2 = typeof base[n] === 'string' ? base[n].split(',') : base[n];
				if(i !== n){
					if(compareArrays(a1, a2)){
						result.push(a2)
					}
				}
			}
			return result;
		}

		debugger;
		return;

		data.verificationResult.forEach(checkLevel);

		data.verificationResult = data.verificationResult.filter(function(item){ return !!item; });
		normalizeTree(data.verificationResult);

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

	});
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
	var isStr = typeof arr === 'string';
	var l = base.length, n = 0, a1 = isStr ? arr.split(',') : arr, a2;
	for(n = 0; n < l; n++){
		a2 = typeof base[n] === 'string' ? base[n].split(',') : base[n];
		if(i !== n){
			if(compareArrays(a1, a2)){
				result.push(a2)
			}
		}
	}
	if(result.length > 0){
		return {base: arr, largest: result, name: isStr ? arr : arr.join()};
	}
}

function compareArrays(a1, a2){
	var a1l = a1.length,
		a2l = a2.length;

	if(a1l === a2l){
		for(var i = 0; i < a1l; i++){
			if(Number(a1[i]) > Number(a2[i])){
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