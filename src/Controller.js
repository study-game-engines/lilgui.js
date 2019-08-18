export class Controller {

	constructor( parent, object, property, className, tagName = 'div' ) {

		this.parent = parent;

		this.object = object;
		this.property = property;

		this.domElement = document.createElement( tagName );
		this.domElement.classList.add( 'controller' );
		this.domElement.classList.add( className );

		this.$name = document.createElement( 'div' );
		this.$name.classList.add( 'name' );

		this.$widget = document.createElement( 'div' );
		this.$widget.classList.add( 'widget' );

		this.domElement.appendChild( this.$name );
		this.domElement.appendChild( this.$widget );

		this.name( property );

		this.parent.children.push( this );
		this.parent.$children.appendChild( this.domElement );

	}

	destroy() {
		this.parent.children.splice( this.parent.children.indexOf( this ) );
		this.parent.$children.removeChild( this.domElement );
	}

	name( name ) {
		this.__name = name;
		this.$name.innerHTML = name;
		return this;
	}

	onChange( fnc ) {
		this.__onChange = fnc;
		return this;
	}

	onFinishChange( fnc ) {
		this.__onFinishChange = fnc;
		return this;
	}

	options( options ) {
		const controller = this.parent.add( this.object, this.property, options );
		controller.name( this.__name );
		this.destroy();
		return controller;
	}

	setValue( value, finished = true ) {
		this.object[ this.property ] = value;
		this._callOnChange();
		if ( finished ) this._callOnFinishedChange();
		this.updateDisplay();
	}

	mutateValue( values, finished = true ) {
		Object.assign( this.getValue(), values );
		this._callOnChange();
		if ( finished ) this._callOnFinishedChange();
		this.updateDisplay();
	}

	_callOnChange() {
		if ( this.__onChange !== undefined ) {
			this.__onChange.call( this, this.getValue() );
		}
	}

	_callOnFinishedChange() {
		if ( this.__onFinishChange !== undefined ) {
			this.__onFinishChange.call( this, this.getValue() );
		}
	}

	enable( enable = true ) {
		this.__disabled = !enable;
		this.domElement.classList.toggle( 'disabled', this.__disabled );
	}

	disable() {
		this.__disabled = true;
		this.domElement.classList.add( 'disabled' );
	}

	getValue() {
		return this.object[ this.property ];
	}

	updateDisplay() {}

}