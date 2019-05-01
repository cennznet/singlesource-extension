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

import { ReplaySubject } from 'rxjs';
import { Api } from '@cennznet/api';
import { WsProvider } from '@cennznet/api/polkadot';

const api$ = new ReplaySubject<Api>(1);

export const configure = (nodeUrl: string) => {
  let provider = new WsProvider(nodeUrl);
  Api.create({ provider }).then(api => api$.next(api));
};

export default api$;
