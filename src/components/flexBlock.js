import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

export class FlexBlock extends React.Component {
    render() {
        const { blockWidth, contentWidth, description, name, children } = this.props;
        return (
            <View style={ styles.flex }>
                <View style={ [ styles.block, blockWidth ] }>
                    <View style={ [ styles.contentBlock, contentWidth ] }>
                        <Text>{ description
                            ? `${ name } (${ description })`
                            : name
                        }</Text>
                    </View>
                    <View>
                        { children }
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
