import { IUser } from "./user";

export interface IAuthResponse {
    token: string;
    refreshToken?: string;
    user: IUser;
}