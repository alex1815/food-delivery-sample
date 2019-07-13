import React from "react";
import { TouchableButton } from "./touchableButton";

class ChangeDayButton extends React.Component {
	calculateNextDate() {
		const { setNewDate, changeDay, date } = this.props;
		return setNewDate(date.setDate(changeDay(date.getDate(), 1)));
	}

	render() {
		return <TouchableButton onPress={()=> this.calculateNextDate()} title={this.props.title} />
	}
}

export class NextDayButton extends React.Component {
	changeDay(date, amount) {
		return date + amount;
	}

	render() {
		return <ChangeDayButton 
			date={this.props.date} 
			setNewDate={this.props.setNewDate} 
			changeDay={this.changeDay} 
			title="Вперёд" />
	}
}

export class BackDayButton extends React.Component {
	constructor(props) {
		super(props);
	}

	changeDay(date, amount) {
		return date - amount;
	}

	render() {
		return <ChangeDayButton date={this.props.date} setNewDate={this.props.setNewDate} changeDay={this.changeDay} title="Назад" />
	}
}
