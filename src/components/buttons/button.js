import React, { Component } from 'react';

import {	
	TouchableHighlight,
	Button,
	View
  } from 'react-native';

export class MyButton extends React.Component {
	constructor(props){
		super(props);
	}

	render(){
		return <TouchableHighlight>
			<View style={this.props.style}>
				<Button
					onPress={this.props.onPress}
					title={this.props.title}
				/>
			</View>
		</TouchableHighlight>
	}
}
