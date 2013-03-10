	// Init arbor system
	var sys = arbor.ParticleSystem(1000, 400,1);
	sys.parameters({stiffness:100, repulsion:5, gravity:true, dt:0.015, padding:10});
	sys.screenPadding('50', '50', '50', '50');
	sys.renderer = Renderer("#viewport");
	
	// saving colors as node status
	startPoint = '#FF1451';
	notVisited = '#1385B0';
	visited = '#BF3F34';
	goalColor = '#4BD69D';


	// Montclair State University Computer Science Department Data
	var msu = {
		nodes:{
			CMPT183: {'color':notVisited,'shape':'dot','label':'CMPT183','cost':'183'},
			CMPT184: {'color':notVisited,'shape':'dot','label':'CMPT184','cost':'184'},
			CMPT280: {'color':notVisited,'shape':'dot','label':'CMPT280','cost':'280'},
			CMPT281: {'color':notVisited,'shape':'dot','label':'CMPT281','cost':'281'},
			CMPT285: {'color':notVisited,'shape':'dot','label':'CMPT285','cost':'285'},
			CMPT287: {'color':notVisited,'shape':'dot','label':'CMPT287','cost':'287'},
			CMPT363: {'color':notVisited,'shape':'dot','label':'CMPT363','cost':'363'},
			CMPT371: {'color':notVisited,'shape':'dot','label':'CMPT371','cost':'371'},
			CMPT372: {'color':notVisited,'shape':'dot','label':'CMPT372','cost':'372'},
			CMPT385: {'color':notVisited,'shape':'dot','label':'CMPT385','cost':'385'},
			CMPT387: {'color':notVisited,'shape':'dot','label':'CMPT387','cost':'387'},
			CMPT388: {'color':notVisited,'shape':'dot','label':'CMPT388','cost':'388'},
			CMPT472: {'color':notVisited,'shape':'dot','label':'CMPT472','cost':'472'},
			CMPT483: {'color':notVisited,'shape':'dot','label':'CMPT483','cost':'483'},
			CMPT484: {'color':notVisited,'shape':'dot','label':'CMPT484','cost':'484'},
			CMPT485: {'color':notVisited,'shape':'dot','label':'CMPT485','cost':'485'},
			CMPT486: {'color':notVisited,'shape':'dot','label':'CMPT486','cost':'486'},
			CMPT487: {'color':notVisited,'shape':'dot','label':'CMPT487','cost':'487'},
			CMPT493: {'color':notVisited,'shape':'dot','label':'CMPT493','cost':'493'},
			CMPT495: {'color':notVisited,'shape':'dot','label':'CMPT495','cost':'495'},
			CMPT497: {'color':notVisited,'shape':'dot','label':'CMPT497','cost':'497'},
			CMPT498: {'color':notVisited,'shape':'dot','label':'CMPT498','cost':'498'},
			CMPT499: {'color':notVisited,'shape':'dot','label':'CMPT499','cost':'499'}
		},
		edges:{
			CMPT183: { CMPT184:{}, CMPT363:{} },
			CMPT184: { CMPT183:{}, CMPT280:{}, CMPT285:{}, CMPT287:{} },
			CMPT280: { CMPT184:{}, CMPT281:{} },
			CMPT281: { CMPT280:{} },
			CMPT285: { CMPT184:{} },
			CMPT287: { CMPT184:{}, CMPT371:{}, CMPT472:{}, CMPT495:{} },
			CMPT363: { CMPT183:{} },
			CMPT371: { CMPT287:{}, CMPT372:{}, CMPT388:{}, CMPT483:{}, CMPT484:{} },
			CMPT372: { CMPT372:{} },
			CMPT385: { CMPT281:{} },
			CMPT387: { CMPT281:{} },
			CMPT388: { CMPT371:{} },
			CMPT472: { CMPT287:{} },
			CMPT483: { CMPT371:{}, CMPT493:{} },
			CMPT484: { CMPT371:{}, CMPT485:{} },
			CMPT485: { CMPT484:{}, CMPT486:{}, CMPT487:{} },
			CMPT486: { CMPT485:{} },
			CMPT487: { CMPT485:{} },
			CMPT493: { CMPT483:{} },
			CMPT495: { CMPT287:{} },
			CMPT497: { CMPT281:{} },
			CMPT498: { CMPT281:{} },
			CMPT499: { CMPT371:{} }		
		}
	};	
	
	startNode = "";
	notFound = true;
	
	// Javascript implementation for a stack
	function Stack() {
	 	this.stac = new Array();
	 	this.pop = function() {
		 	return this.stac.pop();
		 }
		this.peek = function() {
			return this.stac[this.stac.length - 1];
		}
		this.push = function(item) {
			 this.stac.push(item);
		}
		this.deleteItem = function(item) {
			var temp = new Array();
			for (var i=0;i<this.stac.length;i++) {
				if (this.stac[i]!=item)
					temp.push(this.stac.pop());
				else
					console.log("Goal "+item+" deleted.");
			}
			this.stac = temp;
		}
		this.emptyStack = function() {
			if (this.stac.length = 0)
				return
			else {
				for (var i=0;i<this.stac.length;i++)
					this.stac.pop();
			}
			return;
		}
	}
	// Javascript implementation for a queue
	function Queue(){
		var queue  = [];
		var offset = 0;
	
	    this.getLength = function(){
	    	return (queue.length - offset);
	    }
	    this.isEmpty = function(){
	    	return (queue.length == 0);
	    }
	    this.enqueue = function(item){
	    	queue.push(item);
	    }
	    this.dequeue = function() {
	    	if (queue.length == 0) return undefined;
	    	var item = queue[offset];
	
	    	// increment the offset and remove the free space if necessary
	    	if (++ offset * 2 >= queue.length){
		   	   queue  = queue.slice(offset);
		   	   offset = 0;
		   	}
	    	return item;
	    }
		this.peek = function(){
	    	return (queue.length > 0 ? queue[offset] : undefined);
	    }
	}
	
	// Object made to handle the search and its functions
	function nodes(sysObj) {
		// Setting the arbor obj to this object
		this.obj = sysObj;
		stack = new Stack();
		queue = new Queue();
		
		// Gets the cost value of the node
		this.getNodeCost = function(node) {
			return parseInt(this.obj.getNode(node).data.cost);
		}		
		// Sets the color of a given node
		this.setNodeCost = function(node, c) {
			this.obj.getNode(node).data.cost = c;
		}
		
		// Gets the color of the node
		this.getNodeColor = function(node) {
			return this.obj.getNode(node).data.color;
		}
		// Sets the color of a given node
		this.setNodeColor = function(node, c) {
			sys.getNode(node).data.color = c;
		}
		
		// Gets the label of the node obj
		this.getNodeName = function(node) {
			return node.target.name;
		}
		
		// Sets a node as visited
		this.setVisited = function(node) {
			this.setNodeColor(node, visited);
		}
		// Sets a node as not visited
		this.setNotVisited = function(node) {
			this.setNodeColor(node, notVisited);
		}
		// Returns true or false depending on whether the node has been visited on not
		this.isVisited = function(node) {
			if (this.getNodeColor(node) == visited)
				return true;
			return false;
		}
		
		// Sets the new goal
		this.setGoal = function(node) {
			this.setNodeColor(node, goalColor);
			goalNode = node;
		}
		// Sets the start point
		this.setStart = function(node) {
			this.setNodeColor(node, startPoint);
			startNode = node;
		}
		// Deletes the specified goal
		this.deleteGoal = function(node) {
			this.setNodeColor(node, notVisited);
		}
		
		// Get the edges for the specified node
		this.getEdges = function(node) {
			return this.obj.getEdgesFrom(node);
		}
		this.repulse = function(num) {
			this.obj.parameters({repulsion:num});
		}
		// Sets all nodes back to Not Visited State
		this.resetNodes = function() {
			this.obj.eachNode(function(e) {
				sys.getNode(e.name).data.color = '#1385B0';
			});
		}
		
		
		
		
		/*******************************************
			ALL SEARCH ALGORITHMS -- BELOW
		*******************************************/
		
		/*
			visit node
			
			get smallest edge that is not visited
			
			call the recursive function on ^ node
			
			if no edges, return back.
		
		*/
		
		
		this.greedy = function(node) {
			// Getting the edges
			var temp = this.getEdges(node);
			
			// Visiting the node
			$("#answerList").append('<p class="red">'+node+'</p>');
			this.setVisited(node);
			
			if (temp.length == 1)
				return;
			
			// For all the edges
			for (var i=0;i<temp.length;i++) {
				name = this.getNodeName(temp[i]);
				
				// Getting the smallest node
				var smallestNode =  -1;
				var smallest = this.getNodeCost(name);
				
				if (this.getNodeCost(name) <= smallest && !this.isVisited(name)) {
					smallest = this.getNodeCost(name);
					smallestNode = i;
				}
			}
			
			if (smallestNode != -1)
				this.greedy(this.getNodeName(temp[smallestNode]));
			
			return;
		}
		

		/*******************************************
			ALL SEARCH ALGORITHMS -- ABOVE
		*******************************************/	
		
		
	}
	
	
	
	
	// Executing draw on canvas
	sys.graft(gen);
	// Creating personal object with ref to canvas
	node = new nodes(sys);
		
	
