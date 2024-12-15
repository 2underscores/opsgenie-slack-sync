#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { OpsgenieSlackSyncStack } from '../lib/opsgenie-slack-sync-stack.js';
const app = new cdk.App();
new OpsgenieSlackSyncStack(app, 'OpsgenieSlackSyncStack');
