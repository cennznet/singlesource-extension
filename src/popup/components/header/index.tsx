/**
 * Copyright 2019 Centrality Investments Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IconButton,
  Menu,
  MenuItem,
  Popover,
  Tooltip
} from '@material-ui/core';
import AppsIcon from '@material-ui/icons/Apps';
import SettingsIcon from '@material-ui/icons/Settings';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { networks } from '../../../config';
import types from '../../../shared/actions';
import { Network, NetworkName } from '../../../types';
import { Route } from '../../types/route';
import { State } from '../../types/state';
import getParameter from '../../utils/getParameter';
import { Container, Dot, Section, SelectedNetwork, Title } from './style';

type P = {
  isConnected: boolean;
  route: Route;
  selectedNetwork: Network;
  onAccountDashboard: () => void;
  onDisconnect: () => void;
  onEnvironment: (network: NetworkName) => void;
  openAbout: () => void;
};

type S = {
  settingsOpened: boolean;
  networkOpened: boolean;
};

class Header extends PureComponent<P, S> {
  settingsRef: HTMLElement;
  networkRef: HTMLElement;

  state = {
    settingsOpened: false,
    networkOpened: false
  };

  onClickDashboard = () => {
    this.props.onAccountDashboard();
  };

  onClickSettings = () => {
    this.setState({ settingsOpened: true });
  };

  onCloseSettings = () => {
    this.setState({ settingsOpened: false });
  };

  onClickAbout = () => {
    this.props.openAbout();
    this.setState({ settingsOpened: false });
  };

  onClickDisconnect = () => {
    this.props.onDisconnect();
    this.setState({ settingsOpened: false });
  };

  onClickNetwork = () => {
    this.setState({ networkOpened: true });
  };

  onCloseNetwork = () => {
    this.setState({ networkOpened: false });
  };

  onSelectNetwork = (network: Network) => {
    this.onCloseNetwork();
    const { selectedNetwork, onDisconnect, onEnvironment } = this.props;
    if (network.nodeUrl === selectedNetwork.nodeUrl) return;

    onDisconnect();
    onEnvironment(network.name);
  };

  render() {
    const { isConnected, route, selectedNetwork } = this.props;
    const isDashboard = route.name === 'dashboard';

    const disabled = getParameter('noheader') === 'true';
    const showDashboardIcon = isConnected && !isDashboard && !disabled;
    const showSettingsIcon = isConnected && !disabled;

    return (
      <Container>
        <Section>
          {showDashboardIcon && (
            <Tooltip title="Account dashboard">
              <IconButton
                style={{ color: '#fff' }}
                onClick={this.onClickDashboard}
              >
                <AppsIcon />
              </IconButton>
            </Tooltip>
          )}
        </Section>
        <Section style={{ justifyContent: 'center' }}>
          <SelectedNetwork onClick={!disabled ? this.onClickNetwork : null}>
            <Dot color={selectedNetwork.color} />
            <Title
              ref={ref => {
                this.networkRef = ref;
              }}
            >
              {selectedNetwork.displayName}
            </Title>
          </SelectedNetwork>
          <Popover
            anchorEl={this.networkRef}
            open={this.state.networkOpened}
            onClose={this.onCloseNetwork}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center'
            }}
          >
            {_.map(networks, (network, key) => {
              return (
                <MenuItem
                  key={key}
                  onClick={() => this.onSelectNetwork(network)}
                  selected={network.name === selectedNetwork.name}
                >
                  <Dot color={network.color} />
                  {network.displayName}
                </MenuItem>
              );
            })}
          </Popover>
        </Section>
        <Section style={{ justifyContent: 'flex-end' }}>
          {showSettingsIcon && (
            <Tooltip title="Settings">
              <IconButton
                style={{ color: '#fff' }}
                onClick={this.onClickSettings}
                buttonRef={ref => {
                  this.settingsRef = ref;
                }}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          )}
        </Section>
        {showSettingsIcon && (
          <Menu
            anchorEl={this.settingsRef}
            open={this.state.settingsOpened}
            onClose={this.onCloseSettings}
          >
            <MenuItem onClick={this.onClickAbout}>About</MenuItem>
            <MenuItem
              style={{ color: 'red', fontWeight: 800 }}
              onClick={this.onClickDisconnect}
            >
              Disconnect
            </MenuItem>
          </Menu>
        )}
      </Container>
    );
  }
}

const mapStateToProps = ({ accounts, route, network }: State) => ({
  isConnected: accounts.length > 0,
  route,
  selectedNetwork: _.find(networks, { name: network })
});

const mapDispatchToProps = {
  onAccountDashboard: () => ({ type: types.NAVIGATE, payload: 'dashboard' }),
  onEnvironment: (network: NetworkName) => ({
    type: types.CHANGE_ENVIRONMENT,
    payload: network
  }),
  onDisconnect: () => ({ type: types.DISCONNECT }),
  openAbout: () => ({ type: types.NAVIGATE, payload: 'about' })
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
