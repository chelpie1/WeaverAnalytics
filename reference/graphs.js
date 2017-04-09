day_data: undefined; 
var intervalID = window.setInterval(incrementTime, 200);
Newlayout: undefined;
layout: undefined;



console.log('hibye')
$.get('../static/skyResources/dynamic.json' , function (data) 
{ networkData   = JSON.parse(data); 	}).done( function () 
{ 
	
	var height = $("#intersection").height();
	var width = $("#intersection").width();

	
	layout = networkData['layout']
	intPhaseSignals = networkData['intPhaseSignals']

	ix0 = layout.xaxis.range[0]
	ix1 = layout.xaxis.range[1]
	iy0 = layout.yaxis.range[0]
	iy1 = layout.yaxis.range[1]
	// layout['showlegend'] = true
	
	layout.width = Math.min(width,height)
	layout.margin = { 'l' : 0, 'r':0, 't':0, 'b' : 0}
	layout.height = Math.min(width,height)
	// layout.xaxis.autorange = true
	// layout.yaxis.autorange = true
	
	b = document.getElementById('intersection');
	Plotly.newPlot( b, 	[], layout, {scrollZoom: true});  //displayModeBar: false
	

	b.on('plotly_relayout',
	function(eventdata)
	{  
		// console.log(eventdata)
		console.log('relayout!!!!!!!!!!!!!!!!')
		if( eventdata['xaxis.range[0]'] != undefined || eventdata['xaxis.range[1]'] != undefined 
		|| eventdata['yaxis.range[0]'] != undefined || eventdata['yaxis.range[1]'] != undefined)
		{
			layout.xaxis.range[0] = eventdata['xaxis.range[0]']
			layout.xaxis.range[1] = eventdata['xaxis.range[1]']
			layout.yaxis.range[0] = eventdata['yaxis.range[0]']
			layout.yaxis.range[1] = eventdata['yaxis.range[1]']
		}
		else
		{				
			console.log('defaultaasfasd')
			layout.xaxis.range[0] = ix0
			layout.xaxis.range[1] = ix1
			layout.yaxis.range[0] = iy0
			layout.yaxis.range[1] = iy1
			
			
		}
	});
	
	
	
	

		
	startUp()

})







