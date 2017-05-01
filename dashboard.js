
function randomDate(start, end) {
  var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
  "July", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];
  var date = new Date(new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())));
  var date = new Date(date);
  return date.getDate() + '-' + monthNames[(date.getMonth())] + '-' +  date.getFullYear();
}

$('#example').append(

  '<tr><td class="col-md-2">' + "id" + '</td><td class="col-md-1" align="right">' + "visits" + '</td><td class="col-md-1" align="right">' + "date" + '</td>' +
  '<td class="col-md-1" align="center"><input type="hidden" value="' + "value" + '"/><span class="' + "icon" + '" aria-hidden="true"></span></td>' +
  '<td class="col-md-1" align="center"><a href="' + "href" + '" class="btn btn-info btn-xs">map</a></td></tr>'
)

Maze.Data.getPoisByCategoryAndCampusId(9, 1).then(function(results){
  // console.log(results["features"][0]["geometry"]["type"])
  // console.log(results["features"][0]["geometry"]["coordinates"].length)
  // console.log(results["features"][0]["geometry"]["coordinates"][0])
  //
  // console.log(results["features"][0]["properties"]["name"])
  // console.log(results["features"][0]["properties"]["id"])
  // console.log(results["features"][0]["properties"]["identifier"];)
  // console.log(results["features"][0]["properties"]["zLevel"])
  // console.log(results["features"][0]["properties"]["campusId"])
  // console.log(results["features"][0]["properties"]["floorId"])

  $('#example .odd').remove();

  $('#example').append(function(){
    //F206, F207, E207, E206, A178B, A178A
    // var toilets = [
    //   [10.401934739166686, 63.4176879158629, "F206", "2"], [10.401919280359424, 63.41770249011646, "F207", "2"], [10.401815009121371, 63.417826576818655, "E207", "2"], [10.40177542713588, 63.41783811169632, "E206", "2"],
    //   [10.40144732039183, 63.41814542405559, "A178B", "1"], [10.401274820617676, 63.41818960722441, "A178A", "1"]
    // ];
    var finalstring = "";

    for (i = 0; i < 10; i++) {
      var lat;
      var lng;
      if(results["features"][i]["geometry"]["type"] == "Point"){
        //console.log("point" + results["features"][0]["geometry"]["coordinates"][0] + results["features"][0]["geometry"]["coordinates"][1])
        lat = results["features"][i]["geometry"]["coordinates"][1];
        lng = results["features"][i]["geometry"]["coordinates"][0];
      } else {
        var xmin = results["features"][i]["geometry"]["coordinates"][0][0][0];
        var xmax = results["features"][i]["geometry"]["coordinates"][0][0][0];
        var ymin = results["features"][i]["geometry"]["coordinates"][0][0][1];
        var ymax = results["features"][i]["geometry"]["coordinates"][0][0][1];
        for (j = 1; j < results["features"][i]["geometry"]["coordinates"][0].length; j++){
          if (results["features"][i]["geometry"]["coordinates"][0][j][0] < xmin){
            xmin = results["features"][i]["geometry"]["coordinates"][0][j][0]
          }
          if (results["features"][i]["geometry"]["coordinates"][0][j][0] > xmax){
            xmax = results["features"][i]["geometry"]["coordinates"][0][j][0]
          }
          if (results["features"][i]["geometry"]["coordinates"][0][j][1] < ymin){
            ymin = results["features"][i]["geometry"]["coordinates"][0][j][1]
          }
          if (results["features"][i]["geometry"]["coordinates"][0][j][1] > ymax){
            ymax = results["features"][i]["geometry"]["coordinates"][0][j][1]
          }
        }
        lat = ymin + ((ymax-ymin)/2);
        lng = xmin + ((xmax-xmin)/2);
      }


      //var id = toilets[i+2][2] //Math.floor((Math.random() * 9999) + 1000);
      var id = results["features"][i]["properties"]["identifier"];
      var visits = Math.floor((Math.random() * 100));
      var date = randomDate(new Date(2017, 3, 1), new Date());
      var availability = Math.floor((Math.random() * 1000))%4;
      var value = 1;
      var icon = 'glyphicon glyphicon glyphicon-ok-circle" style="color:limegreen'
      if (availability == 0){
        value = 0;
        icon = 'glyphicon glyphicon glyphicon glyphicon-remove-circle" style="color:red';
      }
      //legevakt
      // var startlat = "63.4176879158629";
      // var startlng = "10.401934739166686";
      var startlat = (63.4183432 + 63.4181158) / 2
      var startlng = (10.4013652 + 10.4021806) /2
      var startfloor = "1"
      // var endlat = "" + toilets[i][1];
      // var endlng = "" + toilets[i][0];
      // var endfloor = "" + toilets[i][3];
      var endlat = lat;
      var endlng = lng;
      var endfloor = results["features"][i]["properties"]["zLevel"];
      var href = "map.html?view=findtoilet" + "&startlat=" + startlat + "&startlng=" + startlng + "&startfloor=" + startfloor + "&endlat=" + endlat + "&endlng=" + endlng + "&endfloor=" + endfloor;

      var string = '<tr><td class="col-md-2">' + id + '</td><td class="col-md-1" align="right">' + visits + '</td><td class="col-md-1" align="right">' + date + '</td>' +
      '<td class="col-md-1" align="center"><input type="hidden" value="' + value + '"/><span class="' + icon + '" aria-hidden="true"></span></td>' +
      '<td class="col-md-1" align="center"><a href="' + href + '" class="btn btn-info btn-xs">map</a></td></tr>';
      finalstring += string;
      }

      // if(true){
      //
      // }

      return (
          finalstring
      )
  });

})
