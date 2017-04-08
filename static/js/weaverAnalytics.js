var image
function inputAnalysis(images)
{
	console.log(images)
	image = images[0]
  
	var reader  = new FileReader();
	
	reader.addEventListener("load", function () { 
  
	$.ajax({
	   type: "POST",
	   data: { 'image' : reader.result},
	   url:"/imageAnalysis",
	   success: function(response) {
		  
		  
		    var preview = document.getElementById('image');
		    preview.src = reader.result;
			b = document.getElementById('classifier');
			b.innerHTML = "Who is it? It's Bob"

	   }
	})
	
	}, false);
	
	
	
    reader.readAsDataURL(image);


	
}


function intersectionStart(intersection)
{
	$.ajax({
	   type: "POST",
	   data: { 'intersection' : intersection},
	   url:"/intersectionStart",
	   success: function(response) {
		  
			startTime = response['startTime']
			endTime = response['endTime']
			offset = 1000
			console.log('intersection times')
			console.log(startTime)
			
			console.log(endTime)
			plotGraphs(startTime, parseInt(startTime)+offset, intersection)
			plotIntersection(startTime)
		
		
			// //set intersection slider
			// b = document.getElementById('slider_value');
			// b.min = startTime
			// b.max = endTime
			// b.value = startTime
			
			//modify slider
			$( function() {
				$( "#slider" ).slider({
					range: true,
					min: parseInt(startTime),
					max: parseInt(endTime),
					values: [ parseInt(startTime), parseInt(startTime)+offset ],
					create: function( event, ui ) {
						// console.log(ui)
						// plotGraphs(parseInt(startTime),parseInt(startTime)+ offset)
					},
					stop: function( event, ui ) {
						plotGraphs(ui.values[ 0 ],ui.values[ 1 ], intersection)
					},
					slide: function( event, ui ) {
						if(ui.value == ui.values[0])
						{
							$(this).slider( 'values', 1, ui.value+ offset );
						}
						else
						{
							offset = ui.values[1] - ui.values[0]
						}
						$( "#timeRange" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
					}
				});
				
				
				$( "#timeRange" ).val(  $( "#slider" ).slider( "values", 0 ) +
				" - " + $( "#slider" ).slider( "values", 1 ) );
			} );

			
			
			//set slider labels current value
			b = document.getElementById('time');
			b.innerHTML = 'Intersection at ' + startTime.toString()
			
			
	   }
	})
}





// function inputDayData(value) {

	// $.get('./static/skyResources/' + value + '/' + value + '.json' , function (data) 
	// { day_data   = JSON.parse(data); 	}).done( function () {
		
			// //Vehicle Information
		// trajectoryList = day_data['trajectory_list'];
		// startTime = day_data['startTime'];
		// endTime = day_data['endTime'];
		// Trajectories = day_data['trajectories'];

		// //Intersection Informatoin
		// LinkSignalLocations =  day_data['link_signal_locations'];
		// Layout = day_data['layout'];
		// Links_lane = day_data['links_lane'];
		// Lane_links = day_data['lane_links'];
		// Stop_dist = day_data['stop_dist'];
		// Lane_adjust = day_data['lane_adjust'];
		// Phase_movement = day_data['phase_movement'];

		// //Controller Information
		// Controller_log = day_data['controller_log'];


		
		
		// plotIntersection(startTime)
		
		// //set sliders min,max, value
		// b = document.getElementById('slider_value');
		// b.min = startTime
		// b.max = endTime
		// b.value = startTime
		
		
		// //set slider labels current value
		// b = document.getElementById('time');
		// b.innerHTML = "Intersection at " + startTime.toString()
		
		
		
		// //plot distance vs time
		// a = document.getElementById('distance_v_time');


		// Plotly.plot( a, 
			// trajectoryList,
			// {	// title: "Per Vehicle Distance Over Time"  ,
				// xaxis: {
						// title: 'timestep',
						// showgrid: false 
						// },
				// yaxis: {
						// title: 'distance',
						// showgrid: false 
						// },
				// margin: { t: 0 , b: 40, l: 50, r: 1}, 
				// showlegend: false 
			// } 
			// );
			
		// } )
		
		
// }
  




// function incrementTime() {
	// if (autoplay_toggle.checked ) {
		
		// if ( document.getElementById('slider_value').value == endTime){
			// document.getElementById('slider_value').value = startTime
			// outputUpdate(parseInt(document.getElementById('slider_value').value))
		// }
		// else{
			// document.getElementById('slider_value').value = parseInt(document.getElementById('slider_value').value)+5
			// outputUpdate(parseInt(document.getElementById('slider_value').value))
		// }
		
	// }
// }
	

// function outputUpdate(time) {
	// document.querySelector('#time').value = 'Intersection at timestep = ' + time.toString();

	
	// plotIntersection(time)
// }



			
// function plotIntersection(time, link_signal_locations =  LinkSignalLocations, layout = Layout, trajectories = Trajectories, 
							// links_lane = Links_lane, lane_links = Lane_links, stop_dist = Stop_dist, lane_adjust = Lane_adjust, 
							// controller_log = Controller_log, phase_movement = Phase_movement){
	

	
	
	// current_trajectories = []
	// for (i = 0; i < trajectories.length; i++) {
		// path = []
		// for (j = 0; j < trajectories[i]['snapshots'].length; j++) {
			
				// x = trajectories[i]['snapshots'][j];

				// if (x['time'] > time - 10 && x['time'] < time) {
					
					// // tlane = links_lane[   lane_links[x['lane']]   ].index(x['lane'])

					// tlane = x['lane'] %2
					
					
					// if (lane_links[x['lane']] == 1){
						// path.push([-stop_dist/4 - lane_adjust*tlane, x['distance']+stop_dist])
					// } 
					// else if( lane_links[x['lane']] == 2){
						// path.push([stop_dist/4 + lane_adjust*tlane, x['distance']+stop_dist])
					// }
					// else if (lane_links[x['lane']] == 3){
						// path.push([x['distance']+stop_dist, stop_dist/4 + lane_adjust*tlane])
					// }
					// else if (lane_links[x['lane']] == 4){
						// path.push([x['distance']+stop_dist, -stop_dist/4 - lane_adjust*tlane])
					// }
					// else if (lane_links[x['lane']] == 5){
						// path.push([stop_dist/4 + lane_adjust*tlane, -x['distance']-stop_dist])
					// }
					// else if (lane_links[x['lane']] == 6){
						// path.push([-stop_dist/4 - lane_adjust*tlane, -x['distance']-stop_dist])
					// }
					// else if (lane_links[x['lane']] == 7){
						// path.push([-x['distance']-stop_dist, -stop_dist/4 - lane_adjust*tlane])
					// }
					// else if (lane_links[x['lane']] == 8){
						// path.push([-x['distance']-stop_dist, stop_dist/4 + lane_adjust*tlane])
					// }
				// }
		// }
	
		// var x_val = path.map(function(x) { return x[0]; });
		// var y_val = path.map(function(x) { return x[1]; });
			   
			   
		// current_trajectories.push( {'x': x_val, 'y': y_val} )

	// }
	
	

	// f = function timeCheck(x) {
		// return x < time;
		// }
	
	// log_times = Object.keys(controller_log)
	// log_times = log_times.filter(f)
	// log_times = log_times.map( Number )
	
	
	
	// if ( log_times.length > 0){
		// closest = Math.max(...log_times).toString()
	// }
	// else{
		// closest = Math.min(...log_times).toString()
	// }
		
	// green_phases = []
	// red_phases = []
	// yellow_phases = []
	
	
	// var Newlayout = jQuery.extend(true, {}, layout);
	
	
	// for (i = 0; i < 8; i++) {
		// if ( controller_log[closest][i] == 1){
			// green_phases.push( i+1);
		// }
		// else if ( controller_log[closest][i] == 0){
			// red_phases.push( i+1);
		// }
		// else{
			// yellow_phases.push(i+1)
		// }
	// }
	

		
	// for (i = 0; i < green_phases.length; i++) {
		// if (phase_movement[green_phases[i]]['through'] == true){
			// loc = link_signal_locations[phase_movement[green_phases[i]]['from']]['through']
		// }
		// else{
			// loc = link_signal_locations[phase_movement[green_phases[i]]['from']]['left']
		// }

		// Newlayout['shapes'].push( {
				// 'type': 'rect',
				// 'x0': loc[0],
				// 'y0': loc[1],
				// 'x1': loc[0] + stop_dist/12,
				// 'y1': loc[1] + stop_dist/12,
				// 'line': {
					// 'color': 'rgb(102,255,0)',
				// },
				// 'fillcolor': 'rgb(102,255,0)'
			// } )
	// }

	// for (i = 0; i < red_phases.length; i++) {
		// if (phase_movement[red_phases[i]]['through'] == true){
			// loc = link_signal_locations[phase_movement[red_phases[i]]['from']]['through']
		// }
		// else{
			// loc = link_signal_locations[phase_movement[red_phases[i]]['from']]['left']
		// }

		// Newlayout['shapes'].push( {
				// 'type': 'rect',
				// 'x0': loc[0],
				// 'y0': loc[1],
				// 'x1': loc[0] + stop_dist/12,
				// 'y1': loc[1] + stop_dist/12,
				// 'line': {
					// 'color': 'red',
				// },
				// 'fillcolor': 'red'
			// } )
	// }
	
		// for (i = 0; i < yellow_phases.length; i++) {
		// if (phase_movement[yellow_phases[i]]['through'] == true){
			// loc = link_signal_locations[phase_movement[yellow_phases[i]]['from']]['through']
		// }
		// else{
			// loc = link_signal_locations[phase_movement[yellow_phases[i]]['from']]['left']
		// }

		// Newlayout['shapes'].push( {
				// 'type': 'rect',
				// 'x0': loc[0],
				// 'y0': loc[1],
				// 'x1': loc[0] + stop_dist/12,
				// 'y1': loc[1] + stop_dist/12,
				// 'line': {
					// 'color': 'yellow',
				// },
				// 'fillcolor': 'yellow'
			// } )
	// }



	
	// Newlayout['showlegend'] = false 

	// current_trajectories['type'] = 'scatter'
	
	// b = document.getElementById('intersection');

	
				
	// Plotly.newPlot( b, 
				// current_trajectories,
				// Newlayout
				// );
// }
			
