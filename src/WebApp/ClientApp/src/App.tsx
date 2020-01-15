import * as React from "react";
import { TaskListController } from "./components/Tasks/TaskListController";
import { SidePanel } from "./components/SidePanel";
import { UserCard } from "./components/UserCard";
import { ResetTaskListCard } from "./components/ResetTaskListCard";
import { ToastHost } from "./components/Toasts/ToastHost";
import { TaskService } from "./services/TaskService";
import { UserService } from "./services/UserService";
import { INotificationMediator } from "./INotificationMediator";
import { IAppContext, AppContextProvider } from "./AppContext"

export default class App extends React.Component<{}> implements INotificationMediator {
    static displayName = App.name;

    private readonly appContext: IAppContext;
    private readonly taskListControllerRef: React.RefObject<TaskListController>;
    private readonly toastNotificationHandlerRef: React.RefObject<ToastHost>;

    constructor(props) {
        super(props);

        this.appContext = this.createAppContext();
        this.taskListControllerRef = React.createRef<TaskListController>();
        this.toastNotificationHandlerRef = React.createRef<ToastHost>();
    }

    private createAppContext(): IAppContext {
        const userService = new UserService();
        const taskService = new TaskService(userService);

        const appContext: IAppContext = {
            taskService: taskService,
            userService: userService,
            notifications: this
        }

        return appContext;
    }

    private resetTaskList = async () => {
        const taskListController = this.taskListControllerRef.current!;
        await taskListController.resetTaskList();
    }

    raiseError = async (error: Error) => {
        const toastNotificationHandler = this.toastNotificationHandlerRef.current!;
        await toastNotificationHandler.raiseError(error);
    }

    raiseSuccess = async (text: string) => {
        const toastNotificationHandler = this.toastNotificationHandlerRef.current!;
        await toastNotificationHandler.raiseSuccess(text);
    }

    render() {
        return (
            <AppContextProvider value={this.appContext}>
                <div className="container">
                    <div className="row mt-3">
                        <main role="main" className="col-8 mt-3">
                            <TaskListController
                                ref={this.taskListControllerRef} />
                        </main>

                        <aside className="col-4 mt-3">
                            <SidePanel>
                                <UserCard />

                                <ResetTaskListCard
                                    requestResetTaskList={this.resetTaskList} />
                            </SidePanel>
                        </aside>
                    </div>

                    <ToastHost
                        ref={this.toastNotificationHandlerRef} />
                </div>
            </AppContextProvider>
        );
    }
}
