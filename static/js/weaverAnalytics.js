var image
var temp


function plotPics(images)
{
	console.log('hi')
	for (var key in images) {
	  if (images.hasOwnProperty(key)) 
	  {

		div =  'Subject: ' + key + ` <section>
				  <div class="pic-container">
					<div id = ` + key + ` class="pic-row">
					</div>
				  </div>
				</section>​<br>` 
		$('#pictures').append(div)
		
		div = 'Subject: ' + key  + ' '	  
		for (var i = 0; i < images[key].length; i++) 
		{
			scale = .5
			x = images[key][i]
			div = '<canvas id = ' + x[0] + ' width = "' + scale*168 + '" height ="' + scale*192 + '" style="border:3px solid black;"/> '	  
			$("#"+key).append(div)

			canvas = document.getElementById(x[0]);
			ctx = canvas.getContext('2d');
			imageData = new ImageData(      new Uint8ClampedArray(JSON.parse(x[1]))  , 168, 192       )

			
			var newCanvas = $("<canvas>")
				.attr("width", imageData.width)
				.attr("height", imageData.height)[0];

			newCanvas.getContext("2d").putImageData(imageData, 0, 0);

			
			ctx.scale(scale,scale)
			ctx.drawImage( newCanvas, 0, 0);
			
			//ctx.drawImage( imageData, 0, 0, 168, 192,0, 0, 168/2, 192/2);
			
		}
		
	  }
	}
	

	
}






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
			b.innerHTML = "You look like " + String(response)

	   }
	})
	
	}, false);
	
	
	
    reader.readAsDataURL(image);


	
}

