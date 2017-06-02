window.onload = init;

function init(){
	document.getElementById('generate').onclick = generateCombinations;
	document.getElementById('pins').onkeyup = buildPinsHeight;
	document.getElementById('pairs').onchange = removeDublicatePairs;
	document.getElementById('alternate').onchange = removeAlternatePairs;
}

function removeDublicatePairs(){
	if(allValues && !!allValues.length){
		isCheckedDublicate = this.checked;
		if(this.checked){
			woDublicates = isCheckedAlternate ? woAlternate.slice() : allValues.slice();

			woDublicates = woDublicates.filter(function(item){ return isKeyHasValidPairs(item.split(useJoinWith ? ',' : '')); });

			postResult('', true);
			postResult('Values wo dublicates: ' + woDublicates.length);

			woDublicates.forEach(function(item){
				postResult(item);
			});
		} else {
			var arr = isCheckedAlternate ? woAlternate.slice() : allValues.slice();

			postResult('', true);
			postResult(isCheckedAlternate ? 'Values wo alternate: ' : 'All possible values: ' + arr.length);

			arr.forEach(function(item){
				postResult(item);
			});
		}
	}
}

function removeAlternatePairs(){
	if(allValues && !!allValues.length){
		isCheckedAlternate = this.checked;
		if(this.checked){
			woAlternate = isCheckedDublicate ? woDublicates.slice() : allValues.slice();

			woAlternate = woAlternate.filter(function(item){ return isKeyHasAlternatePairs(item.split(useJoinWith ? ',' : '')); });

			postResult('', true);
			postResult('Values wo alternate: ' + woAlternate.length);

			woAlternate.forEach(function(item){
				postResult(item);
			});
		} else {
			var arr = isCheckedDublicate ? woDublicates.slice() : allValues.slice();

			postResult('', true);
			postResult(isCheckedDublicate ? 'Values wo dublicates: ' : 'All possible values: ' + arr.length);

			arr .forEach(function(item){
				postResult(item);
			});
		}
	}
}

function buildPinsHeight(){
	var heights = document.getElementById('heights');
	var val = Number(this.value);
	if(isNaN(val)){
		postResult('Value is not a number!', true);
	} else {
		postResult('', true);
	}
	if(val > 12){
		this.value = 12;
		val = this.value;
	}
	var model = [];
	for(var i = 1; i <= val; i++){
		model.push(i);
	}
	
	heights.innerHTML = '<div><strong>Enter the height of the each pin (in mm.):</strong></div>' + Template('<div class="cell"><label>Pin |item|</label><input type="text" id="id|item|"></div>')(model);
	heights.removeEventListener('keyup', gatheringHeights);
	heights.removeEventListener('blur', addToFixed);
	heights.addEventListener('keyup', gatheringHeights);
	heights.addEventListener('blur', addToFixed, true);
}

function validateNumber(val){
	return !isNaN(Number(val));
}

function addToFixed(e){
	var val = Number(e.target.value);
	e.target.value = val.toFixed(1);
}

var storage = {};
var allValues, woDublicates, woAlternate;
var isCheckedDublicate = false;
var isCheckedAlternate = false;
var useJoinWith = false;

function gatheringHeights(e){
	if(validateNumber(e.target.value)){
		storage[e.target.id] = e.target.value;
	} else {
		e.target.value = '';
	}
}

