import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import { Construct } from "constructs";
import * as path from "path";
import { fileURLToPath } from "url";

export class MyLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const myFunction = new lambda.Function(this, "MyFunction", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "dist/index.handler",  // Update handler path to point to compiled code
      code: lambda.Code.fromAsset(path.join(path.dirname(fileURLToPath(import.meta.url)), "../"), {
        bundling: {
          image: lambda.Runtime.NODEJS_18_X.bundlingImage,
          command: [
            "bash",
            "-c",
            [
              "npm ci",  // Use ci instead of install
              "npm run build",  // Build TypeScript files
              "cp -r dist/ package*.json node_modules/ /asset-output/",  // Copy only what's needed
            ].join(" && "),
          ],
        },
        exclude: [
          "cdk.out",
          ".git",
          "infra",
          "README_img",
          "README.md",
          ".env",
        ],
      }),
      environment: {
        NODE_OPTIONS: "--enable-source-maps",
      },
    });

    const rule = new events.Rule(this, "MyRule", {
      schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
    });

    rule.addTarget(new targets.LambdaFunction(myFunction));
  }
}