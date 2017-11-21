#!/usr/bin/python
# -*- coding: utf-8 -*-
import boto3
import os
import time

access_key = ''
access_secret = ''
region = 'us-east-1'
queue_url = ''


def pop_message(client, url):
    response = client.receive_message(QueueUrl=url,
            MaxNumberOfMessages=10)

    # last message posted becomes messages

    message = response['Messages'][0]['Body']
    receipt = response['Messages'][0]['ReceiptHandle']
    client.delete_message(QueueUrl=url, ReceiptHandle=receipt)
    return message


client = boto3.client('sqs', aws_access_key_id=access_key,
                      aws_secret_access_key=access_secret,
                      region_name=region)

waittime = 20
client.set_queue_attributes(QueueUrl=queue_url,
                            Attributes={'ReceiveMessageWaitTimeSeconds': str(waittime)})

time_start = time.time()
while time.time() - time_start < 60:
    print 'Checking...'
    try:
        message = pop_message(client, queue_url)
        print message
        if message == 'start_operation':
            os.system('~/start_op.sh')
        elif message == 'take_picture':
            os.system('~/take_picture__op4_ch1.sh')
        elif message == 'start_recording':
            os.system('~/set_recorder_start__op4.sh')
        elif message == 'stop_recording':
            os.system('~/set_recorder_stop__op4.sh')
        elif message == 'end_operation':
            os.system('~/end_op__op4.sh')
    except:
        pass
