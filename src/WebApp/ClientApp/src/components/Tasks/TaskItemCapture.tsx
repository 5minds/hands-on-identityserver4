import * as React from "react";
import { AppContext } from "../../AppContext";

export interface ITaskItemCaptureProps {
    isBusy: boolean;
    requestAddTask: (newTaskTitle: string) => Promise<void>;
}

interface ITaskItemCaptureState {
    newTaskTitle: string;
    canAdd: boolean;
}

export class TaskItemCapture extends React.Component<ITaskItemCaptureProps, ITaskItemCaptureState> {
    static displayName = TaskItemCapture.name;
    static contextType = AppContext;
    context!: React.ContextType<typeof AppContext>;
    private readonly textInputRef: React.RefObject<HTMLInputElement>;

    constructor(props) {
        super(props);
        this.state = { newTaskTitle: "", canAdd: false };
        this.textInputRef = React.createRef<HTMLInputElement>();
    }

    componentDidMount() {
        this.focusTextInput();
    }

    private focusTextInput = () => {
        const textInput = this.textInputRef.current!;
        textInput.focus();
    }

    private addItem = async () => {
        const { newTaskTitle } = this.state;
        const { requestAddTask } = this.props;

        await requestAddTask(newTaskTitle);

        this.setState({ newTaskTitle: "", canAdd: false });

        this.focusTextInput();
    };

    private handleKeyUpOnInput = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        const { isBusy } = this.props;

        if (isBusy || event.key !== "Enter") {
            return;
        }

        event.preventDefault();
        
        await this.addItem();
    };

    private updateNewTaskTitle = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const title = event.target.value;
        const canAdd = (title !== null && title !== undefined && 0 !== title.length);
        this.setState({ newTaskTitle: title, canAdd: canAdd });
    };

    render() {
        const { isBusy } = this.props;
        const { newTaskTitle, canAdd } = this.state;

        return (
            <div className="input-group mb-3">
                <input
                    ref={this.textInputRef}
                    type="text"
                    className="form-control"
                    placeholder="Describe the thing..."
                    onChange={this.updateNewTaskTitle}
                    onKeyPress={this.handleKeyUpOnInput}
                    disabled={isBusy}
                    value={newTaskTitle} />

                <div className="input-group-append">
                    <button
                        className="btn btn-primary"
                        type="button"
                        disabled={!canAdd || isBusy}
                        onClick={this.addItem}>add</button>
                </div>
            </div>
        );
    }
}
