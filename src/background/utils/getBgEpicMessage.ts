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

import { empty, Observable, of } from "rxjs";

import { BgEpicMessage, MessageOrigin, ToBgMessage } from "../../types";
import {EpicMessageOrigin} from '../../types/message';

export const getBgEpicMessage = (toBgMessage: ToBgMessage): Observable<BgEpicMessage> => {
  if (toBgMessage.origin.startsWith(MessageOrigin.BG)) {
    return of({
      type: EpicMessageOrigin.BG,
      payload: toBgMessage
    });
  } else if (toBgMessage.origin.startsWith(MessageOrigin.CONTENT)) {
    return of({
      type: EpicMessageOrigin.CONTENT,
      payload: toBgMessage
    });
  } else if (toBgMessage.origin.startsWith(MessageOrigin.PAGE)) {
    return of({
      type: EpicMessageOrigin.PAGE,
      payload: toBgMessage
    });
  } else if (
    toBgMessage.origin.startsWith(MessageOrigin.ENABLE_POPUP) ||
    toBgMessage.origin.startsWith(MessageOrigin.SIGN_POPUP) ||
    toBgMessage.origin.startsWith(MessageOrigin.TOOLBAR)
  ) {
    return of({
      type: EpicMessageOrigin.POPUP,
      payload: toBgMessage
    });
  } else {
    console.error('Invalid MessageOrigin: ', toBgMessage.origin);
    return empty();
  }
}
