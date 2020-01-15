import * as React from "react";
import { TaskItemCapture } from "./TaskItemCapture";
import { TaskList } from "./TaskList";
import { TaskItem } from "./TaskItem";
import { ITaskItem } from "../../services/TaskService";
import { AppContext } from "../../AppContext";

export interface ITaskListControllerProps {
}

export interface ITaskListControllerState {
    tasks: ITaskItem[];
    isBusyLoading: boolean;
    isBusyAdding: boolean;
}

export class TaskListController extends React.Component<ITaskListControllerProps, ITaskListControllerState> {
    static displayName = TaskListController.name;
    static contextType = AppContext;
    context!: React.ContextType<typeof AppContext>;
    private timeoutHandle: number | undefined;

    constructor(props) {
        super(props);
        this.state = { tasks: [], isBusyLoading: true, isBusyAdding: false };
    }

    componentDidMount() {
        this.loadTaskList();
    }

    loadTaskList = async () => {
        const { taskService, notifications } = this.context!;

        try {
            this.markBusy();

            const tasks = await taskService.getMyTasks();

            notifications.raiseSuccess(`Task list has been updated.`);
            this.setState({ tasks: tasks });
        } catch (error) {
            notifications.raiseError(error);
            this.setState({ isBusyLoading: false });
        } finally {
            this.markIdle();
        }
    }

    private markBusy() {
        this.timeoutHandle = window.setTimeout(() => {
            this.setState({ isBusyLoading: true });
        }, 150);
    }

    private markIdle() {

        window.clearTimeout(this.timeoutHandle);
        this.setState({ isBusyLoading: false });
    }

    resetTaskList = async () => {
        const { taskService, notifications } = this.context!;

        try {
            this.markBusy();

            const tasks = await taskService.resetMyTasks();

            notifications.raiseSuccess(`Task list has been reset.`);
            this.setState({ tasks: tasks });
        }
        catch (error) {
            notifications.raiseError(error);
        } finally {
            this.markIdle();
        }
    }

    addTask = async (newTaskTitle: string) => {
        const { taskService, notifications } = this.context!;
        const { tasks } = this.state;

        try {
            this.setState({ isBusyAdding: true });

            const newTask = await taskService.addTask(newTaskTitle);

            notifications.raiseSuccess(`Task has been added.`);
            this.setState({ tasks: [...tasks, newTask], isBusyAdding: false });
        }
        catch (error) {
            notifications.raiseError(error);
            this.setState({ isBusyAdding: false });
        }
    }

    toggleTaskCompletion = async (taskId: string) => {
        const { taskService, notifications } = this.context!;
        const { tasks } = this.state;

        try {
            const matchingTask = tasks.find(task => task.id === taskId)!;

            const wasCompleted = matchingTask.isCompleted;
            const desiredIsCompleted = !wasCompleted;

            const updatedTaskItem = wasCompleted
                ? await taskService.markTaskAsOpen(taskId)
                : await taskService.markTaskAsCompleted(taskId);

            Object.assign(matchingTask, updatedTaskItem);

            notifications.raiseSuccess(`Task has been ${desiredIsCompleted ? "completed" : "opened"}.`);
            this.setState({ tasks: tasks });
        }
        catch (error) {
            notifications.raiseError(error);
        }
    }

    render() {
        const { tasks, isBusyLoading, isBusyAdding } = this.state;

        if (isBusyLoading) {
            return (
                <div className="alert alert-secondary" role="alert">
                    <span className="fa mr-3">
                        <i className="fa fa-cog fa-spin"></i>
                    </span>

                    Loading...
                </div>
            );
        }

        return (
            <>
                <TaskItemCapture
                    requestAddTask={this.addTask}
                    isBusy={isBusyAdding} />

                <TaskList>
                    {tasks.map(task => (
                        <TaskItem
                            key={task.id}
                            taskId={task.id}
                            title={task.title}
                            isCompleted={task.isCompleted}
                            createdBy={task.createdBy}
                            updatedBy={task.updatedBy}
                            requestToggleTaskCompletion={this.toggleTaskCompletion} />
                    ))}
                </TaskList>
            </>
        );
    }
}