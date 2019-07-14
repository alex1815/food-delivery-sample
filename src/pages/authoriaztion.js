import React from "react";
import {
    StyleSheet,
    Button,
    Text,
    View,
    TextInput,
	AsyncStorage
} from "react-native";

import { TouchableButton } from "../components";

import { PAGE_STYLES, TEXT_STYLES } from "../share/styles";
import { ROUTES } from "../share/routesList";
import { ROLES } from "../models";

import { request } from "../server/request";
import { REQUEST_TYPE } from "../server/requestTypes";

const MESSAGES_ON_BUTTON = {
	AUTHORIZATION: "Авторизация",
	LOADING_DATA: "Получение данных...",
	ERROR: "Логин или пароль не подходят или устарели.",
}

const PREFIX = "FOOD-DELIVERY-APP";

const ASYNC_STORAGE_KEYS = {
	LOGIN: PREFIX + "-LOGIN",
	PASSWORD: PREFIX + "-PASSWORD",
};

export class AuthorizationScreen extends React.Component {
	constructor(props){
		super(props);

		this._onChangeName = this._onChangeName.bind(this);
		this._onLogin = this._onLogin.bind(this);
		this._onChangePassword = this._onChangePassword.bind(this);

		this.state = {
			// TODO getting name form local storage
			name: "",
			messageOnButton: MESSAGES_ON_BUTTON.AUTHORIZATION,
		};

		const oldLogin = AsyncStorage.getItem(ASYNC_STORAGE_KEYS.LOGIN);
		if (oldLogin) {
			this._onLogin(oldLogin, AsyncStorage.getItem(ASYNC_STORAGE_KEYS.PASSWORD));
		}
	}
	
	_userLogout() {
		return true;
	}
	
	_userLogin() {
		return true;
	}
	
	_userSignup() {
		return true;
	}
	
	_getProtectedQuote() {
		return true;
	}

  render() {
	return (
		<View style={[styles.container, PAGE_STYLES.page]}>
			<View>
				{
					this.state.name
						? <Text style={styles.title} >{ this.state.name ? `Привет, ${this.state.name}!` : null }</Text>
						: <View style={styles.row}>
							<Text style={styles.title}>{"Привет, Неизвестный! \n Пройди авторизацию"}</Text>
						</View>
				}
			</View>

			<Text>Имя</Text>
			<TextInput onChangeText={this._onChangeName}/>

			<Text>Пароль</Text>
			<TextInput onChangeText={this._onChangePassword}/>

			<TouchableButton
				onPress={() => this._onLogin(this.state.name, this.state.password)}
				title={this.state.messageOnButton}
				style={styles.button}/>
		</View>
	);
	}
	
	_onChangeName(name) {
		this.setState({ name });
	}

	_onChangePassword(password) {
		this.setState({ password });
	}

	_onLogin(login, password) {
		if (this.state.messageOnButton === MESSAGES_ON_BUTTON.LOADING_DATA) {
			return;
		}

		this.setState({ messageOnButton: MESSAGES_ON_BUTTON.LOADING_DATA })

		// TODO remove it + add endpoint
		this.props.navigation.navigate(ROUTES.TABS);

		request(REQUEST_TYPE.post, "authorization", { login, password })
			.then((response) => {
				
			// TODO verfiy name \ pas
			// TODO getting data about person

				if (response) {
					this.props.navigation.navigate(ROUTES.TABS);
					ASYNC_STORAGE_KEYSAsyncStorage.setItem(ASYNC_STORAGE_KEYS.LOGIN, login);
					ASYNC_STORAGE_KEYSAsyncStorage.setItem(ASYNC_STORAGE_KEYS.PASSWORD, password);
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
  