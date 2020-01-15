import { UserManager, UserManagerSettings, Log } from 'oidc-client'

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
    private readonly userManager: UserManager;

    constructor() {
        this.isAuthenticated = false;
        this.identity = UnknownUserIdentity;
        this.userManager = this.createUserManager();
    }

    identity: IUserIdentity;
    isAuthenticated: boolean;

    trySignIn = async () => {
        const user = await this.userManager.getUser();

        if (user) {
            this.isAuthenticated = true;
            this.identity = new UserIdentity(
                user.profile.given_name,
                user.profile.family_name,
                user.access_token,
                user.profile);

            this.userManager.startSilentRenew();
        }
    }

    logIn = async () => {
        await this.userManager.signinRedirect();

        const user = await this.userManager.getUser();

        if (user) {
            this.userManager.startSilentRenew();
        }
    }

    logOut = async () => {
        await this.userManager.signoutRedirect();
    }

    static handleSignIn = async () => {
        var userManager = new UserManager({ response_mode: "query" });

        userManager.signinRedirectCallback()
            .then(() => { window.location.href = window.location.origin; })
            .catch(error => { console.error(error); });
    }

    static handleSilentRenew = async () => {
        var userManager = new UserManager({ response_mode: "query" });

        userManager.signinSilentCallback()
            .then(() => { window.location.href = window.location.origin; })
            .catch(error => { console.error(error); });
    }

    private createUserManager(): UserManager {
        const config = { //: UserManagerSettings = {
            authority: "https://localhost:5002",
            client_id: "interactive.public",
            redirect_uri: window.location.origin + "/signin-callback",
            post_logout_redirect_uri: window.location.origin,
            response_mode: "query",
            popup_redirect_uri: window.location.origin + "/popup",
            popupWindowFeatures: "menubar=yes,location=yes,toolbar=yes,width=1200,height=800,left=100,top=100;resizable=yes",
            response_type: "code",
            scope: "openid profile api offline_access",
            loadUserInfo: true,
            silent_redirect_uri: window.location.origin + "/silent-renew",
            automaticSilentRenew: true,
            monitorAnonymousSession: true,
            revokeAccessTokenOnSignout: true,
            filterProtocolClaims: false
        };

        const userManager = new UserManager(config);

        userManager.events.addUserLoaded(user => {
            console.log("User loaded");
            this.identity = new UserIdentity(
                user.profile.given_name,
                user.profile.family_name,
                user.access_token,
                user.profile);
            this.isAuthenticated = true;
        });

        userManager.events.addUserUnloaded(() => {
            console.log("User logged out locally.");
            this.identity = UnknownUserIdentity;
            this.isAuthenticated = false;
        });

        userManager.events.addAccessTokenExpiring(() => {
            console.log("Access token is expiring.");
        });

        userManager.events.addAccessTokenExpired(() => {
            console.log("Access token has expired.");
            this.identity = UnknownUserIdentity;
            this.isAuthenticated = false;
        });

        userManager.events.addSilentRenewError(error => {
            console.log("Silent renew error: " + error.message);
            this.identity = UnknownUserIdentity;
            this.isAuthenticated = false;
        });

        userManager.events.addUserSignedOut(() => {
            console.log("User signed out of OP");
            this.identity = UnknownUserIdentity;
            this.isAuthenticated = false;
        });

        Log.logger = console;
        Log.level = Log.INFO;

        return userManager;
    }
}
