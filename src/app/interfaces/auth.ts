import { IUser } from "./user";

export interface Auth {
    token: string;
    refreshToken?: string;
    user: IUser;
}