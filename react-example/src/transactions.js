import React, { PureComponent } from 'react';
import _ from 'lodash';
import getTransactions from './getTransactions';
import { weiToAmount } from './utils/amount';

class Transactions extends PureComponent {
  state = {
    transactions: []
  };

  componentDidMount() {
    this.fetchTransactions(this.props);
    setInterval(() => {
      this.fetchTransactions(this.props);
    }, 10000);
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props, nextProps)) {
      this.fetchTransactions(nextProps);
    }
  }

  fetchTransactions(props) {
    const { env, address, assetId } = props;
    getTransactions(env, address, assetId).then(transactions => {
      this.setState({ transactions });
    });
  }

  render() {
    const { transactions } = this.state;
    if (transactions.length === 0) return null;
    return (
      <div>
        <h2 style={{ marginBottom: 0 }}>Transactions:</h2>
        <table>
          <thead>
            <tr>
              <th />
              <th>Address</th>
              <th />
              <th>Amount</th>
              <th>Status</th>
              <th>Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((i, index) => (
              <tr key={i.hash}>
                <th>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://uncoverexplorer.com/tx/${i.hash}`}
                  >
                    View on UNcover
                  </a>
                </th>
                <th style={{ margin: 10 }}>
                  {i.transactionFlow === 'Outgoing'
                    ? i.toAddress
                    : i.fromAddress}
                </th>
                <th style={{ margin: 10 }}>{i.transactionFlow}</th>
                <th style={{ margin: 10, color: '#0087fa' }}>
                  {weiToAmount(i.value).toFormat()} CENNZ
                </th>
                <th>{i.status ? 'Complete' : 'Failed'}</th>
                <th>{new Date(i.timestamp * 1000).toLocaleString()}</th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Transactions;
