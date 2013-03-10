<?php
	
	// Getting stored GET session
	if (isset($_GET['map'])) {
		$map = $_GET['map']; 
	} else {
		$map = "gen";
	}
	
	// Setting map title
	$mapName = "";
	switch($map) {
		case 'nj':
			$mapName = "New Jersey";
			break;
		case 'aus':
			$mapName = "Australia";
			break;
		case 'gen':
			$mapName = "General";
			break;
		case 'gen2':
			$mapName = "General Extended";
			break;
		case 'spread':
			$mapName = "Spread";
			break;
	}

?>

<!DOCTYPE html>
<html lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta charset="utf-8">
    <title>Search: IDDFS</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="IDDFS Search">
    <meta name="author" content="Zill Christian">

    <!-- CSS -->
    <link href="../../css/bootstrap.min.css" rel="stylesheet">
    <link href="../../css/m-styles.min.css" rel="stylesheet"> 
    <link href="../../css/main.css" rel="stylesheet">
    <link href="../../css/bootstrap-responsive.min.css" rel="stylesheet">

    <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="../assets/js/html5shiv.js"></script>
    <![endif]-->
  </head>

  <body>


    <!-- Part 1: Wrap all page content here -->
    <div id="wrap">

      <!-- Begin page content -->
      <div class="container">
        <div class="page-header">
          <!--h4>Iterative Deepening Depth First Search</h4-->
          <p class="lead">Iterative Deepening Depth First Search: <em class="repulse text-info"><?php echo $mapName; ?> Map</em></p>
        </div>
      </div>
      
    <script type="text/javascript" src="../../js/jquery.js"></script>
    <script type="text/javascript" src="../../js/arbor/arbor.js"></script>
    <script type="text/javascript" src="../../js/arbor/arbor-tween.js"></script>
    <script type="text/javascript" src="../../js/arbor/graphics.js"></script>
    <script type="text/javascript" src="../../js/arbor/renderer.js"></script>
      
      <div>
	      <!-- Canvas to display all content -->
		 <canvas id="viewport" width="1080" height="680"></canvas>
		 <!-- Console screen -->
		 <div id="console" class="">
		 	
		 	<label class="map" for="map">Select Map</label>
		 	<select class="span3 map" id="map">
		 		<option value="" selected=""></option>
		 		<option value="spread" <?php if($map=="spread") echo "selected"; ?> >Spread</option>
		 		<option value="gen" <?php if($map=="gen") echo "selected"; ?> >General</option>
		 		<option value="gen2" <?php if($map=="gen2") echo "selected"; ?> >General Extended</option>
		 		<option value="nj" <?php if($map=="nj") echo "selected"; ?> >New Jersey</option>
		 		<option value="aus" <?php if($map=="aus") echo "selected"; ?> >Australia</option>
		 	</select>
		 	<br /><br />
		 	<label class="map" for="searchMethod">Select Search</label>
		 	<select class="span3 map" id="searchMethod">
		 		<option value="" selected=""></option>
		 		<option value="dfs" selected>Depth First Search</option>
		 		<option value="dls">Depth Limited Seach</option>
		 		<option value="iddfs">Iterative Deepening DFS</option>		 		
		 	</select>
		 	
		 	<br /><br />
		 	
		 	<label for="startNode">Start Node</label>
			<input type="text" class="span3 m-wrap" id="startNode" placeholder="Enter start node name here..">
			
			<label for="goalNode">Goal Node</label>
			<input type="text" class="span3 m-wrap" id="goalNode" placeholder="Enter goal node name here..">
			
			<div id="depthLimit">
			<label for="depth">Depth Limit</label>
			<input type="text" class="span3 m-wrap" id="depth" placeholder="Enter depth here..">
			</div>

			
			<a href="#update" id="update" class="m-btn green">Update</a>
			<a href="#search" id="search" class="m-btn red">Start Search</a>
			<a href="#reset" id="reset" class="m-btn gray">Reset</a>
			
			<div id="answerList" class="span3">
			</div>
		 </div>
	</div>

    <!-- Loading custom search algorithms -->
    <script type="text/javascript" src="../../js/bootstrap/bootstrap.min.js"></script>
    <script type="text/javascript" src="maps/<?php echo $map; ?>.js"></script>
    <script type="text/javascript" src="js/main.js"></script>
</body></html>