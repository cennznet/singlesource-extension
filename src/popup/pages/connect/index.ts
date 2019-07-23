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

import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import ConnectPage from './connectPage';
import types from '../../../shared/actions';
import { Account } from '../../../types';
import { State } from '../../types/state';

const mapStateToProps = ({ network }: State) => ({
  network
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onConnect: (accounts: Account[]) => {
    dispatch({ type: types.CONNECT, payload: accounts });
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectPage);
