require('./webcomponents-lite.js');
require('../').register('openmusic-theremin-ui');

var ac = new AudioContext();
var componentElement = document.createElement('openmusic-theremin-ui');

document.body.appendChild(componentElement);

