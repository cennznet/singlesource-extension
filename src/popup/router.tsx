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

import React, { PureComponent, ComponentClass } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import styled from 'styled-components';
import Header from './components/header';
import Footer from './components/footer';
import { State } from './types/state';
import { Route } from './types/route';

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  width: 100%;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

type Props = {
  route: Route;
  isConnected: boolean;
  pages: { [key: string]: ComponentClass | any };
};

class Router extends PureComponent<Props> {
  render() {
    const {
      route: { name, params },
      isConnected,
      pages
    } = this.props;
    const Page = _.get(pages, name);
    if (process.env.NODE_ENV === 'development') {
      console.assert(Page, `${name} page cannot be found!`);
    }
    return (
      <Container style={{ marginBottom: isConnected ? '60px' : 0 }}>
        <Content>
          <Header />
          {Page && <Page params={params} />}
        </Content>
        {isConnected && <Footer />}
      </Container>
    );
  }
}

const mapStateToProps = ({ route, accounts }: State) => ({
  route,
  isConnected: accounts.length > 0
});

export default connect(mapStateToProps)(Router);
