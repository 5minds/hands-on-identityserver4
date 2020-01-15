import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "font-awesome/css/font-awesome.min.css";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import App from "./App";
import { UserService } from "./services/UserService"
import registerServiceWorker from "./registerServiceWorker";

const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href") || undefined;
const rootElement = document.getElementById("root");

document.title = "My Tasks";

ReactDOM.render(
    <BrowserRouter basename={baseUrl}>
        <Switch>
            <Route path="/signin-callback" component={onSignInCallback} />
            <Route path="/silent-renew" component={onSilentRenewCallback} />
            <Route path="/" component={onDefaultSite} />
        </Switch>
    </BrowserRouter>,
    rootElement);

function onDefaultSite() {
    return <App />;
}

function onSignInCallback() {
    UserService.handleSignIn();
    return null;
}

function onSilentRenewCallback() {
    UserService.handleSilentRenew();
    return null;
}

registerServiceWorker();
