import * as React from "react";

export interface ITaskItemProps {
    taskId: string;
    title: string;
    isCompleted: boolean;
    createdBy: string;
    updatedBy: string;
    requestToggleTaskCompletion: (taskId: string) => Promise<void>;
}

export class TaskItem extends React.PureComponent<ITaskItemProps> {
    static displayName = TaskItem.name;

    render() {
        const { taskId, title, isCompleted, createdBy, updatedBy, requestToggleTaskCompletion } = this.props;

        return (
            <tr>
                <th scope="row">
                    <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={() => requestToggleTaskCompletion(taskId)} />
                </th>
                <td>{title}</td>
                <td>{createdBy}</td>
                <td>{updatedBy}</td>
            </tr>
        );
    }
}
