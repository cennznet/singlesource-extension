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
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding: 12px;
  box-shadow: 0 2px 6px #eee;
  border: 1px solid #eee;
  border-radius: 5px;
  overflow: hidden;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

export const Column = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
`;

export const Flow = styled.span`
  color: #ccc;
  font-size: 14px;
  font-weight: 400;
  margin-right: 4px;
`;

export const Date = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: #ccc;
  &::before {
    content: '• ';
  }
`;

export const Amount = styled.span`
  font-size: 28px;
  color: #0087fa;
  font-weight: 900;
  overflow: hidden;
  max-width: 200px;
  text-overflow: ellipsis;
`;

export const Asset = styled.span`
  font-size: 15px;
  color: #0087fa;
  font-weight: 400;
  margin-left: 4px;
`;

export const IconContainer = styled.div`
  background-color: #0087fa;
  border-radius: 50%;
  margin-right: 10px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Address = styled.span`
  font-size: 12px;
  color: #aaa;
  font-weight: 400;
  max-width: 200px;
  overflow: hidden;
  letter-spacing: 1.1px;
`;
