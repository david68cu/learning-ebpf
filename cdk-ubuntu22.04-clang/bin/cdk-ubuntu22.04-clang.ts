#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkUbuntu2204ClangStack } from '../lib/cdk-ubuntu22.04-clang-stack';
import { NetworkStack } from '../lib/network-stack';

const app = new cdk.App();
new NetworkStack(app, 'NetworkStack');
new CdkUbuntu2204ClangStack(app, 'CdkUbuntu2204ClangStack');