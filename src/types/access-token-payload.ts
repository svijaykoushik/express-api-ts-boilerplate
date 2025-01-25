import { UserInfo } from './userinfo';

export interface AccessTokenPayload {
    scope: string;
    userinfo: UserInfo;
}
