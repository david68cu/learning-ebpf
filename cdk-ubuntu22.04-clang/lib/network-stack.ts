import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class NetworkStack extends cdk.Stack {

  public readonly vpcId: string;
  public readonly publicSubnetId: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // An Internet Gateway (automatically created and attached for public subnets) because I'm using the ec2.Vpc class
    // NAT Gateway (as specified in your natGateways: 1 parameter)
    // Required route tables and routes

    // ✅ Create VPC with Public and Private Subnets
    const vpc = new ec2.Vpc(this, 'NewVPC', {
   
      maxAzs: 3, // Use up to 3 Availability Zones
      natGateways: 1, // One NAT Gateway for private subnet internet access
      ipAddresses: ec2.IpAddresses.cidr('192.168.100.0/24'), // VPC CIDR block
      subnetConfiguration: [
        {
          cidrMask: 28, // Public subnet size
          name: 'public-subnet',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 28, // Private subnet size
          name: 'private-subnet',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
      ],
    });

    const publicSubnet = vpc.publicSubnets[0];

    // Export the VPC ID and Public Subnet ID
    this.vpcId = vpc.vpcId;
    this.publicSubnetId = publicSubnet.subnetId;

    new cdk.CfnOutput(this, 'VPCId', {
      value: this.vpcId,
      description: 'The ID of the VPC',
      exportName: 'VPCId',
    });

    new cdk.CfnOutput(this, 'PublicSubnetId', {
      value: this.publicSubnetId,
      description: 'The ID of the public subnet',
      exportName: 'PublicSubnetId',
    });

    


  }
}
