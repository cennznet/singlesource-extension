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

import styled from 'styled-components';

export const Container = styled.div`
  margin: 10px 0;
`;

export const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 15px;
  box-shadow: 0 2px 6px #eee;
  border: 1px solid #eee;
  border-radius: 5px;
  cursor: pointer;
`;

export const Name = styled.span`
  font-size: 18px;
  color: #333;
  font-weight: 500;
`;

export const Address = styled.span`
  font-size: 10px;
  color: #aaa;
  margin: 4px 0;
`;

export const Assets = styled.span`
  font-size: 12px;
  color: #999;
`;
