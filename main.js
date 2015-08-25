$(document).ready(function() {

  // auto-calculate and populate all related form fields when possible
  $('form input').blur(function () {
      var group = $(this).data("group");
      doCalculations(group);
  });

});

// The Meat & Potatoes calculations
function doCalculations (group) {

}
