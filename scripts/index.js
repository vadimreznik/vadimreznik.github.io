window.onload = initialize;

var storage = {};
var nodes = {};
var settings = {
	pins: '',
	heights: ''
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
	strict: []
};

function initialize(){
	nodes = {
		pins: document.getElementById('pins'),
		heights: document.getElementById('heights'),
		haveDublicates: document.getElementById('haveDublicates'),
		haveAlternates: document.getElementById('haveAlternates'),
		showStatistic: document.getElementById('showStatistic'),
		getData: document.getElementById('getData'),
		hiddenContent: document.getElementById('hidden-content'),
		progress: document.getElementById('progress')
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