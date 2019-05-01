import _ from 'lodash';

const baseUrl = env => `https://internal-api-${env}.uncoverexplorer.com/v1`;

const transactionUrl = (env, address, assetId) =>
  `${baseUrl(env)}/addresses/${address}/transactions?asset_id=${assetId}`;

const getTransactions = (env, address, assetId) => {
  const url = transactionUrl(env, address, assetId);
  return fetch(url).then(response => response.json()).then((data) => {
    return _.get(data, 'result', []);
  });
};

export default getTransactions;