import { ToastSeverity } from "./ToastSeverity"

export class ToastNotification {
    private timeToShow: number;

    constructor(title: string, message: string, severity: ToastSeverity) {
        this.title = title;
        this.message = message;
        this.severity = severity;
        this.timeToShow = 5;
    }

    readonly title: string;
    readonly message: string;
    readonly severity: ToastSeverity;
    
    decreaseTimeToShow() {
        if (this.timeToShow > 0) {
            this.timeToShow = this.timeToShow - 1;
        }
    }

    get hasExpired(): boolean {
        return this.timeToShow <= 0;
    }
}
