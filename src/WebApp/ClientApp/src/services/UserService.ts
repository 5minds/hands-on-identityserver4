export interface IUserIdentity {
    readonly givenName: string;
    readonly familyName: string;
    readonly name: string;
    readonly accessToken: string;
    readonly profileClaims: object;
}

class UserIdentity implements IUserIdentity {
    constructor(givenName, familyName, accessToken, profileClaims) {
        this.givenName = givenName;
        this.familyName = familyName;
        this.name = (this.familyName && this.familyName.length > 0) ? `${this.givenName} ${this.familyName}` : this.givenName;
        this.accessToken = accessToken;
        this.profileClaims = profileClaims;
    }

    givenName: string;
    familyName: string;
    name: string;
    accessToken: string;
    profileClaims: object;
}

export interface IUserService {
    identity: IUserIdentity;
    isAuthenticated: boolean;
    trySignIn(): Promise<void>;
    logIn(): Promise<void>;
    logOut(): Promise<void>;
}

export const UnknownUserIdentity = new UserIdentity("Stranger", "", "", "");

export class UserService implements IUserService {
    constructor() {
        this.isAuthenticated = false;
        this.identity = UnknownUserIdentity;
    }

    identity: IUserIdentity;
    isAuthenticated: boolean;

    trySignIn = async () => {
        // TODO: Restore any previous session if possible
    }

    logIn = async () => {
        // TODO: Implement the log-in routine
        window.alert("Wish you could log in right now, don't you?");
    }

    logOut = async () => {
        // TODO: Implement the log-out routine
    }

    static handleSignIn = async () => {
        // TODO: Implement the callback for code/token delivers
    }

    static handleSilentRenew = async () => {
        // TODO: Implement the callback for silent renewal
    }
}
