import * as React from "react";
import { Toast as ToastFromBootstrap, ToastHeader as ToastHeaderFromBootstrap, ToastBody as ToastBodyFromBootstrap } from "reactstrap"
import { ToastSeverity } from "./ToastSeverity"
import { ToastNotification } from "./ToastNotification"

export interface IToastProps {
    notification: ToastNotification;
}

export class Toast extends React.Component<IToastProps> {
    static displayName = Toast.name;

    render() {
        const { title, message, severity } = this.props.notification;
        const iconType = this.convertNotificationSeverityToIconClass(severity);

        return (
            <ToastFromBootstrap>
                <ToastHeaderFromBootstrap icon={iconType}>
                    {title}
                </ToastHeaderFromBootstrap>

                <ToastBodyFromBootstrap>
                    {message}
                </ToastBodyFromBootstrap>
            </ToastFromBootstrap>
        );
    }

    private convertNotificationSeverityToIconClass(severity: ToastSeverity) {
        if (severity === ToastSeverity.Error) {
            return "danger";
        }

        if (severity === ToastSeverity.Warning) {
            return "warning";
        }

        if (severity === ToastSeverity.Success) {
            return "success";
        }

        throw new Error("Severity is not supported.");
    }
}
