(function() {
	require('openmusic-slider').register('openmusic-slider');
	require('openmusic-xycontroller').register('openmusic-xycontroller');

	var MIDIUtils = require('midiutils');
	
	var proto = Object.create(HTMLElement.prototype);
	
	proto.createdCallback = function() {
		
		var that = this;

		this.values = {
			octaves: 5,
			baseNote: 24 // TODO make this configurable
		};
		
		this._lastPlayedFrequency = 0;
		this._lowerFrequency = 0;
		this._upperFrequency = 0;

		this._updateRanges();
		
		this.attachedTheremin = null;

		// making web components MVC framework proof.
		this.innerHTML = '';

		var xycontroller = document.createElement('openmusic-xycontroller');
		this.appendChild(xycontroller);

		this.appendChild(document.createElement('br'));
		
		var octavesInput = document.createElement('openmusic-slider');
		octavesInput.setAttribute('step', 1); // TODO why can't they work as properties? mmm
		octavesInput.setAttribute('min', 1);
		octavesInput.setAttribute('max', 8);
		octavesInput.value = this.values.octaves;

		octavesInput.addEventListener('input', function(e) {
			console.log(this.value);
			that.setValue('octaves', this.value);
		});
		this.appendChild(octavesInput);
	
		var divCurrentValues = document.createElement('div');
		this.appendChild(divCurrentValues);
	
		var spanFrequency = document.createElement('span');
		var separator = document.createElement('br');
		var spanNote = document.createElement('span');
		divCurrentValues.appendChild(spanFrequency);
		divCurrentValues.appendChild(separator); // TODO this layout is terrible, should make something better
		divCurrentValues.appendChild(spanNote);

		
		xycontroller.addEventListener('touchstart', function(ev) {
			if(!that.attachedTheremin) {
				return;
			}
			that._setFrequency(that._lastPlayedFrequency);
			that.attachedTheremin.start();
		});
	
		xycontroller.addEventListener('touchend', function(ev) {
			if(!that.attachedTheremin) {
				return;
			}
			that.attachedTheremin.stop();
		});
		
		xycontroller.addEventListener('input', function(ev) {

			// Why bother if we're not attached to any instrument?
			if(!that.attachedTheremin) {
				return;
			}

			var detail = ev.detail;
			var x = detail.x;
			var y = detail.y;
			var baseNote = that.values.baseNote;
			var octaves = that.values.octaves;
			var baseFrequency = that._lowerFrequency;
			var upperFrequency = that._upperFrequency;
			var intervalFrequency = upperFrequency - baseFrequency;
			var finalFrequency = mapValues(y, -1, 1, baseFrequency, upperFrequency);
			var finalNoteNumber = MIDIUtils.frequencyToNoteNumber(finalFrequency);
			var finalNote = MIDIUtils.noteNumberToName(finalNoteNumber);
			var finalVolume = mapValues(x, -1, 1, 0, 1);
			
			that._lastPlayedFrequency = finalFrequency;

			//console.log(baseFrequency, upperFrequency, finalFrequency);
			//
			spanFrequency.innerHTML = finalFrequency.toFixed(2) + ' (' + baseFrequency.toFixed(2) + '-' + upperFrequency.toFixed(2) + ' Hz)';
			spanNote.innerHTML = finalNote + ' (' + finalNoteNumber + ')';

			that._setFrequency(finalFrequency);
			that._setVolume(finalVolume);
			
		});
		
		// this.readAttributes();
		
	};

	// TODO make this a module
	function mapValues(value, in_min, in_max, out_min, out_max) {

		if(in_min == in_max) {
			return out_min;
		}

		return out_min + (out_max - out_min) * (value - in_min) / (in_max - in_min);
	}

	proto._updateRanges = function() {
		var baseNote = this.values.baseNote;
		var octaves = this.values.octaves;

		this._lowerFrequency = MIDIUtils.noteNumberToFrequency(baseNote);
		this._upperFrequency = MIDIUtils.noteNumberToFrequency(baseNote + octaves * 12);

	};

	proto._setFrequency = function(v) {
		if(!this.attachedTheremin) {
			return;
		}
		this.attachedTheremin.frequency.value = v;
	};

	proto._setVolume = function(v) {
		if(!this.attachedTheremin) {
			return;
		}
		this.attachedTheremin.volume.value = v;
	};

	proto.attachedCallback = function() {
		// Setup input listeners, perhaps start requestAnimationFrame here
	};


	proto.detachedCallback = function() {
	};


	proto.readAttributes = function() {
		var that = this;
		// TODO
		[].forEach(function(attr) {
			that.setValue(attr, that.getAttribute(attr));
		});
	};

	
	proto.setValue = function(name, value) {

		if(value !== undefined && value !== null) {
			this.values[name] = value;
		}

		// TODO: Potential re-draw or DOM update in reaction to these values
		this._updateRanges();
	};


	proto.getValue = function(name) {
		return this.values[name];
	};

	
	proto.attributeChangedCallback = function(attr, oldValue, newValue, namespace) {
		
		this.setValue(attr, newValue);
		
		// var e = new CustomEvent('change', { detail: this.values } });
		// this.dispatchEvent(e);
		
	};


	// Optional: for components that represent an audio node
	proto.attachTo = function(audioNode) {
		this.attachedTheremin = audioNode;
		/*audioNode.addEventListener('someevent', function(e) {
			// ...
		});*/
	};


	//


	var component = {};
	component.prototype = proto;
	component.register = function(name) {
		document.registerElement(name, {
			prototype: proto
		});
	};

	if(typeof define === 'function' && define.amd) {
		define(function() { return component; });
	} else if(typeof module !== 'undefined' && module.exports) {
		module.exports = component;
	} else {
		component.register('openmusic-web-component-template'); // automatic registration
	}

}).call(this);

