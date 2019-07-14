import {
	StyleSheet,
  } from "react-native";

const PADDING = 20;
const PAGE = {
    display: "flex",
    padding: PADDING,
    backgroundColor: "#ffffff",
    position: "absolute",
    height: "100%",
    width: "100%",
}

export const PAGE_STYLES = StyleSheet.create({
    page: PAGE,
    pageWithScrool: {
        ...PAGE, 
        padding: 0,
        paddingLeft: PADDING,
        paddingTop: PADDING, 
        paddingBottom: PADDING,
    },
    scrollForPageWithScroll: {
        paddingRight: PADDING,
    }
});

export const TEXT_STYLES = StyleSheet.create({
    normal: {
        fontSize: 14,
    },
    big: {
        fontSize: 16,
    },
    header: {
        fontSize: 18
    },
    subHeader: {
        fontSize: 16
    },
    bigHeader: {
        fontSize: 22
    },
});
