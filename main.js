$(document).ready(function() {

  var planetaryStatesURL = "http://www.astro-phys.com/api/de406/states?bodies=mercury,venus,earth,mars"

  $.ajax({
    url: planetaryStatesURL,
    success: function(data) { /* console.log(data); */ }
  }).done(function(data) {
    var mercury = new Object();
    var venus = new Object();
    var earth = new Object();
    var mars = new Object();

    mercury.x = data.results.mercury[0][0];
    mercury.y = data.results.mercury[0][1];
    mercury.z = data.results.mercury[0][2];
    venus.x = data.results.venus[0][0];
    venus.y = data.results.venus[0][1];
    venus.z = data.results.venus[0][2];
    earth.x = data.results.earth[0][0];
    earth.y = data.results.earth[0][1];
    earth.z = data.results.earth[0][2];
    mars.x = data.results.mars[0][0];
    mars.y = data.results.mars[0][1];
    mars.z = data.results.mars[0][2];

    var distanceToMercury = distanceBetween(earth, mercury);
    var distanceToVenus = distanceBetween(earth, venus);
    var distanceToMars = distanceBetween(earth, mars);
    $("#distanceToMercury").html("Mercury: "+distanceToMercury);
    $("#distanceToVenus").html("Venus: "+distanceToVenus);
    $("#distanceToMars").html("Mars: "+distanceToMars);
  });

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
      var planetData = new Planet(groupData);
      $("#message").html(JSON.stringify(planetData));
    }
  }


  // The Meat & Potatoes calculations
  function Planet (data) {
    if (data.planetRadius != 0) {
      this.diameter = (data.planetRadius*2);
      this.surfaceArea = (4*Math.PI*Math.pow(data.planetRadius, 2)).toFixed(2);
      this.volume = ((4/3)*Math.PI*Math.pow(data.planetRadius, 3)).toFixed(2);
      this.circumference = (2*Math.PI*data.planetRadius);
    }
  }

});
