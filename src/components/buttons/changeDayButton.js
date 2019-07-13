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
	render() {
		const { date, setNewDate } = this.props;
		return <ChangeDayButton 
			date={ date } 
			setNewDate={ setNewDate } 
			changeDay={ (date, amount) => date + amount } 
			title="Next" />
	}
}

export class BackDayButton extends React.Component {
	render() {
		const { date, setNewDate } = this.props;
		return <ChangeDayButton 
			date={ date }
			setNewDate={ setNewDate }
			changeDay={ (date, amount) => date - amount } 
			title="Prev" />
	}
}
