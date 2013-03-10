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

	// General Data 2
	var gen2 = {
		nodes:{
			A: {'color':notVisited,'shape':'dot','label':'A\n\t0', 'cost': '0'},
			B: {'color':notVisited,'shape':'dot','label':'B\n\t4', 'cost': '4'},
			C: {'color':notVisited,'shape':'dot','label':'C\n\t5', 'cost': '5'},
			D: {'color':notVisited,'shape':'dot','label':'D\n\t4', 'cost': '4'},
			E: {'color':notVisited,'shape':'dot','label':'E\n\t5', 'cost': '5'},
			F: {'color':notVisited,'shape':'dot','label':'F\n\t3', 'cost': '3'},
			G: {'color':notVisited,'shape':'dot','label':'G\n\t5', 'cost': '5'},
			H: {'color':notVisited,'shape':'dot','label':'H\n\t3', 'cost': '3'},
			I: {'color':notVisited,'shape':'dot','label':'I\n\t6', 'cost': '6'},
			J: {'color':notVisited,'shape':'dot','label':'J\n\t6', 'cost': '6'},
			K: {'color':notVisited,'shape':'dot','label':'K\n\t8', 'cost': '8'},
			L: {'color':notVisited,'shape':'dot','label':'L\n\t5', 'cost': '5'},
			M: {'color':notVisited,'shape':'dot','label':'M\n\t6', 'cost': '6'},
			N: {'color':notVisited,'shape':'dot','label':'N\n\t7', 'cost': '7'},
			O: {'color':notVisited,'shape':'dot','label':'O\n\t9', 'cost': '9'}
		},
		edges:{
			A: { B:{}, C:{} },
			B: { A:{}, D:{}, E:{} },
			C: { A:{}, F:{}, G:{} },
			D: { B:{}, H:{}, I:{} },
			E: { B:{}, J:{}, K:{} },
			F: { C:{}, L:{}, M:{} },
			G: { C:{}, N:{}, O:{} },
			H: { D:{} },
			I: { D:{} },
			J: { E:{} },
			K: { E:{} },
			L: { F:{} },
			M: { F:{} },
			N: { G:{} },
			O: { G:{} }
		}

	};	
	
	// Init vars for searches
	startNode = "";
	goalNode = "";
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
			return this.obj.getNode(node).data.cost;
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
			sys.getEdgesFrom("Brisbane")[0].target.name;
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
		
		
		// Depth First Search Algorithm
		this.dfs = function(node) {
			if (notFound) {
				
				// Setting the current node as the start node -- marking it red
				$("#answerList").append('<p class="red">'+node+'</p>');
				
				// If the node is the current goal, return
				if (goalNode == node) {
					notFound = false;
					return;
				}
				
				// Pushing the node onto the stack, onto the results stack, and marking it visited
				stack.push(node);
				this.setVisited(node);
				
				// Getting the edges for this node as an array
				var temp = this.getEdges(node);
				
				if (temp.length == 0)
					return;
				
				// Visit every node inside this node
				for (var i=0;i<temp.length;i++) {
					name = this.getNodeName(temp[i]);
					// If the node isn't visited, visit it
					if (!this.isVisited(name)) {
						this.dfs(name);
					}
				}
			}
			return;
		}
		
		// Depth Limited Search Algorithm
		this.dls = function(node, goal, d) {
			if (d >= 0 && notFound) {
				$("#answerList").append('<p class="red">'+node+'</p>');
				
				// If goal is found, return the node back
				if (node == goal) {
					notFound = false;	return node;
				}
				
				// Set the node visited
				this.setVisited(node);
				
				// Get all the edges for this ndoe
				var temp = this.getEdges(node);
				if (temp.length == 0)
					return;
				
				// Loop to expand on the current node's edges
				for (var i=0;i<temp.length;i++) {
					name = this.getNodeName(temp[i]);
					// If the node isn't visited, visit it with a decreased depth
					if (!this.isVisited(name)) {
						this.dls(name, goal, d-1);
					}
				}
			}
		}
		
		
		
		// Iterative Deepening Depth First Search Algorithm
		this.iddfs = function(node, goal) {
			// Setting init val of depth at 0
			depth = 0;
			// Keep looping while goal is not found -- incrementing depth each loop
			while (notFound) {
				$("#answerList").append('<p class="muted">Depth: '+depth+'</p>');
				this.resetNodes();					// Resetting the state of the nodes
				this.iddfsDLS(node, goal, depth);	// Calling DLS on specified depth
				depth += 1;							// Incrementing the depth
			}
		}
		// Custom IDDFS DLS Algorithm
		this.iddfsDLS = function(node, goal, d) {
			if (d >= 0 && notFound) {
				$("#answerList").append('<p class="red">'+node+'</p>');
				
				// If goal is found, return the node back
				if (node == goal) {
					notFound = false;	return;
				}
				// Set the node visited
				this.setVisited(node);
				
				// Get all the edges for this ndoe
				var temp = this.getEdges(node);
				
				// Loop to expand on the current node's edges
				for (var i=0;i<temp.length;i++) {
					name = this.getNodeName(temp[i]);
					this.dls(name, goal, d-1);
				}
			}
			return;
		}

		/*******************************************
			ALL SEARCH ALGORITHMS -- ABOVE
		*******************************************/	
		
		
	}
	
	
	
	
	// Executing draw on canvas
	sys.graft(gen2);
	// Creating personal object with ref to canvas
	node = new nodes(sys);
		
	
