const { DynamoDBClient, TransactWriteItemsCommand } = require('@aws-sdk/client-dynamodb');
const { v4: uuidv4 } = require('uuid');
const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');

const dynamo = new DynamoDBClient();
const sqs = new SQSClient();
const TABLE_NAME = process.env.TRANSACTIONS_TABLE_NAME;
const QUEUE_URL = process.env.TRANSACTION_QUEUE_URL;

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const required = ['referenceId', 'senderAccountId', 'receiverAccountId', 'amount', 'transactionType'];
    for (const field of required) {
      if (!(field in body)) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: `Missing required field: ${field}` })
        };
      }
    }
    if (typeof body.amount !== 'object' || !('value' in body.amount) || !('currency' in body.amount)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid amount structure' })
      };
    }

    const transactionId = uuidv4();
    const now = new Date().toISOString();

    // Prepare two items: one for sender, one for receiver
    const baseItem = {
      transactionId: { S: transactionId },
      referenceId: { S: String(body.referenceId) },
      amount: { M: {
        value: { S: String(body.amount.value) },
        currency: { S: String(body.amount.currency) }
      }},
      transactionType: { S: String(body.transactionType) },
      status: { S: 'Pending' },
      receivedTimestamp: { S: now },
      updatedAt: { S: now }
    };
    if (body.metadata) {
      baseItem.metadata = { S: JSON.stringify(body.metadata) };
    }

    const senderItem = {
      ...baseItem,
      senderAccountId: { S: String(body.senderAccountId) },
      receiverAccountId: { S: String(body.receiverAccountId) },
      accountId: { S: String(body.senderAccountId) }
    };
    const receiverItem = {
      ...baseItem,
      senderAccountId: { S: String(body.senderAccountId) },
      receiverAccountId: { S: String(body.receiverAccountId) },
      accountId: { S: String(body.receiverAccountId) }
    };

    // Use TransactWriteItems for atomicity
    await dynamo.send(new TransactWriteItemsCommand({
      TransactItems: [
        {
          Put: {
            TableName: TABLE_NAME,
            Item: senderItem,
            ConditionExpression: 'attribute_not_exists(transactionId) AND attribute_not_exists(accountId)'
          }
        },
        {
          Put: {
            TableName: TABLE_NAME,
            Item: receiverItem,
            ConditionExpression: 'attribute_not_exists(transactionId) AND attribute_not_exists(accountId)'
          }
        }
      ]
    }));

    // Send message to SQS for async processing (only need to send once)
    const sqsMsg = {
      transactionId,
      senderAccountId: body.senderAccountId,
      receiverAccountId: body.receiverAccountId,
      amount: body.amount,
      transactionType: body.transactionType
    };
    await sqs.send(new SendMessageCommand({
      QueueUrl: QUEUE_URL,
      MessageBody: JSON.stringify(sqsMsg)
    }));

    return {
      statusCode: 202,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transactionId,
        status: 'Pending',
        receivedTimestamp: now
      })
    };
  } catch (err) {
    console.error('Error processing transaction:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
}; 