import { ROLES } from "../models";
import { SERVER } from "../server/server";

export class RoleService {
    static async getRole() {
        return await SERVER.getRole();
    }

    static async isManager() {
        return (await RoleService.getRole()) === ROLES.MANAGER;
    }
}
