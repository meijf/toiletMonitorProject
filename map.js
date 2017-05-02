(function(console){

console.save = function(data, filename){
		console.log("saving data")
		if(!data) {
				console.error('Console.save: No data')
				return;
		}

		if(!filename) filename = 'console.json'

		if(typeof data === "object"){
				data = JSON.stringify(data, undefined, 4)
		}

		var blob = new Blob([data], {type: 'text/json'}),
				e    = document.createEvent('MouseEvents'),
				a    = document.createElement('a')

		a.download = filename
		a.href = window.URL.createObjectURL(blob)
		a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
		e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
		a.dispatchEvent(e)
 }
})(console)

var map = Maze.map('mazemap-container', { campusloader: false });

// Maze.Data.getPoisByCategoryAndCampusId(9, 1).then( data => {
// 		console.log(data); // Raw data about the campuses.
// });
//
// Maze.Data.getPoiCategoryIdsByCampusId(1).then(data => {
// 	//console.log(data);
// })

function viewAllToilets(){
	//viewing all the toilets on campus
	Maze.Instancer.getCampus(1).then(function(campus){
		map.fitBounds(campus.getBounds());
		campus.addTo(map).setActive().then( function(c) {
			map.setZLevel(1);
			map.getZLevelControl().show();
		});
	  campus.addPoiCategory(9); // 9 = WC
	});
}

function findToilet(){
	Maze.Instancer.getCampus(1).then(function(campus){
		campus.addTo(map).setActive().then( function(c) {
			map.getZLevelControl().show();
			map.setZLevel(parseInt(getAllUrlParams().startfloor));
		});
	});


	//var startLatLng = [63.41804344188158, 10.40383815765381];
	//var endLatLng = [63.417513935824466, 10.403683690566774];
	var startLatLng = [getAllUrlParams().startlat, getAllUrlParams().startlng];
	//var startLatLng = [63.41572, 10.41082]
	var endLatLng = [getAllUrlParams().endlat, getAllUrlParams().endlng];


	//var endLatLng = [63.415676980402125, 10.405869829535737];
	//var endLatLng = [63.41565222643514, 10.405895839850515];
	//var endLatLng = [63.415643800920435, 10.40585476549108];

	Maze.marker(startLatLng, {
	    zLevel: parseInt(getAllUrlParams().startfloor),
	    offZOpacity: 0.4,
	    icon: Maze.icon.chub({ color: 'red', glyph: 'walk' })
	}).addTo(map);
	// Maze.marker(startLatLng, {
	// 		icon: Maze.icon.chub({ color: 'red', glyph: 'ambulance' })
	// }).addTo(map);

	Maze.marker(endLatLng,   {
	    zLevel: parseInt(getAllUrlParams().endfloor),
	    offZOpacity: 0.4,
	    icon: Maze.icon.chub({ color: 'green', glyph: 'human-male-female' })
	}).addTo(map);

	Maze.Route.getFeatureGroupRoute(   // Can be replaced with Maze.Route.getGeoJsonRoute(
	    startLatLng, parseInt(getAllUrlParams().startfloor),
	    endLatLng, parseInt(getAllUrlParams().endfloor),
	    {
	        connectToStart: true,
	        connectToEnd: true,
	//         avoidStairs: true
	    }
	).then(function(featGroup){
	    featGroup.addTo(map);
	    map.fitBounds(featGroup.getBounds());
	});

	// Maze.Route.getGeoJsonRoute(
	// 	startLatLng, 3,
	// 	endLatLng, 4,
	// 	{
	// 			connectToStart: true,
	// 			connectToEnd: true,
	// 	}
	// 	).then(function(data){
	// 			console.log(data);
	// 	});

}

function viewToilet(){
	Maze.Instancer.getCampus(1).then(function(campus){
		campus.addTo(map).setActive().then( function(c) {
			map.setZLevel(1);
			map.getZLevelControl().show();
		});
	});
	var marker = Maze.marker([63.41638, 10.40939], {
	    icon: Maze.icon.bubble({
	        color: 'teal',
	        glyph: 'phone',
	        glyphColor: 'teal'
	    }),
	    zLevel: 3,
	    offZOpacity: 0.6
	});

	var marker2 = Maze.marker([63.41572, 10.41082], {
	    icon: Maze.icon.chub({
	        color: 'red',
	        glyph: 'ambulance'
	    })
	});

	marker.addTo(map);
	marker2.addTo(map);

	map.fitBounds(Maze.latLngBounds(marker.getLatLng(), marker2.getLatLng()));
}

function view2(){
	var marker = Maze.marker([63.43298, 10.40748], {
		icon: Maze.icon.chub({
			color: 'orange',
			glyph: 'printer',
			glyphColor: 'white'
		}),
		zLevel: 4,
		offZOpacity: 0.6
	}).addTo(map);

	var popup = Maze.popup().setContent('<p><strong>Hello world!</strong><br />I am a printer, and I am located <i>exactly</i> at this indoor location!</p>');

	marker.bindPopup(popup); //Bind the popup to the specific marker

	Maze.Instancer.getCampus(47).then(function(campus){
		map.fitBounds( campus.getBounds() );
		campus.addTo(map).setActive().then( function(c) {
			map.setZLevel(4);
			map.getZLevelControl().show();

			marker.openPopup(); //For convenience, we want to auto-show this popup
		});
	});

}


//viewAllToilets();
//findToilet();
//viewToilet();
//view2();

function getAllUrlParams(url) {

  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // we'll store the parameters here
  var obj = {};

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i=0; i<arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // in case params look like: list[]=thing1&list[]=thing2
      var paramNum = undefined;
      var paramName = a[0].replace(/\[\d*\]/, function(v) {
        paramNum = v.slice(1,-1);
        return '';
      });

      // set parameter value (use 'true' if empty)
      var paramValue = typeof(a[1])==='undefined' ? true : a[1];

      // (optional) keep case consistent
      paramName = paramName.toLowerCase();
      paramValue = paramValue.toLowerCase();

      // if parameter name already exists
      if (obj[paramName]) {
        // convert value to array (if still string)
        if (typeof obj[paramName] === 'string') {
          obj[paramName] = [obj[paramName]];
        }
        // if no array index number specified...
        if (typeof paramNum === 'undefined') {
          // put the value on the end of the array
          obj[paramName].push(paramValue);
        }
        // if array index number specified...
        else {
          // put the value at that index number
          obj[paramName][paramNum] = paramValue;
        }
      }
      // if param name doesn't exist yet, set it
      else {
        obj[paramName] = paramValue;
      }
    }
  }

  return obj;
}


//console.log(getAllUrlParams().startlat); // 'shirt'
//getAllUrlParams('http://test.com/?a=abc').a; // 'abc'

if(getAllUrlParams().view == "alltoilets"){
	viewAllToilets()
}
if (getAllUrlParams().view == "findtoilet"){
	findToilet();
}