function generateCombinations(){
	var pinsCount = Number(document.getElementById('pins').value);
	var pins = Object.keys(storage);

	if(pins.length === pinsCount){
		var pinsArray = [];
		var hasValues = pins.every(function(key){
			if(storage[key] !== undefined){
				pinsArray.push(storage[key]);
			}
			return storage[key] !== undefined;
		});

		if(hasValues){
			useJoinWith = false;
			allValues = combinations({str:pinsArray.join('')});
			postResult('All possible values: ' + allValues.length);
			allValues.forEach(function(item){
				postResult(item);
			});

			document.getElementById('controls').style.display = 'block';
			document.getElementById('generate').style.display = 'none';

		} else {
			postResult('Some pin is absent!', true);
		}
	} else {
		var somePinsArray = [];
		var pinsArray = [];
		var hasAnyValues = pins.some(function(key){
			return storage[key] !== undefined;
		});
		if(hasAnyValues){
			useJoinWith = true;
			pins.forEach(function(item){
				if(storage[item] !== undefined){
					somePinsArray.push(storage[item]);
				}
			});
			for(var i = 0; i < pinsCount; i++){
				pinsArray.push(somePinsArray.join(','));
			}
			allValues = combinations({arr:pinsArray}, ',');
			postResult('All possible values: ' + allValues.length);
			allValues.forEach(function(item){
				postResult(item);
			});
			document.getElementById('controls').style.display = 'block';
			document.getElementById('generate').style.display = 'none';
		} else {
			postResult('Something went wrong!', true);
		}
	}
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

	postResult('-------------');
	allResults.forEach(function(item){
		postResult(item);
	});

	if(window.location.search === '?show'){
		postResult('-------------');
		uniqueResults.forEach(function(item){
			postResult(item);
		});
	}
}

function postResult(msg, clean){
	if(clean){
		document.getElementById('result').innerHTML = msg;
	} else {
		document.getElementById('result').innerHTML += msg + '<br>';
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

function isAlternatePinEquals(arr, i){
	return arr[i - 1] === undefined || arr[i + 1] === undefined ? false : arr[i - 1] === arr[i + 1];
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

function Template(html){
    return function (obj) {
        var key, text = '';
        if (isArray(obj)) {
            obj.forEach(function (item) {
                text += html.replace(/\|([a-z]+)*\|/gim, function (match, key) {
                    return isObject(item) ? item[key] : item;
                });
            });
            return text;
        } else if (isObject(obj)) {
            return html.replace(/\|([a-z]+)*\|/gim, function (match, key) {
                return obj[key] || '';
            });
        }
    };
}

function isExists(item){
	return !!item;
}

function isArray(item){
    if (isExists(item)) {
        if (item instanceof Array) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function isObject(item){
    if (isExists(item)) {
        if (!isArray(item) && item instanceof Object) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

var permArr = [],
  usedChars = [];

function permute(input) {
  var i, ch;
  for (i = 0; i < input.length; i++) {
    ch = input.splice(i, 1)[0];
    usedChars.push(ch);
    if (input.length == 0) {
      permArr.push(usedChars.slice());
    }
    permute(input);
    input.splice(i, 0, ch);
    usedChars.pop();
  }
  return permArr
};


/*
Here are some examples of how you could use this code:
  alert(combinations({str: "ABC"}).join(", "));
  Displays:
  AAA, AAB, AAC, ABA, ABB, ABC, ACA, ACB, ACC,
  BAA, BAB, BAC, BBA, BBB, BBC, BCA, BCB, BCC,
  CAA, CAB, CAC, CBA, CBB, CBC, CCA, CCB, CCC
or
  alert(combinations({arr: ["AB","CD","EF"]}).join(", "));
  Displays:
  ACE, ACF, ADE, ADF, BCE, BCF, BDE, BDF
*/
function combinations(args, joinWith) {
  var n, inputArr = [], copyArr = [], results = [],
  subfunc = function(copies, prefix, joinWith) {
    var i, myCopy = [], exprLen, currentChar = "", result = "";
    // if no prefix, set default to empty string
    if (typeof prefix === "undefined") {
      prefix = "";
    }
    // no copies, nothing to do... return
    if (!isArray(copies) || typeof copies[0] === "undefined") {
      return;
    }
    // remove first element from "copies" and store in "myCopy"
    myCopy = copies.splice(0, 1)[0];
    // store the number of characters to loop through
    exprLen = myCopy.length;
    for (i = 0; i < exprLen; i += 1) {
      currentChar = myCopy[i];
      result = prefix + (joinWith || '') + currentChar;
      // if resulting string length is the number of characters of original string,
      // we have a result
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
      // if there are copies left,
      //   pass remaining copies (by value) and result (as new prefix)
      //   into subfunc (recursively)
      if (typeof copies[0] !== "undefined") {
        subfunc(copies.slice(0), result, joinWith);
      }
    }
  };
  
  // for each character in original string
  //   create array (inputArr) which contains original string (converted to array of char)
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
  // pass copyArr into sub-function for recursion
  subfunc(copyArr, '', joinWith);
  return results;
};