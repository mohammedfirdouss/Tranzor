const { DynamoDBClient, GetItemCommand } = require('@aws-sdk/client-dynamodb');

const dynamo = new DynamoDBClient();
const TABLE_NAME = process.env.TRANSACTIONS_TABLE_NAME;

exports.handler = async (event) => {
  const transactionId = event.pathParameters && event.pathParameters.transactionId;
  if (!transactionId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing transactionId in path' })
    };
  }
  try {
    const res = await dynamo.send(new GetItemCommand({
      TableName: TABLE_NAME,
      Key: { transactionId: { S: transactionId } }
    }));
    if (!res.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Transaction not found' })
      };
    }
    // Convert DynamoDB item to plain JS object
    const item = {};
    for (const [k, v] of Object.entries(res.Item)) {
      if (v.S !== undefined) item[k] = v.S;
      else if (v.N !== undefined) item[k] = Number(v.N);
      else if (v.M !== undefined) item[k] = Object.fromEntries(Object.entries(v.M).map(([kk, vv]) => [kk, vv.S || vv.N || vv.BOOL || vv.NULL]));
      else if (v.BOOL !== undefined) item[k] = v.BOOL;
      else if (v.NULL !== undefined) item[k] = null;
      else item[k] = v;
    }
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    };
  } catch (err) {
    console.error('Error fetching transaction:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
}; 