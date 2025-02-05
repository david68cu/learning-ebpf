import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Ec2Instance } from './ec2-instance';


export class CdkUbuntu2204ClangStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, {
    ...props,
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION,
    },
  });
  new Ec2Instance(this, 'EC2eBPFDev');
  }
}