function startUp()
{
	$.ajax({
	   url:"/startUp",
	   success: function(response) {

			intersections = response['intersections']
			featureTypeList = response['features']
			diagnostics = JSON.parse(response['diagnostics'])
			
			startTime = response['min']
			endTime = response['max']
			console.log('response', response)
			console.log(startTime)
			console.log(endTime)
			
			//set intersection slider
			b = document.getElementById('slider_value');
			b.min = startTime
			b.max = endTime
			b.value = startTime
				
			// create div for features
			for (var i = 0; i < featureTypeList.length; i++) 
			{
				div = `	
				<div class="col-sm-6">
				
				<!-- LANE_COUNT -->
					<div class="chart-wrapper" >
					
						<div class="chart-title">`+
							featureTypeList[i] + ` vs Time 
						</div>
						
						<div class="chart-stage">
							<div id="` + featureTypeList[i] + `" ></div>
						</div>
						
					</div>		
				</div>	`
				
				$('#addHere').append(div)
				console.log(featureTypeList[i])
			}
			
			// add intersections to pulldown
			
			for (var i = 0; i < intersections.length; i++) 
			{
				div = `	
				  <option>` + intersections[i]  + `</option>
				  `
				
				$('#chooseIntersection').append(div)

			}
			
			b = document.getElementById('chooseIntersection');
			b.value = intersections[0]
			intersectionStart(intersections[0])
			
			//print daily statistics now

			var table = document.getElementById('diagnosticsTable');
			var tr = "<tr>\n";

			tr += "<th> Intersection </th>\n"
			tr += "<th> Vehicle Count </th>\n"
			tr += "<th> Average Time </th>\n"
			tr += "<th> Average Delay Length </th>\n"
			tr += "<th> Average % Delayed </th>\n"
			tr += "<th> Red Light Violations </th>\n"
			tr += "<th> Dilemma Zone Violations </th>\n"
			tr += "<th> Speed Violations </th>\n"
			tr += "<th> Break Violations </th>\n"
			// for (var i = 0; i < Object.keys(diagnostics[0]).length; i++) {
				// tr += "<th>" + Object.keys(diagnostics[0])[i] + "</th>\n"
			
			// }

			tr += "</tr>"

			
			for (var i = 0; i < Object.keys(diagnostics).length; i++) {
				tr += "<tr>\n";

				currentLine = diagnostics[ Object.keys(diagnostics)[i] ]
				
				tr += "<td>" +  currentLine.intersection+  "</td>"
				tr += "<td>" +  currentLine.total+  "</td>"
				tr += "<td>" +  currentLine['Average Time']+  "</td>"
				tr += "<td>" +  currentLine.averageDelay+  "</td>"
				tr += "<td>" +  currentLine.averagePDelay+  "</td>"
				tr += "<td>" +  currentLine.redLightRunner+  "</td>"
				tr += "<td>" +  currentLine.dilemmaZone+  "</td>"
				tr += "<td>" +  currentLine.speeding+  "</td>"
				tr += "<td>" +  currentLine.breaking+  "</td>"
				// for (var j = 0; i < Object.keys(currentLine).length; j++) {
				
					// tr += "<td>" + currentLine[Object.keys(currentLine)[j]] + "</td>\n"
								
								
				// }
				
				tr += "</tr>\n";
				
				// // // table.innerHTML += tr
			
			}
			
			table.innerHTML += tr
		
			
	   }
	})
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









					 

		

//initial plots set up
function plotGraphs(start, end, intersection ){


	$.ajax({
	type: "POST",
	data: {'start':start, 'end' : end, 'frequency' : 0, 'intersection' : intersection},
	url: "/moeAt",
	success: function(response) 
	{
		vDistance = response['vDistance']
		delayList = response['delayList']
		speedList = response['speedList']
		countList = response['countList']
		periods  = response['periods']
		featureTimes = response['featureTimes']
		
		shapeList = []
		//add periods to layout
		for (var i = 0; i < periods.length; i++) 
		{
			line = {
            'type': 'line',
            'x0': parseFloat(periods[i]),
            'y0': 0,
            'x1': parseFloat(periods[i]),
            'y1': 10,
            'line': {
                'color': 'purple',
                'width': 5
            }}
			shapeList.push(line)
			
		}

		//plot distance vs time
		a = document.getElementById('distance_v_time2');
		Plotly.newPlot( a, 
			vDistance,
			{	// title: 'Per Vehicle Distance Over Time'  ,
				xaxis: {
						title: 'timestep',
						showgrid: false 
						},
				yaxis: {
						title: 'distance',
						showgrid: false 
						},
				margin: { t: 20 }, 
				showlegend: false 
			} 
			);
		a = document.getElementById('delay_v_time');
		Plotly.newPlot( a, 
			delayList,
			{	// title: 'Per Vehicle Distance Over Time'  ,
				xaxis: {
						title: 'timestep',
						showgrid: false 
						},
				yaxis: {
						title: 'Average Delay',
						showgrid: false 
						},
				margin: { t: 20 }, 
				showlegend: true 
			} 
			);


		a = document.getElementById('speed_v_time');
		Plotly.newPlot( a, 
			speedList,
			{	// title: 'Per Vehicle Distance Over Time'  ,
				xaxis: {
						title: 'timestep',
						showgrid: false 
						},
				yaxis: {
						title: 'Average Speed',
						showgrid: false 
						},
				margin: { t: 20 }, 
				showlegend: true 
			} 
			);


		a = document.getElementById('count_v_time');
		Plotly.newPlot( a, 
			countList,
			{	// title: 'Per Vehicle Distance Over Time'  ,
				xaxis: {
						title: 'timestep',
						showgrid: false 
						},
				yaxis: {
						title: 'Vehicle Count',
						showgrid: false 
						},
				margin: { t: 20 }, 
				showlegend: true ,
				shapes: shapeList
			} 
			);
			
			

		
			
			
		for (var f in featureTimes)
		{
			var data = [
			  {
				x: featureTimes[f],
				type: 'histogram',
				marker: {
				color: 'rgba(100,250,100,0.7)',
				},
				  xbins: { 
					end: end, 
					size: Math.max( (end -start)/10,1), 
					start: start
				  }
			  }
			];
			
			var layout = {
			  bargap: 0.05, 
			  // title: "Sampled Results", 
			  xaxis: {title: "timestep"}, 
			  yaxis: {title: "# of " + f + " occurences"}
			};

			a = document.getElementById(f);
			

			Plotly.newPlot( a, data, layout)
			
			
		}
			
		
	}
})
	
	
			
		
	
	
			
			
}
		
		
		

	



function itime(x) 
{
	if (x == 'p' ) 
	{
		if ( document.getElementById('slider_value').value == endTime){
			document.getElementById('slider_value').value = startTime
			outputUpdate(parseInt(document.getElementById('slider_value').value))
		}
		else
		{
			document.getElementById('slider_value').value = parseInt(document.getElementById('slider_value').value)+1
			outputUpdate(parseInt(document.getElementById('slider_value').value))
		}
	}
	else if (x == 'n' ) 
	{
		if ( document.getElementById('slider_value').value == startTime){
			document.getElementById('slider_value').value = endTime
			outputUpdate(parseInt(document.getElementById('slider_value').value))
		}
		else
		{
			document.getElementById('slider_value').value = parseInt(document.getElementById('slider_value').value)-1
			outputUpdate(parseInt(document.getElementById('slider_value').value))
		}
	}	
}
		

// document.getElementById("ptime").onclick = itime('p');
// document.getElementById("mtime").onclick = itime('m');


function incrementTime() {
	if (autoplay_toggle.checked ) {
		
		if ( document.getElementById('slider_value').value == endTime){
			document.getElementById('slider_value').value = startTime
			outputUpdate(parseInt(document.getElementById('slider_value').value))
		}
		else{
			document.getElementById('slider_value').value = parseInt(document.getElementById('slider_value').value)+5
			outputUpdate(parseInt(document.getElementById('slider_value').value))
		}
		
	}
}


			

function outputUpdate(time) {
	document.querySelector('#time').value = 'Intersection at timestep = ' + time.toString();

	
	plotIntersection(time)
}


function updateTime(time) {
	document.querySelector('#time').value = 'Intersection at timestep = ' + time.toString();


}



function plotIntersection(time, lay = layout){
								 
								 
	 
	console.time('plotting')
	$.ajax({
		type: "POST",
		data: {'time':time},
	    url: "/iAtTime",
		success: function(response) 
		{
			current = response['current']
			b = document.getElementById('intersection');
			b.data = current
					
			// Newlayout['annotations'] = [
				// {
				  // x: .05,
				  // y: .95,
				  // xref: 'paper',
				  // yref: 'paper',
				  // text: 'Timestep = ' + time + "<br>x: (" + Math.floor(ix0) + ", " + Math.floor(x1)+ ")" +  "<br>y: (" + Math.floor(y0 )+ ", " + Math.floor(y1)+ ")" ,
				  // showarrow: false

				// }
			  // ]
			  

			
			Plotly.redraw(b)
			
			// Newlayout['plot_bgcolor'] = 'rgb(169,169,169)'
			// Newlayout['showlegend'] = false 
			
			// b = document.getElementById('intersection');
			// Plotly.newPlot( b, currentTrajectories, Newlayout, {scrollZoom: true});
			console.timeEnd('plotting')




		

		}
	})

	
	
	
	

				
}


	
		

			
