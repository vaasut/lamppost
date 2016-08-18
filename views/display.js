		var w = window.innerWidth;
		var h = window.innerHeight;


		var count = 0;

		$("#begin").on("click", function(event){
		event.preventDefault();


		if (count < 99){
			var interval = setInterval(
				function() {
					count += 1;
					var alpha = 1-count/100
					document.getElementById("open").style.color = "rgba(1,1,1," + alpha + ")"
					// document.getElementById("open_links").style.color = "rgba(1,1,1," + alpha + ")"
					//console.log(alpha);


					}, 20)
			}

		else if (count === 99){
			clearInterval(interval);
			count ++;
			document.getElementById("open").style.display = "none"
			// document.getElementById("grid").style.display = "inline"
		}
		else if (count > 99 && count < 199){
			
			var interval = setInterval(
			function() {
				count += 1;
				var alpha = count/100
				// document.getElementById("grid").style.color = "rgba(1,1,1," + alpha + ")"
				//console.log(alpha);
				}, 10)
		}
		else{
			clearInterval(interval);
		}
		console.log("begin")
		})