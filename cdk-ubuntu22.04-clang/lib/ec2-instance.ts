import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class Ec2Instance extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

       // Import the VPC ID and Public Subnet ID from the network stack
       const vpcId = cdk.Fn.importValue('VPCId');
       const publicSubnetId = cdk.Fn.importValue('PublicSubnetId');
   
       // Import the existing VPC
      //  const vpc = ec2.Vpc.fromLookup(this, 'ExistingVPC', { vpcId });
       const vpc = ec2.Vpc.fromVpcAttributes(this, 'ExistingVPC', {
        vpcId: vpcId,
        availabilityZones: ['us-east-1a', 'us-east-1b', 'us-east-1c'], // Replace with your VPC's availability zones
      });
   
       // Import the existing public subnet
       const publicSubnet = ec2.Subnet.fromSubnetAttributes(this, 'ExistingPublicSubnet', {
         subnetId: publicSubnetId,
         availabilityZone: 'us-east-1a', // Replace with your Subnet's availability zone
       });



    // // Security Group
    const securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc,
      allowAllOutbound: true,
    });

    // // Allow HTTPS from the internet
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443), 'Allow HTTPS');

    // // Allow SSH from a specific IP
    securityGroup.addIngressRule(
      ec2.Peer.ipv4('45.20.125.116/32'),
      ec2.Port.tcp(22),
      'Allow SSH from Home Address',
    );

    // EC2 Role
    const role = new iam.Role(this, 'InstanceRole', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore')],
    });

    // Import existing key pair
    const keyPair = ec2.KeyPair.fromKeyPairName(this, 'ExistingKeyPair', 'lfs458-kubernetes');

    //Add SSM Agent to the EC2 instance as it is a RedHat instance
    const userDataScript = `#!/bin/bash
        # Update SSM Agent
        sudo yum update -y amazon-ssm-agent
        # Enable SSM Agent
        sudo systemctl enable amazon-ssm-agent
        # Start SSM Agent
        sudo systemctl start amazon-ssm-agent
        # Check SSM Agent status
        sudo systemctl status amazon-ssm-agent
        # Log the result
        echo "SSM Agent installation and startup completed" | sudo tee -a /var/log/user-data.log
      `;


    // EC2 Instance for us-east-1 using Ubuntu 22.04 LTS as per
    // https://cloud-images.ubuntu.com/locator/ec2/
    const instance = new ec2.Instance(this, 'Instance', {
      vpc,
      vpcSubnets: {
        subnets: [publicSubnet],
      },
      // instanceType: new ec2.InstanceType('t3.xlarge'),
      allowAllOutbound: true,
      // machineImage: ec2.MachineImage.genericLinux({
      //   'us-east-1': 'ami-0485c8c0dadf51233', // Replace with the latest Ubuntu AMI ID for your region
      // }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.XLARGE),
      machineImage: ec2.MachineImage.fromSsmParameter(
        '/aws/service/canonical/ubuntu/server/22.04/stable/current/amd64/hvm/ebs-gp2/ami-id',
        {
          os: ec2.OperatingSystemType.LINUX
        }
      ),
      securityGroup,
      keyPair,
      blockDevices: [
        {
          deviceName: '/dev/xvda',
          volume: ec2.BlockDeviceVolume.ebs(50),
        },
      ],
      role,
      userData: ec2.UserData.custom(userDataScript),
    });

    // Associate Elastic IP
    const elasticIp = new ec2.CfnEIP(this, 'ElasticIP');

    //Associate the Elastic IP with the EC2 Instance
    new ec2.CfnEIPAssociation(this, 'EIPAssociation', {
      allocationId: elasticIp.attrAllocationId, // Allocate and attach EIP
      instanceId: instance.instanceId,
    });

    // Output the instance ID and Elastic IP
     new cdk.CfnOutput(this, 'InstanceId', {
      value: instance.instanceId,
      description: 'The ID of the EC2 instance',
    });

    new cdk.CfnOutput(this, 'ElasticIpAddress', {
      value: elasticIp.ref,
      description: 'The Elastic IP address',
    });

  }
}
