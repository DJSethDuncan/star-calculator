$('#launchRocket').click(function() {
	var rocket = new Rocket('falcon9');
	rocket.launch();
});


var speedGraph = new Highcharts.chart('container', {

    title: {
        text: ''
    },
    yAxis: {
			labels: {
				style: {
					color: Highcharts.getOptions().colors[1]
				}
			}
    },
    plotOptions: {
			line: {
				marker: {
					enabled: false
				}
			},
			series: {
				pointStart: 0
			}
		},
    series: [{
        name: 'Speed',
        data: []
    }]

});

class Rocket {

	constructor(rocketType) {
		switch (rocketType) {
			case 'falcon9':
				this.engines = 9;
				this.mass = 549054; // kg
				this.propellantMass = 505000; // kg
				this.specificImpulse = 282; // seconds @ sea level
				this.thrust = 845; // kN @ sea level
				this.chamberPressure = 1410; // psi
				this.height = 70; // meters
				this.diameter = 3.7; // meters
				this.burnTime = 162; // seconds
			break;
		}
	}

	deltaV () {
		// returns in m/s
		var emptyWeight = this.mass - this.propellantMass;
		return (this.specificImpulse * 9.8) * Math.log(this.mass/emptyWeight);
	}

	area () {
		// returns in cubic meters
		return (2 * Math.PI * (this.diameter)/2 * this.height) + (2 * Math.PI * Math.pow((this.diameter)/2, 2));
	}

	acceleration (mass) {
		var massInkN = (mass * 9.8)/1000; // return in kiloNewtons
		var resultantForce = (this.thrust * this.engines) - massInkN;
		return resultantForce / massInkN;
	}

	burnRate () {
		return this.propellantMass / this.burnTime;
	}

	launch () {
		var flightTime = 0;
		var velocity = 0;
		var acceleration = this.acceleration(this.mass);
		var activeMass = this.mass;
		var thisRocket = this;
		var percentFuelRemaining = 100;
		var gForce = 0;

		var launchEvent = setInterval(function() {
			if (flightTime < thisRocket.burnTime) {
				activeMass = activeMass - (thisRocket.burnRate());
				velocity = flightTime * thisRocket.acceleration(activeMass);
				percentFuelRemaining = ((100-(((thisRocket.burnRate() * flightTime)/thisRocket.propellantMass)*100).toFixed(1)).toFixed(1));
				gForce = (1 + (thisRocket.acceleration(activeMass))/9.8).toFixed(1);

				speedGraph.series[0].addPoint(velocity);
				$('#liveVelocityms').html("Velocity: " + velocity.toFixed(2) + " m/s");
				$('#liveVelocitymph').html("Velocity: " + (velocity*2.23694).toFixed(2) + " mph");
				$('#liveMass').html("Mass: " + activeMass.toFixed(2) + " kg");
				$('#livePercentFuelRemaining').html("Fuel: " + percentFuelRemaining + "%");
				$('#liveAcceleration').html((thisRocket.acceleration(activeMass)).toFixed(1) + " m/s");
				$('#liveGForce').html("G: " + gForce);
				flightTime++;
			}
			//speedGraph.series[0].addPoint(velocity, true, false);
			//
		}, 250);
	}

}
