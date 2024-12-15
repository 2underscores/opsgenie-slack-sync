import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
export class OpsgenieSlackSyncStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // Create Lambda function
        const syncFunction = new lambda.Function(this, 'OpsgenieSlackSyncFunction', {
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: 'index.handler',
            code: lambda.Code.fromAsset(path.join(dirname(fileURLToPath(import.meta.url)), '../'), {
                bundling: {
                    image: lambda.Runtime.NODEJS_18_X.bundlingImage,
                    command: [
                        'bash', '-c',
                        'npm install && npm run build && cp -r dist/* /asset-output/ && cp package*.json /asset-output/'
                    ],
                },
            }),
            timeout: cdk.Duration.minutes(1),
            environment: {
                NODE_OPTIONS: '--enable-source-maps',
                // Add your environment variables here
                // SLACK_TOKEN: process.env.SLACK_TOKEN || '',
                // OPSGENIE_API_KEY: process.env.OPSGENIE_API_KEY || '',
            },
        });
        // Create EventBridge rule to trigger Lambda every minute
        const rule = new events.Rule(this, 'ScheduleRule', {
            schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
        });
        // Add Lambda as target for the EventBridge rule
        rule.addTarget(new targets.LambdaFunction(syncFunction));
    }
}
