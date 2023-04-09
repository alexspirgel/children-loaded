# Children Loaded

Children Loaded is a JavaScript function for determining if child elements are loaded. This script was developed for use with built-in web components, but it is flexible enough to be used in other contexts as well.

## The Built-In Web Component Problem

Built-in web components are HTML elements that can behave as a registered custom element. You can read more about built-in web components here: <a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements" target="_blank">https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements</a>

A problem occurs when a built-in custom element is constructed and need access to its child elements. Available native callbacks fire too early. Both the `constructor` and the `connectedCallback` methods are called before child elements are parsed. You can read a lengthy discussion about this issue here: <a href="https://github.com/WICG/webcomponents/issues/809" target="_blank">https://github.com/WICG/webcomponents/issues/809</a>

## Installation

### Option 1: Install using NPM

Install the script using NPM via the command line:

```
npm install @alexspirgel/children-loaded
```

Require the script in the codebase where necessary:

```js
const childrenLoaded = require('@alexspirgel/children-loaded');
```

### Option 2: Install using a script tag

Download the normal or minified script from the 'dist' folder.

Add a script tag with a path to the downloaded file. Make sure this script tag is placed before other script tags that need access to the `childrenLoaded` function.

```html
<script src="path/to/children-loaded.min.js"></script>
```

## Usage

```js
const childrenLoaded = require('@alexspirgel/children-loaded');

class MyCustomElement extends HTMLUListElement {
	constructor() {
		super();
		this.querySelectorAll('li'); // returns 0 nodes
	}
	async connectedCallback() {
		this.querySelectorAll('li'); // returns 0 nodes
		await childrenLoaded(this);
		this.querySelectorAll('li'); // returns 3 nodes
	}
}

customElements.define('my-custom-element', MyCustomElement, {extends: 'ul'});
```

```html
<ul is="my-custom-element">
	<li>item 1</li>
	<li>item 2</li>
	<li>item 3</li>
</ul>
```

<a href="http://alexanderspirgel.com/children-loaded/demo" target="_blank">View a working demo →</a>

## Alternative solutions

### Extend native element with custom callback

Another way to address this problem is to extend a native element class with a custom callback. The underlying logic of the callback would be similar to that of the children loaded script, but instead of a separate function it would be an available callback method on the element class, similar to `connectedCallback`. In my opinion this approach constrains the versatility available to built-in web components, their ability to extend many native elements. With this approach you could either use one base element class or create custom versions of all extendable native elements. The html-parsed-element repository (<a href="https://github.com/WebReflection/html-parsed-element" target="_blank">https://github.com/WebReflection/html-parsed-element</a>) takes the base element class approach meaning you are able to use this repository for all elements that implement the `HTMLElement` class. This includes many elements, but not all. Some notable omissions are: `<a>`, `<button>`, `<div>`, and many more.

### Wait for the entire page to load

This is commonly accomplished with callbacks such as the vanilla `DOMContentLoaded` document event listener or the jQuery `$('document').ready` function. Both of these solutions are sufficient, but they wait for the entire document to be loaded. The `childrenLoaded` function can be used to initialize these scripts as soon as only the minimum required elements for that script are loaded. This could be especially impactful for components that affect interactable content at the immediately visible section of a large webpage.
