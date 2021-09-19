import { Handler } from '@netlify/functions';
import { MongoClient } from 'mongodb';
import { BigNumber } from 'bignumber.js';
require('dotenv').config({ path: '.env' });

type Contribution = {
  account: string;
  amount: string;
};

type Response = {
  body: string;
  statusCode: number;
};

const { MONGO_DB_URI } = process.env;

const mongoDBClient = new MongoClient(MONGO_DB_URI);

const handler: Handler = async (event): Promise<Response> => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: 'Method not allowed. Use GET.',
    };
  }
  await mongoDBClient.connect();

  const database = mongoDBClient.db('altair-contributions');

  const contributionCollection = database.collection('contributions');

  const timestampCollection = database.collection('timestamp');

  const contributions = await contributionCollection
    .find({})
    .project({ _id: 0 })
    .toArray();

  const timestamp = await timestampCollection
    .find({})
    .project({ _id: 0 })
    .toArray();

  const distinctContributions = contributions.reduce((acc, cur) => {
    if (acc[cur.account]) {
      acc[cur.account] = {
        ...acc[cur.account],
        amount: new BigNumber(acc[cur.account].amount)
          .plus(cur.amount)
          .toString(),
        numberOfContributions: acc[cur.account].numberOfContributions + 1,
      };
    } else {
      acc[cur.account] = {
        account: cur.account,
        amount: cur.amount,
        numberOfContributions: 1,
      };
    }

    return acc;
  }, {});

  const orderedContributions = Object.values(distinctContributions).map(
    contribution => contribution,
  );

  orderedContributions.sort((a: Contribution, b: Contribution) => {
    if (new BigNumber(a.amount).isGreaterThan(new BigNumber(b.amount))) {
      return -1;
    }
    if (new BigNumber(a.amount).isLessThan(new BigNumber(b.amount))) {
      return 1;
    }
    return 0;
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      contributions: orderedContributions,
      timestamp: timestamp[0].timestamp,
    }),
  };
};

export { handler };
