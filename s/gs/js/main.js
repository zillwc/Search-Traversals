$(function() {
	
	// init vars
	startN = "";
	
	// Resetting the input boxes & the search method
	$("#startNode, #goalNode, #depthLimit").val("");
	
	// Event for when map is changed
	$('#map').change(function() {
		var x = $(this).val();
		if (x!="")
    		window.location = "http://www.zillwc.com/cmpt388/s/gs/index.php?map="+x;
	});
		    	
	// Event when the reset button is clicked
	$("#reset").click(function() {
    	window.location.reload();
	});

	// Event when update button is clicked
   $('#update').click(function() {
   		if ($(this).attr("disabled") != "disabled") {
	   		$("#answerList").hide();
	   
	   		var x = validate($('#startNode').val());
	   		
	   		if (x != "") {
	   			if (startN != "") {
		   			node.deleteGoal(startN);
		   		}
	   			node.setStart(x);
	   			startN = x;
	   		}
	   		else
	   			alertify.alert("Enter a start node");
   		}
   });
   
   // Event when the search button is clicked
   $('#search').click(function() {
   
	   if ($(this).attr("disabled") != "disabled") {
	   		var x = validate($('#startNode').val());
	   		
	   		// Set the Start Node
	   		if (x != "") {
	   			if (startN != "") {
		   			node.deleteGoal(startN);
		   		}
	   			node.setStart(x);
	   			startN = x;
	   		}
	   		else
	   			alertify.alert("Enter a start node");
	   		
	   		// Setting searchMethod
			node.greedy(startN);
			
			// Getting the cost and displaying it
			$('#answerList').append('<p class="muted">Total Path Cost: '+node.getTotalCost()+'</p>');
		   	
	   		// Show the answer list			   			
	   		$('#answerList').show();	
		    
		    // Resetting the colors
		    node.setStart(startN);
		    // Disabling the buttons
		    disableBtns();
	    }
   });
   
   // Event to break apart the nodes
   $('.repulse').click(function() {
	  node.repulse(1000); 
   });
   
    
});

// Function to disable the update and search buttons
function disableBtns() {
    $("#update, #search").attr("disabled", "disabled");
}
// Function to check for whitespaces
function whiteSpaceCheck(str) {
    if (str.indexOf(" ") >= 0)
    	return true;
}
// Object to capitilize the first letter
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
// Function to validate the string (whitespace check & capitilize check)
function validate(str) {
	var valStr = "";
	
    if (whiteSpaceCheck(str)) {
	    var strArray = str.split(" ");
	    for (var i=0;i<strArray.length;i++) {
		    valStr += strArray[i].capitalize();
	    }
    } else {
	    valStr = str.capitalize();
    }
    
    return valStr;
}