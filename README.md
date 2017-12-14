# QueueServer

## Agent API

This grabs the parameters passed by TC to the Agent for the Agent to pass the instructions to the Queue

## Queue

Store info in inital Database table then upload to RabbitMQ server

## Worker

The worker will test on the namespaces / classes passed by the RabbitMQ server.