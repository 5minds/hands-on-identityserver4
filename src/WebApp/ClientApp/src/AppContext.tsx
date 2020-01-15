import * as React from "react";
import { ITaskService } from "./services/TaskService";
import { IUserService } from "./services/UserService";
import { INotificationMediator } from "./INotificationMediator";

export interface IAppContext {
    taskService: ITaskService;
    userService: IUserService;
    notifications: INotificationMediator;
}

export const AppContext = React.createContext<IAppContext | null>(null);
export const AppContextProvider = AppContext.Provider;
export const AppContextConsumer = AppContext.Consumer;
