require('./webcomponents-lite.js');
require('openmusic-oscilloscope').register('openmusic-oscilloscope');
require('../').register('openmusic-theremin-ui');

var ac = new AudioContext();
var limiter = ac.createDynamicsCompressor();
// limiter.gain.value = 0.25;
limiter.connect(ac.destination);

var analyser = ac.createAnalyser();
var oscilloscope = document.createElement('openmusic-oscilloscope');
oscilloscope.attachTo(analyser);

analyser.connect(limiter);

var Theremin = require('openmusic-theremin');
var thereminNode = Theremin(ac);
thereminNode.connect(analyser);
thereminNode.start();

var thereminElement = document.createElement('openmusic-theremin-ui');
thereminElement.attachTo(thereminNode);

document.body.appendChild(componentElement);
document.body.appendChild(oscilloscope);
