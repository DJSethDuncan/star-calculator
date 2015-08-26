$(document).ready(function() {

  /* misc NASA stuff, not urgent */
  var wichitaLat = "37.6889";
  var wichitaLon = "-97.3361";
  var nasaAPIKey = "xiTgDdCaqdv7NW7aTB7bby3D7424Rgl9w09y0diN";
  var imageryURL = "https://api.nasa.gov/planetary/earth/imagery?lat="+wichitaLat+"&lon="+wichitaLon+"&cloudscore=true&api_key="+nasaAPIKey+"&format=JSON";
  var planetaryStatesURL = "http://www.astro-phys.com/api/de406/states?bodies=mercury,venus,earth,moon,mars,jupiter,saturn,uranus,neptune,pluto"

  // imagery for given location
  $.ajax({
    url: imageryURL,
    success: function(data) { /* console.log(data); */ }
  }).done(function(data) {
    // writes a link to the image
    // $("#landsat").attr("href", data.url);
  });

  $.ajax({
    url: planetaryStatesURL,
    success: function(data) { console.log("success"); }
  }).done(function(data) {

    // set reference point for comparison to other planets
    // later on this should be able to be chosen
    var earth = {
      x : data.results.earth[0][0],
      y : data.results.earth[0][1],
      z : data.results.earth[0][2]
    }

    // create the object
    var celestialBodies = {};

    // add each body returned from the API to the celestialBodies object
    $.each(data.results, function(label) {
      var thisBody = {
        x: data.results[label][0][0],
        y: data.results[label][0][1],
        z: data.results[label][0][2]
      }
      // calculate the distance between this body and earth (our reference point)
      distance = distanceBetween(thisBody, earth);
      // add the distance to this body's object
      thisBody.distanceToEarth = distance;
      // add this body's object to the celestialBodies object
      celestialBodies[label] = thisBody;
    });

    // write each celestial body distance to an <li>
    $.each(celestialBodies, function(label) {
      if (label != "earth") {
        $("#distances").append("<li id="+label+">"+label+": "+celestialBodies[label].distanceToEarth+"</li>");
      }
    });

  });

  // Constants

  var G = 6.674*Math.pow(10, -11);
  var earthMass = 5.98*Math.pow(10, 24);
  var earthRadius = 6.371*Math.pow(10, 6); // in meters
  var earthGravity = 9.8;

  // auto-calculate and populate all related form fields when possible
  $('form input').blur(function () {

      var group = $(this).data("group");
      var groupData = {};

      // iterate over every item in the same group
      $("form ."+group).each(function(index) {

        // set the label
        var label = $(this).attr("name");

        // set the value
        var value = $(this).val();

        // make sure the value isn't null
        if (!value) { value="0"; }

        // create an object with all values inside the same group that was triggered
        Object.defineProperty(groupData, label, {
          value: value,
          writable: true,
          enumerable: true,
          configurable: true
        });
      });

      // put the currently-used group name in the object
      groupData.group = group;

      // pass the data along
      doCalculations(groupData);
  });

  // get distance between points
  // each point should be an object with x, y, z values
  // uses KM
  function distanceBetween(point1, point2) {
    result = addCommas(Math.sqrt((Math.pow((point1.x-point2.x), 2))+(Math.pow((point1.y-point2.y), 2))+(Math.pow((point1.z-point2.z), 2))).toFixed(2))
    return result+" km";
  }

  // for pretty number formatting
  function addCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function doCalculations (groupData) {
    if (groupData.group == "planet") {
      // reset result div to empty state
      $("#resultList").html("");

      var planetData = new Planet(groupData);

      // send results to result div
      // $("#message").html(JSON.stringify(planetData));
      $.each(planetData, function(key,val) {
          var planetData = $("#message").html();
          $("#resultList").append("<li>"+key+": "+val+"</li>");
      });
    }
  }


  // The Meat & Potatoes calculations
  function Planet (data) {

    // size calculations
    if (data.planetRadius != 0) {
      this.diameter = (data.planetRadius*2);
      this.surfaceArea = (4*Math.PI*Math.pow(data.planetRadius, 2)).toFixed(2);
      this.volume = ((4/3)*Math.PI*Math.pow(data.planetRadius, 3)).toFixed(2);
      this.circumference = (2*Math.PI*data.planetRadius);
      this.comparativeSize = (((data.planetRadius/(earthRadius/1000))*100)).toFixed(2)+"% Earth's Size";
    }

    // gravity calculations
    if (data.planetRadius != 0 && data.planetMass != 0) {
      var planetRadiusMeters = data.planetRadius*1000;
      this.gravity = (((G*data.planetMass)/Math.pow(planetRadiusMeters, 2)).toFixed(2));
      this.comparativeGravity = (this.gravity/earthGravity).toFixed(2);
    }
  }


});
