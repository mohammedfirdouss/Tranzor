const { DynamoDBClient, GetItemCommand, UpdateItemCommand } = require('@aws-sdk/client-dynamodb');

const dynamo = new DynamoDBClient();
const TABLE_NAME = process.env.TRANSACTIONS_TABLE_NAME;

exports.handler = async (event) => {
  for (const record of event.Records || []) {
    try {
      const msg = JSON.parse(record.body);
      const { transactionId } = msg;
      console.log('Processing transaction:', transactionId);

      // 1. Fetch transaction from DynamoDB
      const txnRes = await dynamo.send(new GetItemCommand({
        TableName: TABLE_NAME,
        Key: { transactionId: { S: transactionId } }
      }));
      if (!txnRes.Item) {
        console.warn('Transaction not found:', transactionId);
        continue;
      }
      const status = txnRes.Item.status.S;
      if (status !== 'Pending') {
        console.log('Transaction already processed:', transactionId, 'status:', status);
        continue;
      }

      // 2. Simulate fraud check (random approve/decline)
      const fraudScore = Math.random();
      const approved = fraudScore > 0.1; // 90% approve, 10% decline
      const newStatus = approved ? 'Approved' : 'Declined';
      const statusReason = approved ? undefined : 'Fraud Detected (simulated)';

      // 3. Update transaction status in DynamoDB
      const updateParams = {
        TableName: TABLE_NAME,
        Key: { transactionId: { S: transactionId } },
        UpdateExpression: approved
          ? 'SET #status = :s, processedTimestamp = :ts'
          : 'SET #status = :s, statusReason = :r, processedTimestamp = :ts',
        ExpressionAttributeNames: { '#status': 'status' },
        ExpressionAttributeValues: approved
          ? {
              ':s': { S: newStatus },
              ':ts': { S: new Date().toISOString() }
            }
          : {
              ':s': { S: newStatus },
              ':r': { S: statusReason },
              ':ts': { S: new Date().toISOString() }
            },
        ConditionExpression: '#status = :pending',
        ExpressionAttributeValues: {
          ...(approved
            ? {
                ':s': { S: newStatus },
                ':ts': { S: new Date().toISOString() },
                ':pending': { S: 'Pending' }
              }
            : {
                ':s': { S: newStatus },
                ':r': { S: statusReason },
                ':ts': { S: new Date().toISOString() },
                ':pending': { S: 'Pending' }
              })
        }
      };
      await dynamo.send(new UpdateItemCommand(updateParams));
      console.log(`Transaction ${transactionId} processed: ${newStatus}`);
    } catch (err) {
      console.error('Error processing SQS message:', err);
    }
  }
  return {};
}; 