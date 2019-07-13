import React, { Component } from 'react';

import {	
	StyleSheet,
	Text,
	View
  } from 'react-native';

import { FlexBlock } from './exportCopmonents';

import { TEXT_STYLES } from "../share/styles";

export class BlockFoodDescription extends React.Component {
	constructor(props){
		super(props);
	}

	render(){
		return (
			<View style={this.props.blockWidth}>
				<FlexBlock 
					description={this.props.description}
					name={this.props.name}
					contentWidth={
						(this.props.amount && this.props.amount > 1) || this.props.cost 
							? styles.contentWidthWithAdditionalInfo
							: styles.contentWidthWithoutAdditionalInfo 
					}
					additionalInfo={
						<View>
							<View style={[this.props.amount && this.props.amount > 1 ? styles.amountBlock : null]}>
								<View>{
									this.props.amount && this.props.amount > 1
									? <Text>{`(${this.props.amount})`}</Text>
									: null
								}</View>
							</View>
							<View>{
									this.props.cost
									? <Text>{`${this.props.cost}р`}</Text>
									: null
								}</View>
						</View>
					}/>
			</View>
		);
	}
}

const ADDITIONAL_INFO_SIZE = TEXT_STYLES.subHeader * 5;  // ***р.

const styles = StyleSheet.create({
	additionalInfoBlock: {
		width: ADDITIONAL_INFO_SIZE,
	},
	contentWidthWithoutAdditionalInfo: {
		width: "95%",
		paddingLeft: 5,
	},
	contentWidthWithAdditionalInfo: {
		width: "85%",
		paddingLeft: 5,
	}
});
