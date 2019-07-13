import React, { Component } from 'react';

import {	
	StyleSheet,
	Text,
	View
  } from 'react-native';

export class FlexBlock extends React.Component {
	constructor(props){
		super(props);
	}

	render(){
		return (
			<View style={styles.flex}>
				<View style={[styles.block, this.props.blockWidth]}>
					<View style={[ styles.contentBlock, this.props.contentWidth]}>
						<View>{
							<Text>{
								this.props.description
								? `${this.props.name} (${this.props.description})`
								: this.props.name
							}</Text>
						}</View>
					</View>
					<View>
					{
						this.props.additionalInfo
						? this.props.additionalInfo
						: null
					}
					</View>
				</View>
			</View>
		);
	}
}

const SMALL_PADDING = 10;

const styles = StyleSheet.create({
	flex: {
		display: "flex"
	},
    block: {
		flexDirection: "row",
		justifyContent: 'center',
		alignItems: "center",
		backgroundColor: '#ffffff',
		paddingTop: SMALL_PADDING,
		paddingBottom: SMALL_PADDING,
		margin: 5,
		borderRadius: 4,
		borderWidth: 0.5,
		borderColor: '#d6d7da',
	},
	contentBlock: {
		width: "100%",
		alignItems: "center"
	},
});
