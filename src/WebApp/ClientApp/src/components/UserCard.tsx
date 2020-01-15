import * as React from "react";
import ReactJson from "react-json-view"
import { IUserIdentity, UnknownUserIdentity } from "../services/UserService";
import { AppContext } from "../AppContext"

export interface IUserCardState {
    userIdentity: IUserIdentity;
    isBusy: boolean;
    token: object | null;
    profileClaims: object | null;
}

export class UserCard extends React.Component<{}, IUserCardState> {
    static displayName = UserCard.name;
    static contextType = AppContext;
    context!: React.ContextType<typeof AppContext>;

    constructor(props) {
        super(props);

        this.state = { isBusy: false, userIdentity: UnknownUserIdentity, token: null, profileClaims: null };
    }

    componentDidMount() {
        this.setUp();
    }

    private setUp = async () => {
        await this.executeSafe(async () => {
            const { userService } = this.context!;
            await userService.trySignIn();
            const tokenContent = this.getTokenContent();
            this.setState({ userIdentity: userService.identity, token: tokenContent, profileClaims: userService.identity.profileClaims });
        });
    }

    logIn = async () => {
        await this.executeSafe(async () => {
            const { userService } = this.context!;
            await userService.logIn();
            const tokenContent = this.getTokenContent();
            this.setState({ userIdentity: userService.identity, token: tokenContent, profileClaims: userService.identity.profileClaims });
        });
    }

    logOut = async () => {
        await this.executeSafe(async () => {
            const { userService } = this.context!;
            await userService.logOut();
            this.setState({ userIdentity: userService.identity });
        });
    }

    private getTokenContent() {
        try {
            const { userService } = this.context!;
            const accessToken = userService.identity.accessToken;
            const accessTokenParts = accessToken.split('.');
            const accessTokenPayload = JSON.parse(atob(accessTokenParts[1]));

            return accessTokenPayload;
        } catch (error) {
            return null;
        }
    }

    private async executeSafe(action: () => Promise<void>) {
        const { notifications } = this.context!;

        try {
            this.setState({ isBusy: true });

            await action();
        }
        catch (error) {
            notifications.raiseError(error);
        }
        finally {
            this.setState({ isBusy: false });
        }
    }

    render() {
        const { userService } = this.context!;
        const userIdentity = userService.identity;
        const hint = userService.isAuthenticated
            ? this.renderSignedInHint()
            : this.renderSignedOutHint();

        return (
            <div className="card mb-3">
                <div className="card-body">
                    <h5 className="card-title">Hello, <strong>{userIdentity.givenName}</strong>,</h5>

                    {hint}
                </div>
            </div>
        );
    }

    renderSignedInHint() {
        const { isBusy, token, profileClaims } = this.state;

        return (
            <>
                <div className="card-text">
                    <p>
                        These are your access token claims:
                    </p>

                    <div className="mt-2 mb-2 p-1">
                        <ReactJson
                            src={token!}
                            collapsed={true}
                            enableClipboard={false}
                            displayDataTypes={false}
                            displayObjectSize={false} />
                    </div>

                    <p>
                        These are your profile claims:
                    </p>

                    <div className="mt-2 mb-2 p-1">
                        <ReactJson
                            src={profileClaims!}
                            collapsed={true}
                            enableClipboard={false}
                            displayDataTypes={false}
                            displayObjectSize={false} />
                    </div>
                </div>

                <p>
                    To switch accounts you can always log out.
                </p>

                <div className="btn-group">
                    <button type="button" disabled={isBusy} className="btn btn-primary" onClick={this.logOut}>log out</button>
                </div>
            </>
        );
    }

    renderSignedOutHint() {
        const { isBusy } = this.state;

        return (
            <>
                <p className="card-text">
                    You're operating on the task list as an <em>anonymous</em> user.
                    Please login.
                </p>

                <div className="btn-group">
                    <button type="button" disabled={isBusy} className="btn btn-primary" onClick={this.logIn}>log in</button>
                </div>
            </>
        );
    }
}
