$(document).ready(function() {

  // Constants

  var G = 6.674*Math.pow(10, -11);
  var earthMass = 5.98*Math.pow(10, 24);
  var earthRadius = 6.38*Math.pow(10, 6);
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

    if (data.planetRadius != 0 && data.planetMass != 0) {
      var planetRadiusMeters = data.planetRadius*1000;
      this.gravity = (((G*data.planetMass)/Math.pow(planetRadiusMeters, 2)).toFixed(2));
      this.comparativeGravity = (this.gravity/earthGravity).toFixed(2);
    }
  }


});
