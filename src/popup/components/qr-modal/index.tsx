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

import { Dialog, Paper } from '@material-ui/core';
import QRCode from 'qrcode.react';
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  padding: 20px;
`;

type P = {
  open: boolean;
  data: string;
  onClose: () => void;
};

const QRModal = ({ open, data, onClose }: P) => (
  <Dialog open={open} onClose={onClose}>
    <Paper elevation={3}>
      <Container>
        <Content>
          <QRCode size={200} level="H" value={data} />
        </Content>
      </Container>
    </Paper>
  </Dialog>
);

export default QRModal;
