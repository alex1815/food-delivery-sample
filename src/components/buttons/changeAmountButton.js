import React from "react";

import { TouchableButton } from "./touchableButton";

const PLUS = " + ", MINUS = " - ";

export class IncreaseAmount extends React.PureComponent {
	render() {
		const { setNewValue, value } = this.props;
		return <TouchableButton onPress={() => setNewValue(value + 1)} title={ PLUS }/>
	}
}

export class DecreaseAmount extends React.PureComponent {
	render() {
		const { setNewValue, value } = this.props;
		return <TouchableButton onPress={ () => setNewValue(value - 1)} title={ MINUS }/>
	}
}
