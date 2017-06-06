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
	verificationResult: []
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
		system: document.getElementById('system')
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

function verifySystem(){
	data.verificationResult = data[settings.key].map(findLargestArray);
	data.verificationResult.forEach(checkLevel);

	data.verificationResult = data.verificationResult.filter(function(item){ return !!item; });
	data.verificationResult.forEach(function(item, i){
		if(!!item){
			nodes.system.tBodies[0].insertRow();
			nodes.system.tBodies[0].rows[i].insertCell();
			nodes.system.tBodies[0].rows[i].insertCell();
			nodes.system.tBodies[0].rows[i].cells[0].className = 'mdl-data-table__cell--non-numeric';
			nodes.system.tBodies[0].rows[i].cells[0].innerHTML = item.base;
			nodes.system.tBodies[0].rows[i].cells[1].innerHTML = countDepthLevel(item, 'next') || 0;
		}
	});
}

function deepVerification(o){
	o.next = o.largest.map(findLargestArray);
	o.next.forEach(checkLevel);
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
		return {base: arr, largest: result};
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