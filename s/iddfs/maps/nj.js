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
	
	// NewJersey Data
	var nj = {
		nodes:{
			Sussex: {'color':notVisited,'shape':'dot','label':'Sussex\n\t0', 'cost': '0'},
			Warren: {'color':notVisited,'shape':'dot','label':'Warren\n\t10', 'cost': '10'},
			Atlantic: {'color':notVisited,'shape':'dot','label':'Atlantic\n\t10', 'cost': '10'},
			Monmouth: {'color':notVisited,'shape':'dot','label':'Monmouth\n\t10', 'cost': '10'},
			Morris: {'color':notVisited,'shape':'dot','label':'Morris\n\t11', 'cost': '11'},
			CapeMay: {'color':notVisited,'shape':'dot','label':'Cape May\n\t11', 'cost': '11'},
			Hudson: {'color':notVisited,'shape':'dot','label':'Hudson\n\t11', 'cost': '11'},
			Passaic: {'color':notVisited,'shape':'dot','label':'Passaic\n\t12', 'cost': '12'},
			Union: {'color':notVisited,'shape':'dot','label':'Union\n\t12', 'cost': '12'},
			Hunterdon: {'color':notVisited,'shape':'dot','label':'Hunterdon\n\t12', 'cost': '12'},
			Mercer: {'color':notVisited,'shape':'dot','label':'Mercer\n\t12', 'cost': '12'},
			Somerset: {'color':notVisited,'shape':'dot','label':'Somerset\n\t13', 'cost': '13'},
			Burlington: {'color':notVisited,'shape':'dot','label':'Burlington\n\t13', 'cost': '13'},
			Gloucester: {'color':notVisited,'shape':'dot','label':'Gloucester\n\t13', 'cost': '13'},
			Salem: {'color':notVisited,'shape':'dot','label':'Salem\n\t13', 'cost': '13'},
			Bergen: {'color':notVisited,'shape':'dot','label':'Bergen\n\t14', 'cost': '14'},
			Essex: {'color':notVisited,'shape':'dot','label':'Essex\n\t14', 'cost': '14'},
			Middlesex: {'color':notVisited,'shape':'dot','label':'Middlesex\n\t15', 'cost': '15'},
			Ocean: {'color':notVisited,'shape':'dot','label':'Ocean\n\t15', 'cost': '15'},
			Camden: {'color':notVisited,'shape':'dot','label':'Camden\n\t15', 'cost': '15'},
			Cumberland: {'color':notVisited,'shape':'dot','label':'Cumberland\n\t16', 'cost': '16'}
			
		},	
		edges: {
			Sussex: { Warren:{}, Passaic:{}, Bergen:{} },
			Warren: { Sussex:{}, Morris:{} },
			Passaic: { Sussex:{}, Essex:{} },
			Bergen: { Sussex:{}, Hudson:{} },
			Morris: { Warren:{}, Hunterdon:{}, Somerset:{}, Essex:{} },
			Essex: { Morris:{}, Passaic:{}, Union:{} },
			Hudson: { Union:{}, Bergen:{} },
			Union: { Hudson:{}, Essex:{}, Middlesex:{} },
			Hunterdon: { Morris:{}, Mercer:{} },
			Somerset: { Middlesex:{}, Morris:{} },
			Mercer: { Hunterdon:{}, Burlington:{}, Camden:{} },
			Middlesex: { Union:{}, Somerset:{}, Monmouth:{} },
			Monmouth: { Middlesex:{}, Ocean:{} },
			Burlington: { Mercer:{} },
			Ocean: { Atlantic:{}, CapeMay:{}, Monmouth:{} },
			Camden: { Mercer:{}, Gloucester:{}, Salem:{} },
			Atlantic: { Ocean:{} },
			CapeMay: { Ocean:{} },
			Gloucester: { Camden:{} },
			Salem: { Camden:{}, Cumberland:{} },
			Cumberland: { Salem:{} }
		}
	};
	
	
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
	sys.graft(nj);
	// Creating personal object with ref to canvas
	node = new nodes(sys);
		
	
