# openmusic-theremin-ui

> UI for Theremin

[![Install with NPM](https://nodei.co/npm/openmusic-theremin-ui.png?downloads=true&stars=true)](https://nodei.co/npm/openmusic-theremin-ui/)

## Installation

Grab `ThereminUI.js` from the repo or do `npm install openmusic-theremin-ui`.

### If not using any package manager

Include `ThereminUI.js` before you use the component.

```javascript
<script src="ThereminUI.js"></script>
```

It will be registered automatically as `openmusic-theremin-ui`, so you can `document.createElement('openmusic-theremin-ui')` or just have `<openmusic-theremin-ui>` elements in your HTML source.

### If using npm

You need to load the module and then register it--it is not automatically registered!

```javascript
require('openmusic-theremin-ui').register('openmusic-theremin-ui');
```

But you could even register it with other name, for example:

```javascript
require('openmusic-theremin-ui').register('mega-theremin-ui');
```

Up to you.

## Usage

Have a look at `demo/demo.js` for an example that shows how to use this component with the Theremin in OpenMusic.

<!--
TODO complete this
### Attributes

#### `attribute`

Explanation of attribute.

Examples:

```javascript
<openmusic-theremin-ui attribute="-1"></openmusic-theremin-ui>
```

### Events

#### `event`

This event will be dispatched when x happens. To listen for `event` events on this component, add an event listener:

```javascript
component.addEventListener('event', function(ev) {
	var detail = ev.detail;
	// detail contains the values you want
});
```
-->
