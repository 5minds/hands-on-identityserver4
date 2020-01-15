import * as React from "react";

export interface ITaskListProps {
    children: React.ReactNode;
}

export class TaskList extends React.PureComponent<ITaskListProps> {
    static displayName = TaskList.name;

    render() {
        return (
            <table className="table table-striped table-bordered table-hover">
                <thead>
                    <tr>
                        <th scope="col"></th>
                        <th scope="col">Title</th>
                        <th scope="col">Created By</th>
                        <th scope="col">Updated By</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.children}
                </tbody>
            </table>
        );
    }
}
