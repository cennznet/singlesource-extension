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

import React from 'react';
import { Provider } from 'react-redux';
import styled from 'styled-components';
import Router from './router';
import store from './store';
import Connect from './pages/connect';
import Dashboard from './pages/dashboard';
import AccountDetails from './pages/account-details';
import Sign from './pages/sign';
import AboutPage from './pages/about';
import TransactionsPage from './pages/transactions';

export const Container = styled.div`
  min-width: 400px;
  min-height: 560px;
  max-width: 400px;
  margin: 0 auto;
  display: flex;
  flex: 1;
`;

const Loading = () => <div>Loading...</div>;

const App = () => (
  <Provider store={store}>
    <Container>
      <Router
        pages={{
          loading: Loading,
          connect: Connect,
          dashboard: Dashboard,
          accountDetails: AccountDetails,
          sign: Sign,
          about: AboutPage,
          transactions: TransactionsPage
        }}
      />
    </Container>
  </Provider>
);

export default App;
