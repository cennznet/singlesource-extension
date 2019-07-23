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

import { fromEvent, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import logger from '../logger';
import { MultiplexWindowMessageDuplex } from '../streamUtils/MultiplexWindowMessageDuplex';
import { MessageOrigin, ToPageMessages } from '../types';

export const inpageBgDuplexStream = new MultiplexWindowMessageDuplex(window, MessageOrigin.PAGE, MessageOrigin.CONTENT);

const messenger$: Observable<ToPageMessages> = fromEvent<ToPageMessages>(inpageBgDuplexStream, 'data').pipe(
  tap(event => {
    logger.debug('injected:', event);
  }),
  // map(event => event.payload)
);

// export function filterResponse(message: ToPageMessages, uuid: string) {
//   return message['requestUUID'] && message['requestUUID'] === uuid;
// }

export default messenger$;
