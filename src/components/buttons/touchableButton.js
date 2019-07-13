import React from "react";

import {	
	TouchableHighlight,
	Button,
	View
  } from "react-native";

export class TouchableButton extends React.Component {
	constructor(props){
		super(props);
	}

	render() {
		const { style, onPress, title } = this.props;
		return <TouchableHighlight>
			<View style={ style }>
				<Button
					onPress={ onPress }
					title={ title }
				/>
			</View>
		</TouchableHighlight>
	}
}
