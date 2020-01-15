import * as React from "react";
import { Toast } from "./Toast"
import { ToastNotification } from "./ToastNotification"
import { ToastSeverity } from "./ToastSeverity";

interface IToastHostState {
    notifications: ToastNotification[];
}

export class ToastHost extends React.Component<{}, IToastHostState> {
    static displayName = ToastHost.name;
    private timeoutHandle: number | undefined;

    constructor(props) {
        super(props);
        this.state = { notifications: [] };
    }

    componentDidMount() {
        this.timeoutHandle = window.setInterval(() => this.updateToasts(), 1000);
    }

    componentWillUnmount() {
        window.clearInterval(this.timeoutHandle);
    }

    raiseError(error: Error): void {
        const { notifications } = this.state;

        const notification = new ToastNotification(
            "An error occurred",
            error.message,
            ToastSeverity.Error);

        notifications.push(notification);
        console.error(notification.message);

        this.setState({ notifications: notifications });
    }

    raiseSuccess(text: string): void {
        const { notifications } = this.state;

        const notification = new ToastNotification(
            "Success",
            text,
            ToastSeverity.Success);

        notifications.push(notification);
        console.log(notification.message);

        this.setState({ notifications: notifications });
    }

    private updateToasts() {
        const { notifications } = this.state;

        for (const notification of notifications) {
            notification.decreaseTimeToShow();
        }

        const remainingNotifications = notifications.filter(notification => !notification.hasExpired);
        this.setState({ notifications: remainingNotifications });
    }

    render() {
        const { notifications } = this.state;

        return (
            <div style={{ position: "absolute", right: "30px", bottom: "30px", width: "350px" }}>
                {notifications.map((notification, index) => (
                    <Toast
                        key={`Toast_${index}`}
                        notification={notification}
                    />))}
            </div>
        );
    }
}