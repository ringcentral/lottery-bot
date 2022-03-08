import DynamoDbLocal from 'dynamodb-local'

const dynamoLocalPort = process.env.DYNAMO_PORT || 8000

async function init () {
  console.log('Starting dynamodb server, please wait, do not quit')
  await DynamoDbLocal.launch(
    dynamoLocalPort, null, [], false, true
  )
  console.log('local dynamdb started at port:', dynamoLocalPort)
}

init()
