var results = [];
var s = '5.2,5.8,5.2,5.8,5.2,5.8 5.2,5.8,5.2,5.8,5.2,6.4 5.2,5.8,5.2,5.8,6.4,5.2 5.2,5.8,5.2,5.8,6.4,5.8 5.2,5.8,5.2,6.4,5.2,5.8 5.2,5.8,5.2,6.4,5.2,6.4 5.2,5.8,5.2,6.4,5.8,5.2 5.2,5.8,5.2,6.4,5.8,6.4 5.2,5.8,6.4,5.2,5.8,5.2 5.2,5.8,6.4,5.2,5.8,6.4 5.2,5.8,6.4,5.2,6.4,5.2 5.2,5.8,6.4,5.2,6.4,5.8 5.2,5.8,6.4,5.8,5.2,5.8 5.2,5.8,6.4,5.8,5.2,6.4 5.2,5.8,6.4,5.8,6.4,5.2 5.2,5.8,6.4,5.8,6.4,5.8 5.2,6.4,5.2,5.8,5.2,5.8 5.2,6.4,5.2,5.8,5.2,6.4 5.2,6.4,5.2,5.8,6.4,5.2 5.2,6.4,5.2,5.8,6.4,5.8 5.2,6.4,5.2,6.4,5.2,5.8 5.2,6.4,5.2,6.4,5.2,6.4 5.2,6.4,5.2,6.4,5.8,5.2 5.2,6.4,5.2,6.4,5.8,6.4 5.2,6.4,5.8,5.2,5.8,5.2 5.2,6.4,5.8,5.2,5.8,6.4 5.2,6.4,5.8,5.2,6.4,5.2 5.2,6.4,5.8,5.2,6.4,5.8 5.2,6.4,5.8,6.4,5.2,5.8 5.2,6.4,5.8,6.4,5.2,6.4 5.2,6.4,5.8,6.4,5.8,5.2 5.2,6.4,5.8,6.4,5.8,6.4 5.8,5.2,5.8,5.2,5.8,5.2 5.8,5.2,5.8,5.2,5.8,6.4 5.8,5.2,5.8,5.2,6.4,5.2 5.8,5.2,5.8,5.2,6.4,5.8 5.8,5.2,5.8,6.4,5.2,5.8 5.8,5.2,5.8,6.4,5.2,6.4 5.8,5.2,5.8,6.4,5.8,5.2 5.8,5.2,5.8,6.4,5.8,6.4 5.8,5.2,6.4,5.2,5.8,5.2 5.8,5.2,6.4,5.2,5.8,6.4 5.8,5.2,6.4,5.2,6.4,5.2 5.8,5.2,6.4,5.2,6.4,5.8 5.8,5.2,6.4,5.8,5.2,5.8 5.8,5.2,6.4,5.8,5.2,6.4 5.8,5.2,6.4,5.8,6.4,5.2 5.8,5.2,6.4,5.8,6.4,5.8 5.8,6.4,5.2,5.8,5.2,5.8 5.8,6.4,5.2,5.8,5.2,6.4 5.8,6.4,5.2,5.8,6.4,5.2 5.8,6.4,5.2,5.8,6.4,5.8 5.8,6.4,5.2,6.4,5.2,5.8 5.8,6.4,5.2,6.4,5.2,6.4 5.8,6.4,5.2,6.4,5.8,5.2 5.8,6.4,5.2,6.4,5.8,6.4 5.8,6.4,5.8,5.2,5.8,5.2 5.8,6.4,5.8,5.2,5.8,6.4 5.8,6.4,5.8,5.2,6.4,5.2 5.8,6.4,5.8,5.2,6.4,5.8 5.8,6.4,5.8,6.4,5.2,5.8 5.8,6.4,5.8,6.4,5.2,6.4 5.8,6.4,5.8,6.4,5.8,5.2 5.8,6.4,5.8,6.4,5.8,6.4 6.4,5.2,5.8,5.2,5.8,5.2 6.4,5.2,5.8,5.2,5.8,6.4 6.4,5.2,5.8,5.2,6.4,5.2 6.4,5.2,5.8,5.2,6.4,5.8 6.4,5.2,5.8,6.4,5.2,5.8 6.4,5.2,5.8,6.4,5.2,6.4 6.4,5.2,5.8,6.4,5.8,5.2 6.4,5.2,5.8,6.4,5.8,6.4 6.4,5.2,6.4,5.2,5.8,5.2 6.4,5.2,6.4,5.2,5.8,6.4 6.4,5.2,6.4,5.2,6.4,5.2 6.4,5.2,6.4,5.2,6.4,5.8 6.4,5.2,6.4,5.8,5.2,5.8 6.4,5.2,6.4,5.8,5.2,6.4 6.4,5.2,6.4,5.8,6.4,5.2 6.4,5.2,6.4,5.8,6.4,5.8 6.4,5.8,5.2,5.8,5.2,5.8 6.4,5.8,5.2,5.8,5.2,6.4 6.4,5.8,5.2,5.8,6.4,5.2 6.4,5.8,5.2,5.8,6.4,5.8 6.4,5.8,5.2,6.4,5.2,5.8 6.4,5.8,5.2,6.4,5.2,6.4 6.4,5.8,5.2,6.4,5.8,5.2 6.4,5.8,5.2,6.4,5.8,6.4 6.4,5.8,6.4,5.2,5.8,5.2 6.4,5.8,6.4,5.2,5.8,6.4 6.4,5.8,6.4,5.2,6.4,5.2 6.4,5.8,6.4,5.2,6.4,5.8 6.4,5.8,6.4,5.8,5.2,5.8 6.4,5.8,6.4,5.8,5.2,6.4 6.4,5.8,6.4,5.8,6.4,5.2 6.4,5.8,6.4,5.8,6.4,5.8';
s = s.split(' ');
var test = s.map(function(item){
	return item.split(',');
});

var test1 = [[1,2,3], [2,1,3], [3,2,1], [2,3,4], [2,2,2], [4,5,6], [0,1,2]];
var test0 = [[5.2, 5.8, 6.4, 5.2, 5.8, 6.4], [5.2, 6.4, 5.8, 5.2, 6.4, 5.8], [5.8, 5.2, 6.4, 5.8, 5.2, 6.4], [5.8, 6.4, 5.2, 5.8, 6.4, 5.2], [6.4, 5.2, 5.8, 6.4, 5.2, 5.8], [6.4, 5.8, 5.2, 6.4, 5.8, 5.2]];

for(var i = 0; i < test.length; i++){
	var arr = test[i];
	results.push(findLargestArray(arr, i));
}

function findLargestArray(arr, i){
	var result = [];
	for(var n = 0; n < test.length; n++){
		var a = test[n];
		debugger;
		if(i !== n){
			if(compareArrays(arr, a)){
				result.push(a)
			}
		}
	}
	if(result.length > 0){
		return {base: arr, largest: result};
	} else {
	    return '';
	}
}

function compareArrays(a1, a2){
	//console.log(a1.join(), ' -- - -- ' ,a2.join());
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

function report(){
	results.forEach(function(item){
		if(item !== ''){
			console.log('Array ', item.base.join(), 'has ', item.largest.length, ' arrays')
		}
	});
}