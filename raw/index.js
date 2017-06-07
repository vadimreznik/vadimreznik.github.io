window.onload = init;

function init(){
	var test = [[5.2, 5.8, 6.4, 5.2, 5.8, 6.4], [5.2, 6.4, 5.8, 5.2, 6.4, 5.8], [5.8, 5.2, 6.4, 5.8, 5.2, 6.4], [5.8, 6.4, 5.2, 5.8, 6.4, 5.2], [6.4, 5.2, 5.8, 6.4, 5.2, 5.8], [6.4, 5.8, 5.2, 6.4, 5.8, 5.2], [5.2, 5.8, 6.4, 5.2, 5.8, 6.4], [5.2, 6.4, 5.8, 5.2, 6.4, 5.8], [5.8, 5.2, 6.4, 5.8, 5.2, 6.4], [5.8, 6.4, 5.2, 5.8, 6.4, 5.2], [6.4, 5.2, 5.8, 6.4, 5.2, 5.8], [6.4, 5.8, 5.2, 6.4, 5.8, 5.2], [5.2, 5.8, 6.4, 5.2, 5.8, 6.4], [5.2, 6.4, 5.8, 5.2, 6.4, 5.8], [5.8, 5.2, 6.4, 5.8, 5.2, 6.4], [5.8, 6.4, 5.2, 5.8, 6.4, 5.2], [6.4, 5.2, 5.8, 6.4, 5.2, 5.8], [6.4, 5.8, 5.2, 6.4, 5.8, 5.2], [5.2, 5.8, 6.4, 5.2, 5.8, 6.4], [5.2, 6.4, 5.8, 5.2, 6.4, 5.8], [5.8, 5.2, 6.4, 5.8, 5.2, 6.4], [5.8, 6.4, 5.2, 5.8, 6.4, 5.2], [6.4, 5.2, 5.8, 6.4, 5.2, 5.8], [6.4, 5.8, 5.2, 6.4, 5.8, 5.2], [5.2, 5.8, 6.4, 5.2, 5.8, 6.4], [5.2, 6.4, 5.8, 5.2, 6.4, 5.8], [5.8, 5.2, 6.4, 5.8, 5.2, 6.4], [5.8, 6.4, 5.2, 5.8, 6.4, 5.2], [6.4, 5.2, 5.8, 6.4, 5.2, 5.8], [6.4, 5.8, 5.2, 6.4, 5.8, 5.2], [5.2, 5.8, 6.4, 5.2, 5.8, 6.4], [5.2, 6.4, 5.8, 5.2, 6.4, 5.8], [5.8, 5.2, 6.4, 5.8, 5.2, 6.4], [5.8, 6.4, 5.2, 5.8, 6.4, 5.2], [6.4, 5.2, 5.8, 6.4, 5.2, 5.8], [6.4, 5.8, 5.2, 6.4, 5.8, 5.2], [5.2, 5.8, 6.4, 5.2, 5.8, 6.4], [5.2, 6.4, 5.8, 5.2, 6.4, 5.8], [5.8, 5.2, 6.4, 5.8, 5.2, 6.4], [5.8, 6.4, 5.2, 5.8, 6.4, 5.2], [6.4, 5.2, 5.8, 6.4, 5.2, 5.8], [6.4, 5.8, 5.2, 6.4, 5.8, 5.2], [5.2, 5.8, 6.4, 5.2, 5.8, 6.4], [5.2, 6.4, 5.8, 5.2, 6.4, 5.8], [5.8, 5.2, 6.4, 5.8, 5.2, 6.4], [5.8, 6.4, 5.2, 5.8, 6.4, 5.2], [6.4, 5.2, 5.8, 6.4, 5.2, 5.8], [6.4, 5.8, 5.2, 6.4, 5.8, 5.2]];

	var parallels = new Parallel({
		threads: 4,
		scope: [sum, avg]
	});

	for(var i = 0; i < test.length; i++){
		parallels.do(avg, test[i])
	}

	function sum(arr){
		return arr.reduce(function(x, y) { return x + y; }, 0);
	}

	function avg(arr){
		setTimeout(function(){
			var s = sum(arr)/arr.length;
			console.log(s);
		}, 3000);
	}

}

function Parallel(opt){
	this.threads = opt.threads;
	this.scope = opt.scope;
	this.queue = [];
}

Parallel.prototype = {
	inProgress: 0,
	do: function(job, params){
		this.queue.push([job, params]);
		this.next();
	},
	next: function(){
		var that = this;
		if(this.queue.length <= this.threads){
			this.createWorker();
		}
	},
	createWorker: function(){
		var that = this;
		if(!!this.queue.length){
			var doItem = this.queue.splice(0, 1);
			var blob = new Blob(['onmessage = function(e){ postMessage(' + doItem[0][0].name + '(e.data)); };' + this.scope.join('')], { type: "text/javascript" });
			var blobUrl = URL.createObjectURL(blob);
			var worker = new Worker(blobUrl);	
			worker.onmessage = function(e){
				that.next();
			};
			worker.postMessage(doItem[0][1]);
		}
	}
};