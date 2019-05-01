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
  display: flex;
  flex: 1;
`;

export const Content = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  flex-direction: row;
  padding: 12px;
  box-shadow: 0 2px 6px #eee;
  border: 1px solid #eee;
  border-radius: 5px;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
`;

export const Column = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
`;

export const Balance = styled.span`
  font-size: 28px;
  color: #0087fa;
  font-weight: 900;
  overflow: scroll;
  max-width: 280px;
`;

export const Asset = styled.span`
  font-size: 15px;
  color: #0087fa;
  font-weight: 400;
`;

export const Icon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  background-color: #0087fa;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
`;
