import { SERVER_PATH } from "./config";
import { REQUEST_TYPE } from "./requestTypes";

export async function request(type = REQUEST_TYPE.get, endpoint, body={}, headers) {
	const requestParams = {
		method: type,
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			...headers
		},
		body: JSON.stringify(body),
	}

	try {
		const result = await fetch(`${SERVER_PATH }/${endpoint}`, requestParams);
		return await result.json();
	} catch (e) {
		console.log(e);
		return e;
	}
}
