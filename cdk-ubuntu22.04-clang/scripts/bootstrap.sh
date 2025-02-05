#!/bin/bash

# Replace <STACKNAME>, <TEMPLATEFILE.yml>, <CAPABILITES> with actual values when running
# This stack was created for the Linux development course in Coursera
# https://www.coursera.org/learn/linux-system-programming-introduction-to-buildroot/supplement/bnixD/assignment-1-instructions
STACK_NAME="ebpf-stack"
CAPABILITIES="CAPABILITY_NAMED_IAM"
QUALIFIER="ebpf"
AWS_ACC_REGION="aws://570475827592/us-east-1"

cdk bootstrap "$AWS_ACC_REGION" \
  --toolkit-stack-name "$STACK_NAME" \
  --capabilities "$CAPABILITIES" \
  --qualifier "$QUALIFIER"