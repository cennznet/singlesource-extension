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
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin: 15px;
  align-items: flex-start;
`;

export const Title = styled.span`
  font-size: 20px;
  color: #000;
  font-weight: 700;
`;

export const Items = styled.div`
  align-self: stretch;
`;

export const Row = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  flex: 1;
`;
