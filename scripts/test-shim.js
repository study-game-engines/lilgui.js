// shim just enough browser stuff to run in node

class EventTarget {

	constructor() {
		this.__eventListeners = {};
	}

	addEventListener( name, callback ) {
		if ( !this.__eventListeners[ name ] ) {
			this.__eventListeners[ name ] = [];
		}
		this.__eventListeners[ name ].push( callback );
	}

	removeEventListener( name, callback ) {
		const listeners = this.__eventListeners[ name ];
		if ( !listeners ) {
			return;
		}
		const index = listeners.indexOf( callback );
		if ( index === -1 ) {
			return;
		}
		listeners.splice( index, 1 );
	}

	// expose event listeners by name for unit tests
	$callEventListener( name, event ) {
		const listeners = this.__eventListeners[ name ];
		if ( !listeners ) {
			return;
		}
		listeners.forEach( l => l( event ) );
	}

}


class Element extends EventTarget {
	constructor() {
		super();
		this.classList = { add() {}, remove() {} };
		this.style = { setProperty() {} };
		this.parentElement = { removeChild() {} };
	}
	appendChild() {}
	removeChild() {}
	insertBefore() {}
	setAttribute() {}
	getBoundingClientRect() {

		const rect = {
			left: 10.1,
			top: 9.9,
			width: 200,
			height: 100
		};

		rect.right = rect.left + rect.width;
		rect.bottom = rect.top + rect.height;

		return rect;

	}
}

function createElement() {
	return new Element();
}

global.window = new EventTarget();

global.document = {
	body: createElement(),
	createElement: createElement,
	querySelector: createElement
};