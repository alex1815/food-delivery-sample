import React from "react";
import { TouchableButton } from "./touchableButton";

class ChangeDayButton extends React.PureComponent {
    constructor() {
        super();

        this.calculateNextDate = this.calculateNextDate.bind(this);
    }

    calculateNextDate() {
        const { setNewDate, changeDay, date } = this.props;
        return setNewDate(date.setDate(changeDay(date.getDate(), 1)));
    }

    render() {
        return <TouchableButton onPress={ this.calculateNextDate } title={ this.props.title } />
    }
}

export class NextDayButton extends React.PureComponent {
    changeDay = (date, amount) => date + amount;

    render() {
        const { date, setNewDate } = this.props;
        return <ChangeDayButton
            date={ date }
            setNewDate={ setNewDate }
            changeDay={ this.changeDay }
            title="Next" />
    }
}

export class BackDayButton extends React.PureComponent {
    changeDay = (date, amount) => date - amount;

    render() {
        const { date, setNewDate } = this.props;
        return <ChangeDayButton
            date={ date }
            setNewDate={ setNewDate }
            changeDay={ this.changeDay }
            title="Prev" />
    }
}
