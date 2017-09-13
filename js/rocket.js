$('#launchRocket').click(function() {
	var rocket = new Rocket('falcon9');
	$('#telemetry').slideDown();
	$('#charts').slideDown();
	rocket.launch();
});

var velocityGaugeOptions = {

    chart: {
        type: 'solidgauge'
    },

    title: null,

    pane: {
        center: ['50%', '40%'],
        size: '85%',
        startAngle: -90,
        endAngle: 90,
        background: {
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
            innerRadius: '60%',
            outerRadius: '100%',
            shape: 'arc'
        }
    },

    tooltip: {
        enabled: false
    },

    // the value axis
    yAxis: {
        stops: [
            [0.1, '#55BF3B'], // green
            [0.5, '#DDDF0D'], // yellow
            [0.9, '#DF5353'] // red
        ],
        lineWidth: 0,
        minorTickInterval: null,
        tickAmount: 2,
        title: {
            y: -70
        },
        labels: {
            y: 16
        }
    },

    plotOptions: {
        solidgauge: {
            dataLabels: {
                y: 5,
                borderWidth: 0,
                useHTML: true
            }
        }
    }
};

var fuelGaugeOptions = {

    chart: {
        type: 'solidgauge'
    },

    title: null,

    pane: {
        center: ['50%', '40%'],
        size: '85%',
        startAngle: -90,
        endAngle: 90,
        background: {
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
            innerRadius: '60%',
            outerRadius: '100%',
            shape: 'arc'
        }
    },

    tooltip: {
        enabled: false
    },

    // the value axis
    yAxis: {
        stops: [
            [0.9, '#55BF3B'], // green
            [0.5, '#DDDF0D'], // yellow
            [0.1, '#DF5353'] // red
        ],
        lineWidth: 0,
        minorTickInterval: null,
        tickAmount: 2,
        title: {
            y: -70
        },
        labels: {
            y: 16
        }
    },

    plotOptions: {
        solidgauge: {
            dataLabels: {
                y: 5,
                borderWidth: 0,
                useHTML: true
            }
        }
    }
};


// The speed gauge
var velocityDial = new Highcharts.chart('velocityDial', Highcharts.merge(velocityGaugeOptions, {
    yAxis: {
        min: 0,
        max: 3000,
        title: {
            text: 'Velocity'
        }
    },

    credits: {
        enabled: false
    },

    series: [{
        name: 'Velocity',
        data: [0],
        dataLabels: {
            format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.2f}</span><br/>' +
                   '<span style="font-size:12px;color:silver">m/s</span></div>'
        },
        tooltip: {
            valueSuffix: ' m/s'
        }
    }]

}));

// The fuel gauge
var fuelDial = new Highcharts.chart('fuelDial', Highcharts.merge(fuelGaugeOptions, {
    yAxis: {
        min: 0,
        max: 100,
        title: {
            text: 'Remaining Fuel'
        }
    },

    credits: {
        enabled: false
    },

    series: [{
        name: 'Fuel',
        data: [100],
        dataLabels: {
            format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.2f}</span><br/>' +
                   '<span style="font-size:12px;color:silver">%</span></div>'
        },
        tooltip: {
            valueSuffix: ' %'
        }
    }]

}));

var altitudeChart = new Highcharts.chart('altitudeChart', {
	title: {
		text: 'Altitude'
	},
  yAxis: {
		title: {
			text: "Altitude (m)"
		},
		labels: {
			style: {
				color: Highcharts.getOptions().colors[1]
			}
		}
	},
	xAxis: {
		title: {
			text: "Time (sec)"
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
		name: 'Altitude',
		data: [],
		showInLegend: false
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
		var prettyVelocity = 0;
		var acceleration = this.acceleration(this.mass);
		var activeMass = this.mass;
		var thisRocket = this;
		var percentFuelRemaining = 100;
		var gForce = 0;
		var altitude = 0;
		var interval = 500; // cycle time in ms

		var launchEvent = setInterval(function() {
			if (flightTime < thisRocket.burnTime) {
				activeMass = activeMass - (thisRocket.burnRate());
				velocity = flightTime * thisRocket.acceleration(activeMass);
				altitude += velocity;
				prettyVelocity = velocity.toFixed(2);
				percentFuelRemaining = (100-(((thisRocket.burnRate() * flightTime)/thisRocket.propellantMass)*100));
				gForce = (1 + (thisRocket.acceleration(activeMass))/9.8).toFixed(1);

				altitudeChart.series[0].addPoint(altitude);
				velocityDial.series[0].points[0].update(velocity);
				fuelDial.series[0].points[0].update(percentFuelRemaining);

				$('#liveMass').html(activeMass.toFixed(2) + " kg");
				$('#liveAltitude').html(altitude.toFixed(1) + " m<br />" + (altitude*3.28084).toFixed(1) + " ft");
				$('#liveAcceleration').html((thisRocket.acceleration(activeMass)).toFixed(1) + " m/s<br />" + gForce + "g");
				flightTime++;
			}
		}, interval);
	}

}
