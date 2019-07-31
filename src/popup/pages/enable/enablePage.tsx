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

import {
  Button
} from '@material-ui/core';
import React, { PureComponent } from 'react';
import { Container, Subtitle, Title } from './style';

type Props = {
  domain: string;
  onCancel: () => void;
  onEnableOnce: () => void;
  onEnable: (domain: string) => void;
};

class EnablePage extends PureComponent<Props, {}> {

  constructor(props: Props) {
    super(props);
  }

  render() {
    const {domain, onCancel, onEnable, onEnableOnce} = this.props;

    return (
      <Container>
        <Title>Connect Request</Title>
        <Subtitle>
          Domain: {domain}
        </Subtitle>
        <Button onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onEnableOnce} color="primary">
          Enable Once
        </Button>
        <Button onClick={() => onEnable(domain)} color="primary">
          Enable
        </Button>
      </Container>
    );
  }
}

export default EnablePage;
