#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { MyLambdaStack } from "./lambdaStack.js";

const app = new cdk.App();
new MyLambdaStack(app, "MyLambdaStack");