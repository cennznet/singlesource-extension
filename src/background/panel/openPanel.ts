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

import queryString from 'query-string';
import { browser } from 'webextension-polyfill-ts';

export type Param = {
  noheader: boolean;
  pageName: string;
  [key: string]: string|number|boolean;
};

export default (param: Param) => {
  const paramQuery = queryString.stringify(param);
  const url = browser.extension.getURL(`index.html?${paramQuery}`);
  browser.windows.create({
    url,
    type: 'panel',
    width: 400,
    height: 600,
    top: 200,
    left: 500
  });
};
