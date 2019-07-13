import React from "react";
import { TouchableButton } from "./touchableButton";

class ChangeDayButton extends React.Component {
	constructor(props){
		super(props);

		this._calculateNextDay = this._calculateNextDay.bind(this);
	}

	_calculateNextDay() {
		return this.props.newDate(this.props.date.setDate( this.props.dayChangingFunc(this.props.date.getDate(), 1)));
	}

	render() {
		return <TouchableButton onPress={this._calculateNextDay} title={this.props.title} />
	}
}

export class NextDayButton extends React.Component {
	constructor(props) {
		super(props);
	}

	_dayChangingFunc(date, amount) {
		return date + amount;
	}

	render() {
		return <ChangeDayButton 
			date={this.props.date} 
			newDate={this.props.setNewDate} 
			dayChangingFunc={this._dayChangingFunc} 
			title="Вперёд" />
	}
}

export class BackDayButton extends React.Component {
	constructor(props) {
		super(props);
	}

	_dayChangingFunc(date, amount) {
		return date - amount;
	}

	render() {
		return <ChangeDayButton date={this.props.date} newDate={this.props.setNewDate} dayChangingFunc={this._dayChangingFunc} title="Назад" />
	}
}
