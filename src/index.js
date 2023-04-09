module.exports = (function () {

	// Initialize a weak map to hold promises.
	const childrenLoadedPromises = new WeakMap();

	/**
	 * Checks to see if children elements are loaded.
	 * @param {object} element - Element to look for children within.
	 * @return {boolean} Whether the children elements are loaded or not.
	 */

	const childrenLoadedSynchronous = (element) => {

		// Document ready states reference: https://developer.mozilla.org/en-US/docs/Web/API/Document/readyState
		if (document.readyState === 'interactive' || document.readyState === 'complete') {
			// Children elements are assumed to be loaded.
			return true;
		}

		// While the element exists.
		while (element) {
			// If the next sibling element exists.
			if (element.nextSibling) {
				// The original passed element and its children have been loaded.
				return true;
			}
			// Set the element to the parent element.
			element = element.parentNode;
		}

		// If code execution gets here, it's assumed children elements are not loaded.
		return false;

	};

	/**
	 * An asynchronous wrapper for the childrenLoadedSynchronous function.
	 * @param {object} element - Element to look for children within.
	 * @param {boolean} [forceNewPromise=false] - Option to invalidate existing promises.
	 * @return {*} True if children are loaded, otherwise a promise.
	 */

	const childrenLoaded = (element, forceNewPromise = false) => {

		// If children are loaded immediately.
		if (childrenLoadedSynchronous(element)) {
			return true;
		}

		// If an existing promise for the passed element does not exist yet or if a new promise is being forced.
		else if (!childrenLoadedPromises.get(element) || forceNewPromise) {
			// Create a new promise.
			const childrenLoadedPromise = new Promise((resolve) => {
				// Create a new mutation observer.
				const observer = new MutationObserver(() => {
					// When children are loaded.
					if (childrenLoadedSynchronous(element)) {
						// Disconnect the mutation observer.
						observer.disconnect();
						// Resolve the promise.
						resolve(true);
					}
				});
				// Watch for child element updates.
				observer.observe(element, {
					childList: true
				});
			});
			// Set the promise weak map entry for the passed element.
			childrenLoadedPromises.set(element, childrenLoadedPromise);
		}

		// Return the promise for the passed element.
		// Multiple asynchronous calls of childrenLoaded for the same element should return the same promise.
		return childrenLoadedPromises.get(element);

	};

	// Attach the synchronous function to the export for optional use.
	childrenLoaded.synchronous = childrenLoadedSynchronous;
	// Add shorthand alias for synchronous.
	childrenLoaded.sync = childrenLoaded.synchronous;
	// Return the asynchronous function as the export.
	return childrenLoaded;

})();