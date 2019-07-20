import React from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    AsyncStorage
} from "react-native";

import { TouchableButton } from "../components";

import { PAGE_STYLES } from "../share/styles";
import { ROUTES } from "../router/routes";

import { request } from "../server/request";
import { REQUEST_TYPE } from "../server/requestTypes";

const MESSAGES_ON_BUTTON = {
    AUTHORIZATION: "Log in",
    LOADING_DATA: "Getting data...",
    ERROR: "Login or password are incorrect.",
}

const PREFIX = "FOOD-DELIVERY-APP";

const ASYNC_STORAGE_KEYS = {
    LOGIN: PREFIX + "-LOGIN",
    PASSWORD: PREFIX + "-PASSWORD",
};

export class AuthorizationScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            login: "",
            messageOnButton: MESSAGES_ON_BUTTON.AUTHORIZATION,
        };

        this.onLogin = this.onLogin.bind(this);
        this.onChangeLogin = this.onChangeLogin.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
    }

    componentDidMount() {
        const existingLogin = AsyncStorage.getItem(ASYNC_STORAGE_KEYS.LOGIN);
        if (existingLogin) {
            this.onLogin(existingLogin, AsyncStorage.getItem(ASYNC_STORAGE_KEYS.PASSWORD));
        }
    }

    render() {
        return (
            <View style={ [ styles.container, PAGE_STYLES.page ] }>
                <View>
                    {
                        this.state.login
                            ? <Text style={ styles.title } >{ `Hi, ${ this.state.login }!` }</Text>
                            : <View style={ styles.row }>
                                <Text style={ styles.title }>{ "Hi! Please log in" }</Text>
                            </View>
                    }
                </View>

                <Text>Login</Text>
                <TextInput onChangeText={ this.onChangeLogin } />

                <Text>Password</Text>
                <TextInput onChangeText={ this.onChangePassword } />

                <TouchableButton
                    onPress={ this.onLogin }
                    title={ this.state.messageOnButton }
                    style={ styles.button } />
            </View>
        );
    }

    onChangeLogin(name) {
        this.setState({ name });
    }

    onChangePassword(password) {
        this.setState({ password });
    }

    onLogin(login, password) {
        const { login, password } = this.state;
        if (this.state.messageOnButton === MESSAGES_ON_BUTTON.LOADING_DATA) {
            return;
        }

        this.setState({ messageOnButton: MESSAGES_ON_BUTTON.LOADING_DATA })

        // TODO remove it, we haven't authorization yet
        this.props.navigation.navigate(ROUTES.TABS);
        return;

        request(REQUEST_TYPE.post, "authorization", { login, password })
            .then((response) => {

                // TODO verfiy name \ pas
                // TODO getting data about person
                // TODO save in async storage

                if (response) {
                    AsyncStorage.setItem(ASYNC_STORAGE_KEYS.LOGIN, login);
                    AsyncStorage.setItem(ASYNC_STORAGE_KEYS.PASSWORD, password);
                    this.props.navigation.navigate(ROUTES.TABS);
                    return;
                }

                this.setState({ messageOnButton: MESSAGES_ON_BUTTON.ERROR });
            },
                (error) => this.setState({ messageOnButton: MESSAGES_ON_BUTTON.ERROR })
            );
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        alignSelf: "center",
        marginBottom: 30
    },
    button: {
        backgroundColor: "#48BBEC",
        borderColor: "#48BBEC",
        borderWidth: 1,
        borderRadius: 8,
        marginTop: 20,
        marginBottom: 10,
        alignSelf: "stretch",
        justifyContent: "center",
    },
});
