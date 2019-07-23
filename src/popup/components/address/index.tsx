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
  IconButton,
  InputAdornment,
  TextField,
  Tooltip
} from '@material-ui/core';
import CopyIcon from '@material-ui/icons/FileCopy';
import React, { PureComponent } from 'react';
import styled from 'styled-components';

const Row = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

type P = {
  value: string;
};

class Address extends PureComponent<P> {
  onCopyAddress = () => {
    const { value } = this.props;
    // @ts-ignore
    navigator.clipboard.writeText(value);
  };

  render() {
    const { value } = this.props;
    return (
      <Row>
        <TextField
          label="Address"
          variant="outlined"
          style={{ flex: 1 }}
          value={value}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Copy to clipboard">
                  <IconButton onClick={this.onCopyAddress}>
                    <CopyIcon style={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            )
          }}
        />
      </Row>
    );
  }
}

export default Address;
