import * as React from "react";

export interface ISidePanelProps {
    children: React.ReactNode;
}

export class SidePanel extends React.PureComponent<ISidePanelProps> {
    static displayName = SidePanel.name;

    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}
