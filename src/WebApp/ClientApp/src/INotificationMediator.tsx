export interface INotificationMediator {
    raiseSuccess(text: string): void;
    raiseError(error: Error): void;
}