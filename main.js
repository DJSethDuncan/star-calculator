$(document).ready(function() {

  // auto-calculate and populate all related form fields when possible
  $('form input').blur(function () {
      var group = $(this).data("group");
      var groupData = {};
      $("form ."+group).each(function(index) {
        var label = $(this).attr("placeholder");
        var value = $(this).val();
        if (!value) { value="0"; }
        Object.defineProperty(groupData, label, {
          value: value,
          writable: true,
          enumerable: true,
          configurable: true
        });
      });
      doCalculations(group, groupData);
  });

});

// The Meat & Potatoes calculations
function doCalculations (group, groupData) {
  if (group == "planet") { console.log(groupData.Radius); }
}
