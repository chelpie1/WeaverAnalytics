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
			x = images[key][i]
			div = '<canvas id = ' + x[0] + ' width = 168 height =192 style="border:3px solid black;"/> '	  
			$("#"+key).append(div)

			b = document.getElementById(x[0]);
			var ctx = b.getContext('2d');
			ctx.scale(.5,.5)
			// ctx.data = x[1]
			temp = JSON.parse(x[1])
			temp2 = new Uint8ClampedArray(JSON.parse(x[1]))
			temp3 = new ImageData(      new Uint8ClampedArray(JSON.parse(x[1]))  , 168, 192       )
			ctx.putImageData( new ImageData(      new Uint8ClampedArray(JSON.parse(x[1]))  , 168, 192       ), 0, 0);

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
			b.innerHTML = "Who is it? It's Bob"

	   }
	})
	
	}, false);
	
	
	
    reader.readAsDataURL(image);


	
}

