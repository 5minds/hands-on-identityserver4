import * as React from "react";
import { AppContext } from "../AppContext"

export interface IResetTaskListCardProps {
    requestResetTaskList: () => Promise<void>;
}

interface IResetTaskListCardState {
    isBusy: boolean;
}

export class ResetTaskListCard extends React.Component<IResetTaskListCardProps, IResetTaskListCardState> {
    static displayName = ResetTaskListCard.name;
    static contextType = AppContext;
    context!: React.ContextType<typeof AppContext>;

    constructor(props) {
        super(props);
        this.state = { isBusy: false };
    }

    private resetTasks = async () => {
        const { requestResetTaskList } = this.props;

        try {
            this.setState({ isBusy: true });

            await requestResetTaskList();
        }
        finally {
            this.setState({ isBusy: false });
        }
    }

    render() {
        const { isBusy } = this.state;

        return (
            <div className="card mb-3">
                <div className="card-body">
                    <h5 className="card-title">Messed up?</h5>

                    <p className="card-text">
                        You can restore the initial set of tasks and undo all your changes.
                    </p>

                    <button
                        className="btn btn-danger"
                        type="button"
                        disabled={isBusy}
                        onClick={this.resetTasks}>reset changes</button>
                </div>
            </div>
        );
    }
}
