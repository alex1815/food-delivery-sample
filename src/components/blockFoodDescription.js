import React from "react";

import { StyleSheet, Text, View } from "react-native";

import { FlexBlock } from ".";

import { TEXT_STYLES } from "../share/styles";

export class BlockFoodDescription extends React.Component {
    isPositiveAmount(amount) {
        return amount && amount >= 1;
    }

    render() {
        const { blockWidth, description, name, amount, cost } = this.props;
        const isPositiveAmount = this.isPositiveAmount(amount);
        return (
            <View style={ blockWidth }>
                <FlexBlock
                    description={ description }
                    name={ name }
                    contentWidth={
                        isPositiveAmount || cost
                            ? styles.contentWidthWithAdditionalInfo
                            : styles.contentWidthWithoutAdditionalInfo
                    }>
                    <View>
                        <View style={ [ isPositiveAmount && styles.amountBlock ] }>
                            { isPositiveAmount && <Text>{ `(${ amount })` }</Text> }
                        </View>
                        { cost && <Text>{ `${ cost }р` }</Text> }
                    </View>
                </FlexBlock>
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
