import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import glamorous from "glamorous";
import { css } from 'glamor';

import ViewLayout from 'components/ViewLayout';
import ControlPanel from '../Main/components/system/ControlPanel';
import CbtLayout from "../../shared/components/CbtLayout";
import { Button, TextField } from '@material-ui/core'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';


@inject("store")
@observer
export default class SituationScreen extends Component {
    constructor(props) {
        super(props);
        this.props.store.view.openSituationsPage();
        this.state = {
            sessionId: ''
        }
        console.log("props", props);
    }


    render() {
        const theme = createMuiTheme({
            palette: {
                primary: {
                    main: '#2196F3'
                },
                secondary: green,
            },
            status: {
                danger: 'orange',
            },
        });

        return (
            <MuiThemeProvider theme={theme}>
                <TextField value={this.state.sessionId} onChange={(e) => { this.setState({ sessionId: e.target.value }) }} label="test" />
                <Button onClick={() => {
                    debugger;
                    let { store } = this.props;
                    let { sessionModalStore, sessionsManagementStore, view, sessionsStore } = store;
                    sessionsStore.startSession(this.state.sessionId)
                    sessionsStore.
                }}>test</Button>
                <CbtLayout
                    page={this.props.store.view.page}
                    situations={this.props.store.SituationManageStore.items}
                    {...this.props}
                />
            </MuiThemeProvider>
        )
    }
}
