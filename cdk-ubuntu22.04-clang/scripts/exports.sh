#!/bin/bash

# Set AWS Account ID
export CDK_DEFAULT_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)

# Set AWS Region
export CDK_DEFAULT_REGION=$(aws configure get region)

# Set CDK toolkit stack name (customize if needed)
export CDK_TOOLKIT_STACK_NAME="ebpf-stack"

# Set CDK qualifier (customize if needed)
export CDK_QUALIFIER="ebpf"

# Optional: Set default capabilities for 'cdk deploy'
export CDK_DEFAULT_CAPABILITIES="CAPABILITY_IAM CAPABILITY_NAMED_IAM"

echo "CDK environment variables exported:"
echo "  CDK_DEFAULT_ACCOUNT: $CDK_DEFAULT_ACCOUNT"
echo "  CDK_DEFAULT_REGION: $CDK_DEFAULT_REGION"
echo "  CDK_TOOLKIT_STACK_NAME: $CDK_TOOLKIT_STACK_NAME"
echo "  CDK_QUALIFIER: $CDK_QUALIFIER"
echo "  CDK_DEFAULT_CAPABILITIES: $CDK_DEFAULT_CAPABILITIES"