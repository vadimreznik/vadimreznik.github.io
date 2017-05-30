window.onload = init;

function init(){
	document.getElementById('generate').onclick = generate;
}

function generate(){
	var node = {
		pins: document.getElementById('pins'),
		steps: document.getElementById('steps'),
		levels: document.getElementById('levels'),
		result: document.getElementById('result')
	};

	window.val = {
		pins: Number(node.pins.value),
		steps: Number(node.steps.value),
		levels: Number(node.levels.value),
		min: 2,
		max: Number(node.steps.value)
	};

	if(!val.pins || !val.steps){
		postResult("Values or Pins are empty!", true);
		return;
	}

	if(isNaN(val.pins) || isNaN(val.steps)){
		postResult("Values or Pins are not a number!", true);
		return;
	}

	var stringResult = LoopIt(val.pins, '|', possiblePinValues(val.min, val.steps));
	var allResults = stringResult.split('|').filter(function(item){ return !!item; });
	var uniqueResults = allResults.filter(function(item){ return !!item && isKeyValid(item.split('')); });
	
	postResult('-------------');
	postResult('All possible values: ' + allResults.length);
	postResult('Unique values: ' + uniqueResults.length);

	if(window.location.search === '?show'){
		postResult('-------------');
		uniqueResults.forEach(function(item){
			postResult(item);
		});
	}

	function postResult(msg, clean){
		if(clean){
			node.result.innerHTML = msg;
		} else {
			node.result.innerHTML += msg + '<br>';
		}
	}
}

function possiblePinValues(min, max){
	var res = [];
	for(var i = min; i <= max; i++){
		res.push(i);
	}
	return res;
}

function isPinEquals(arr, i){
	return arr[i - 1] === undefined ? false : arr[i - 1] === arr[i];
}

function isStepSizeValid(arr, i){
	return arr[i] >= val.min && arr[i] <= val.max;
}

function isStepsValid(arr, i){
	return arr[i - 1] === undefined ? true : Math.abs(arr[i - 1] - arr[i]) <= val.min;
}

function verify(arr, i){
	if(isPinEquals(arr, i)){
		return false;
	} else if(isStepSizeValid(arr, i) && isStepsValid(arr, i)){
		return true;
	} else {
		return false;
	}
}

function isKeyValid(pins){
	for(var i = 0; i < pins.length; i++){
		if(!verify(pins, i)){
			return false;
		}
	}
	return true;
}

function LoopIt(depth, baseString, arrLetters) {
	var returnValue = "";
	for (var i = 0; i < arrLetters.length; i++) {
		returnValue += (depth == 1 ? baseString + arrLetters[i] : LoopIt(depth - 1, baseString + arrLetters[i], arrLetters));
	}
  return returnValue;
}
