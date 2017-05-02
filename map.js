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

// var map = Maze.map('mazemap-container', { campusloader: false });

// Maze.Data.getPoisByCategoryAndCampusId(9, 1).then( data => {
// 		console.log(data); // Raw data about the campuses.
// });
//
// Maze.Data.getPoiCategoryIdsByCampusId(1).then(data => {
// 	//console.log(data);
// })

function viewAllToilets(){
	var map = Maze.map('mazemap-container', { campusloader: false });
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
	var map = Maze.map('mazemap-container', { campusloader: false });
	Maze.Instancer.getCampus(1).then(function(campus){
		campus.addTo(map).setActive().then( function(c) {
			map.getZLevelControl().show();
			map.setZLevel(parseInt(getAllUrlParams().startfloor));
		});
	});

	var startLatLng = [getAllUrlParams().startlat, getAllUrlParams().startlng];
	var endLatLng = [getAllUrlParams().endlat, getAllUrlParams().endlng];

	Maze.marker(startLatLng, {
	    zLevel: parseInt(getAllUrlParams().startfloor),
	    offZOpacity: 0.4,
	    icon: Maze.icon.chub({ color: 'red', glyph: 'walk' })
	}).addTo(map);

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
}

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

// if(getAllUrlParams().view == "alltoilets"){
// 	viewAllToilets()
// }
// if (getAllUrlParams().view == "findtoilet"){
// 	findToilet();
// }
