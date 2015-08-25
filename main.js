$(document).ready(function() {

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

    }
  }


  // The Meat & Potatoes calculations
  function Planet (data) {
    if (data.planetRadius != 0) {
      this.surfaceArea = (4*Math.PI*Math.pow(data.planetRadius, 2)).toFixed(2);
      this.volume = ((4/3)*Math.PI*Math.pow(data.planetRadius, 3)).toFixed(2);

    }
    this.radius = data.planetRadius;
    this.circumference = data.planetCircumference;
    this.diameter = data.planetDiameter;
  }

});
