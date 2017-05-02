function randomDate(start, end) {
  var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
  "July", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];
  var date = new Date(new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())));
  var date = new Date(date);
  // return date.getDate() + '-' + monthNames[(date.getMonth())] + '-' +  date.getFullYear();
  return date.getFullYear() + "/" + monthNames[(date.getMonth())] + "/" + date.getDate();
}

function getToiletsFromMazemap(table){

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
      var finalstring = "";

      for (i = 0; i < 597; i++) {
        var lat;
        var lng;
        if(results["features"][i]["geometry"]["type"] == "Point"){
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

        var id = results["features"][i]["properties"]["name"];
        var visits = Math.floor((Math.random() * 100));
        var date = randomDate(new Date(2017, 3, 1), new Date());
        var level = Math.floor((Math.random() * 3));
        var availability = Math.floor((Math.random() * 1000))%4;
        var value = 1;
        var icon = 'glyphicon glyphicon glyphicon-ok-circle" style="color:limegreen'
        if (availability == 0){
          value = 0;
          icon = 'glyphicon glyphicon glyphicon glyphicon-remove-circle" style="color:red';
        }
        var startlat = (63.4183432 + 63.4181158) / 2
        var startlng = (10.4013652 + 10.4021806) / 2
        var startfloor = "1"
        var endlat = lat;
        var endlng = lng;
        var endfloor = results["features"][i]["properties"]["zLevel"];
        var href = "map.html?view=findtoilet" + "&startlat=" + startlat + "&startlng=" + startlng + "&startfloor=" + startfloor + "&endlat=" + endlat + "&endlng=" + endlng + "&endfloor=" + endfloor;

        var href2 = endlat.toString().substring(0, 10) + " " + endlng.toString().substring(0, 10);

        var string = '<tr><td class="col-md-2">' + id + '</td><td class="col-md-1" align="right">' + date + '</td><td class="col-md-1" align="right">' + visits + '</td>' +
        '<td class="col-md-1" align="center"><input type="hidden" value="' + value + '"/><span class="' + icon + '" aria-hidden="true"></span></td>' +
        '<td class="col-md-1" align="center">' + endfloor + '</td><td class="col-md-1" align="center"><a href="' + href + '" class="btn btn-info btn-xs">map</a></td></tr>';
        //finalstring += string;

        var floorId = results["features"][i]["properties"]["floorId"];
        if(floorId == "301" || floorId == "374" || floorId == "168" || floorId == "155" || floorId == "349"){
          //finalstring += string;

          table.row.add( {
            "toilets": id,
            "visits": visits,
            "cleaning": date,
            "paperlevel": level,
            "available": value,
            "floor":  endfloor,
            "map": href2
          })
          .draw();
        }
      }

      $('#example > tbody  > tr').each(function() {
        var getlevel = $(this).find("td").eq(3).html();
        var toiletpaper = ["Full", "Medium", "Low"];
        $(this).find("td").eq(3).empty();
        $(this).find("td").eq(3).append('<input type="hidden" value="' + getlevel + '"/><span">' + toiletpaper[getlevel] + '</span>')
        var getvalue = $(this).find("td").eq(4).html();
        if (getvalue == 1){
          $(this).find("td").eq(4).empty();
          $(this).find("td").eq(4).append('<input type="hidden" value="' + getvalue + '"/><span class="glyphicon glyphicon glyphicon-ok-circle" style="color:limegreen" aria-hidden="true"></span>')
        } else {
          $(this).find("td").eq(4).empty();
          $(this).find("td").eq(4).append('<input type="hidden" value="' + getvalue + '" style="color:limegreen"/><span class="glyphicon glyphicon glyphicon glyphicon-remove-circle" style="color:red" aria-hidden="true"></span>')
        }
        $(this).find("td").eq(2).css("textAlign", "right");
        $(this).find("td").eq(4).css("textAlign", "center");
        $(this).find("td").eq(5).css("textAlign", "right");
        $(this).find("td").eq(6).css("textAlign", "center");
        var startlat = (63.4183432 + 63.4181158) / 2;
        var startlng = (10.4013652 + 10.4021806) / 2;
        var getlatlng = $(this).find("td").eq(6).html();
        var endlat = getlatlng.substring(0, 10);
        var endlng = getlatlng.substring(11);
        var endfloor = $(this).find("td").eq(5).html();
        var href = "map.html?view=findtoilet" + "&startlat=" + startlat + "&startlng=" + startlng + "&startfloor=" + startfloor + "&endlat=" + endlat + "&endlng=" + endlng + "&endfloor=" + endfloor;
        $(this).find("td").eq(6).empty();
        $(this).find("td").eq(6).append('<a href="' + href + '" class="btn btn-info btn-xs">map</a> <a href="#" class="btn btn-warning btn-xs">report</a>');
      });

      return (
          finalstring
      )
    });
  })
}
