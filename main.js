$(document).ready(function() {

  // auto-calculate and populate all related form fields when possible
  $('form input').blur(function () {

      var group = $(this).data("group");
      var groupData = {};

      // iterate over every item in the same group
      $("form ."+group).each(function(index) {

        var label = $(this).attr("name");
        var value = $(this).val();
        if (!value) { value="0"; }

        // create an object with all values inside the same group that was triggered
        Object.defineProperty(groupData, label, {
          value: value,
          writable: true,
          enumerable: true,
          configurable: true
        });
      });

      groupData.group = group;

      // pass the data along
      doCalculations(groupData);
  });

});

function doCalculations (groupData) {
  if (groupData.group == "planet") {
    var planetData = new Planet(groupData);
    console.log(planetData);
  }
}


// The Meat & Potatoes calculations
function Planet (data) {
  this.radius = data.planetRadius;
  this.circumference = data.planetCircumference;
  this.diameter = data.planetDiameter;
}
