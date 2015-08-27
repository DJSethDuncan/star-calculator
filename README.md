# README #

A page for gathering and working with interesting planetary data with the end-goal of acquiring interesting data for folks who aren't well-versed in planetary and orbital science. Created primarily because I wanted a page where I could get data easily without having to constantly do math.

http://sethduncan.com/dev/star-calculator/

### Status ###

* Entering a value (ex. 6371 for near-Earth radius) in the Radius form field returns values in a list that are calculated off the given value.
* Adding a Mass value (ex. 60000000000000000000000000 for near-Earth mass) will return the force of gravity in m/s^2 as well as the g-force related to Earth gravity.
* Shows distance to Mercury, Venus, and Mars. Polls this data on page-load.

### To-do List ###

* Get planet math into its own function and out of .blur() -- makes it easier to trigger it whenever we need it rather than ONLY on .blur()
* Create a "slide mode" to rotate through slides with interesting data (for display purposes)
* Add a slider for "radius"?
* Add buttons for each planet measurement field to auto-fill that field with the value for a specific planet
* Find more APIs with interesting data (solar data, satellite data, etc)

### Setup ###

* Uses javascript/jQuery/html/css - no server required
* Relies on http://www.astro-phys.com for planetary location data
* Currently there is no live-demo. When it looks prettier, I'll do that.

### Contact ###

* Seth Duncan
* sethduncan@gmail.com
* @djsethduncan
