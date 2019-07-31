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

import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import actions from '../../../shared/actions';
import {State} from '../../types/state';
import EnablePage from './enablePage';

const mapStateToProps = ({enable}: State) => ({
  domain: enable.domain
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onCancel: () => dispatch({type: actions.ENABLE.REJECT}),
  onEnableOnce: () => dispatch({type: actions.ENABLE.ONCE}),
  onEnable: (domain: string) => dispatch({type: actions.ENABLE.PERMANENT})
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EnablePage);
