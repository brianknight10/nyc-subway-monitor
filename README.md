# NYC Subway Monitor - made with [![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)
Step Functions state machine generator for NYC Subway monitoring.


## How to deploy the state machine

First, install the Serverless Framework and configure your AWS credentials:


```
$ npm install serverless -g
$ serverless config credentials --provider aws --key XXX --secret YYY
```

Now, you can quickly install this service as follows:

```
$ serverless install -u https://github.com/brianknight10/nyc-subway-monitor
```

The Serverless Framework will download and unzip the repository, but it won't install dependencies. Don't forget to install npm dependencies before generating the state machine:

```
$ cd nyc-subway-monitor
$ npm install
```

Then you can generate the dynamic state machine by providing your AWS Account ID. Optionally, you can specify the AWS region and a comma-separated list of strategies:

```
$ npm run generate -- -A ACCOUNT_ID [-R us-east-1]
```

Finally, you can deploy everything:

```
$ serverless deploy
```

## How to execute the state machine

Once the state machine and all the Lambda Functions have been deployed, you will need to execute the state machine.

You will find the new state machine [here](https://console.aws.amazon.com/states/). Enter the state machine named **SubwayMonitorStateMachine** and click "**New execution**".

As soon as you click "**Start Execution**", you'll be able to follow the execution flow on the state machine chart. Here is a sample screenshot:

![state-machine](state-machine-screenshot.png?raw=true)

## State Machine Internals

The AWS Step Functions state machine is composed by two Lambda Functions:

* **retriever**: retrieves NYC subway status from the real-time MTA feed and converts it to JSON
* **sender**: formats and sends the data to InfluxDB

## Contributing
Contributors and PRs are always welcome!

### Tests and coverage

Install dev dependencies with `npm install --dev`. Then run tests with `npm test`, or coverage with `npm run coverage`.