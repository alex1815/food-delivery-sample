import { ROLES } from "../models/exportModels";
import { SERVER } from "../server/server";

export class RoleService {
	static async getRole () {
		return SERVER.getRole();
	}

	static async iIsManager () {
		return (await RoleService.getRole()) == ROLES.MANAGER;
	}
}
