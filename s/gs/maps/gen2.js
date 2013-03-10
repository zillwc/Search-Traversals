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
	
	var gen2 = {
		nodes:{
			A:{'color':notVisited,'shape':'dot','label':'A\n\t2','cost':'2'},
			B:{'color':notVisited,'shape':'dot','label':'B\n\t3','cost':'3'},
			C:{'color':notVisited,'shape':'dot','label':'C\n\t4','cost':'4'},
			D:{'color':notVisited,'shape':'dot','label':'D\n\t5','cost':'5'},
			E:{'color':notVisited,'shape':'dot','label':'E\n\t6','cost':'6'},
			F:{'color':notVisited,'shape':'dot','label':'F\n\t7','cost':'7'},
			G:{'color':notVisited,'shape':'dot','label':'G\n\t8','cost':'8'},
			H:{'color':notVisited,'shape':'dot','label':'H\n\t9','cost':'9'},
			I:{'color':notVisited,'shape':'dot','label':'I\n\t10','cost':'10'},
			J:{'color':notVisited,'shape':'dot','label':'J\n\t11','cost':'11'},
			K:{'color':notVisited,'shape':'dot','label':'K\n\t12','cost':'12'},
			L:{'color':notVisited,'shape':'dot','label':'L\n\t13','cost':'13'},
			M:{'color':notVisited,'shape':'dot','label':'M\n\t14','cost':'14'},
			N:{'color':notVisited,'shape':'dot','label':'N\n\t15','cost':'15'},
			O:{'color':notVisited,'shape':'dot','label':'O\n\t16','cost':'16'},
			P:{'color':notVisited,'shape':'dot','label':'P\n\t17','cost':'17'},
			Q:{'color':notVisited,'shape':'dot','label':'Q\n\t18','cost':'18'},
			R:{'color':notVisited,'shape':'dot','label':'R\n\t19','cost':'19'},
			S:{'color':notVisited,'shape':'dot','label':'S\n\t20','cost':'20'},
			T:{'color':notVisited,'shape':'dot','label':'T\n\t21','cost':'21'},
			U:{'color':notVisited,'shape':'dot','label':'U\n\t22','cost':'22'},
			V:{'color':notVisited,'shape':'dot','label':'V\n\t23','cost':'23'},
			W:{'color':notVisited,'shape':'dot','label':'W\n\t24','cost':'24'},
			X:{'color':notVisited,'shape':'dot','label':'X\n\t25','cost':'25'},
			Y:{'color':notVisited,'shape':'dot','label':'Y\n\t26','cost':'26'},
			Z:{'color':notVisited,'shape':'dot','label':'Z\n\t27','cost':'27'}
		},
		edges:{
			A: { B:{}, C:{} },
			B: { A:{}, D:{}, E:{} },
			C: { A:{}, F:{}, G:{} },
			D: { B:{}, H:{}, I:{} },
			E: { B:{}, J:{}, K:{} },
			F: { C:{}, L:{}, M:{} },
			G: { C:{}, N:{}, O:{} },
			H: { D:{}, P:{}, Q:{} },
			I: { D:{}, R:{}, S:{} },
			J: { E:{}, T:{}, U:{} },
			K: { E:{}, V:{}, W:{} },
			L: { F:{}, X:{}, Y:{} },
			M: { F:{}, Z:{} },
			N: { G:{} },
			O: { G:{} },
			P: { H:{} },
			Q: { H:{} },
			R: { I:{} },
			S: { I:{} },
			T: { J:{} },
			U: { J:{} },
			V: { K:{} },
			W: { K:{} },
			X: { L:{} },
			Y: { L:{} },
			Z: { M:{} }
		}
	}

	startNode = "";
	notFound = true;
	cost = 0;
	
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
		// Gets the total cost accumulated
		this.getTotalCost = function() {
			return cost;
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
			
			// Accumulating the cost
			cost += parseInt(this.getNodeCost(node));
			
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
	sys.graft(gen2);
	// Creating personal object with ref to canvas
	node = new nodes(sys);
		
	
