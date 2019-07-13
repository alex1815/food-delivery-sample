import React, { Component } from 'react';

import { MyButton } from "./touchableButton";

const PLUS = " + ", MINUS = " - ";

export class IncreaseAmount extends React.Component {
	constructor(props) {
		super(props);

		this._calculateAmount = this._calculateAmount.bind(this);
	}

	_calculateAmount(value, amount) {
		return this.props.setNewValue(this.props.value + 1);
	}

	render() {
		return <MyButton onPress={this._calculateAmount} title={PLUS}/>
	}
}

export class DecreaseAmount extends React.Component {
	constructor(props) {
		super(props);

		this._calculateAmount = this._calculateAmount.bind(this);
	}

	_calculateAmount(value, amount) {
		return this.props.setNewValue(this.props.value - 1);
	}

	render() {
		return <MyButton onPress={this._calculateAmount} title={MINUS}/>
	}
}
