(function() {
	require('openmusic-xycontroller').register('openmusic-xycontroller');

	var MIDIUtils = require('midiutils');
	
	var proto = Object.create(HTMLElement.prototype);
	
	proto.createdCallback = function() {
		
		this.values = {
			octaves: 2,
			baseNote: 45
		};
		
		this.attachedTheremin = null;

		// making web components MWC framework proof.
		this.innerHTML = '';

		var xycontroller = document.createElement('openmusic-xycontroller');
		this.appendChild(xycontroller);

		var that = this;
		
		xycontroller.addEventListener('input', function(ev) {

			// Why bother if we're not attached to any instrument?
			if(!that.attachedTheremin) {
				return;
			}

			var detail = ev.detail;
			var x = detail.x; // -1, 1
			var baseNote = that.values.baseNote;
			var octaves = that.values.octaves;
			var baseFrequency = MIDIUtils.noteNumberToFrequency(baseNote);
			var upperFrequency = MIDIUtils.noteNumberToFrequency(baseNote + octaves * 12);
			var intervalFrequency = upperFrequency - baseFrequency;
			var offset = (x + 1) * 0.5;
			var finalFrequency = baseFrequency + intervalFrequency * offset;
			//console.log(baseFrequency, upperFrequency, finalFrequency);

			that.attachedTheremin.frequency.gain.value = finalFrequency;
			
		});
		
		// this.readAttributes();
		
	};

	
	proto.attachedCallback = function() {
		// Setup input listeners, perhaps start requestAnimationFrame here
	};


	proto.detachedCallback = function() {
	};


	proto.readAttributes = function() {
		var that = this;
		[].forEach(function(attr) {
			that.setValue(attr, that.getAttribute(attr));		
		});
	};

	
	proto.setValue = function(name, value) {

		if(value !== undefined && value !== null) {
			this.values[name] = value;
		}

		// TODO: Potential re-draw or DOM update in reaction to these values
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

