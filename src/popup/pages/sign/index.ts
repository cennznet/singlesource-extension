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

import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import SignPage from './signPage';
import types from '../../types';
import { State } from '../../types/state';

const mapStateToProps = ({ sign, environment }: State) => ({
  sign,
  environment
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onSignComplete: (requestUUID: string, hexSignature: string) =>
    dispatch({
      type: types.SIGN.SUCCESS,
      payload: { requestUUID, hexSignature }
    }),
  onSignFail: (requestUUID: string, error: Error) =>
    dispatch({ type: types.SIGN.FAIL, payload: { requestUUID, error } })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignPage);
