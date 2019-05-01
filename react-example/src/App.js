import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import send from './utils/send';
import { configureApi } from './utils/api';
import { decodeAddress } from '@polkadot/keyring';
import BigNumber from 'bignumber.js';
import Transactions from './transactions';
import './index.css';

const getSingleSource = () => {
  return new Promise((resolve, reject) => {
    window.addEventListener('load', () => {
      if (window.SingleSource) {
        resolve(window.SingleSource);
      } else {
        reject(new Error('SingleSource not found!'));
      }
    });
  });
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      receiver: null,
      receiverError: null,
      amount: null,
      amountError: null,
      error: null,
      accounts: null,
      sender: null
    };

    getSingleSource()
      .then(SingleSource => {
        SingleSource.environment$.subscribe(environment => {
          configureApi(environment);
          this.setState({ environment });
        });
        SingleSource.accounts$.subscribe(accounts => {
          const sender = accounts.length > 0 && accounts[0].address;
          this.setState({ accounts, sender });
        });
      })
      .catch(error => {
        this.setState({ error });
      });
  }

  receiverChange = e => {
    const receiver = e.target.value;
    this.setState({ receiver });
    try {
      decodeAddress(receiver);
      this.setState({ receiverError: null });
    } catch (error) {
      this.setState({ receiverError: error });
    }
  };

  amountChange = e => {
    const amount = e.target.value;
    this.setState({ amount });
    try {
      const x = new BigNumber(amount);
      if (x.isNaN() || !x.isFinite() || x.isZero() || x.isNegative()) {
        throw new Error('Invalid amount!');
      }
      this.setState({ amountError: null });
    } catch (error) {
      this.setState({ amountError: error });
    }
  };

  onSelect = e => {
    this.setState({ sender: e.target.value });
  };

  send = () => {
    const { receiver, amount, sender } = this.state;
    try {
      send(sender, receiver, amount, status => {});
    } catch (error) {
      alert(error.message);
    }

    this.setState({
      receiver: null,
      amount: null
    });
  };

  render() {
    const {
      environment,
      sender,
      receiver,
      receiverError,
      amount,
      amountError,
      error,
      accounts,
      loading
    } = this.state;

    if (!accounts && !error) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>{error.message}</div>;
    }

    if (accounts.length === 0) {
      return <div>SingleSourceExtension is not connected</div>;
    }

    const sendDisabled =
      !!receiverError || !!amountError || !receiver || !amount;

    return (
      <div style={{ margin: 20 }}>
        <h1>Donate CENNZ</h1>
        <h4>dApp example using SingleSourceExtension</h4>
        <div>
          <FormControl>
            <InputLabel htmlFor="sender">From Account</InputLabel>
            <Select
              value={sender || ''}
              onChange={this.onSelect}
              inputProps={{
                name: 'sender',
                id: 'sender'
              }}
            >
              {accounts.map(i => (
                <MenuItem key={i.address} value={i.address}>
                  {i.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            required
            value={receiver || ''}
            error={!!receiverError}
            label="To Address"
            onChange={this.receiverChange}
            style={{
              width: 300,
              marginLeft: 10
            }}
          />
          <TextField
            required
            value={amount || ''}
            error={!!amountError}
            type="number"
            label="Amount"
            onChange={this.amountChange}
            style={{
              width: 120,
              marginLeft: 10
            }}
          />
          <Button
            disabled={sendDisabled}
            variant="contained"
            color="primary"
            style={{ margin: 10 }}
            onClick={this.send}
          >
            Send
          </Button>
        </div>
        {environment && sender && (
          <Transactions processing={loading} env={environment} address={sender} assetId={16000} />
        )}
      </div>
    );
  }
}

export default App;
