# EVENT API GUIDE

## BFF SERVICE

The BFF service is a microservice that acts as a bridge between the client and backend services. It provides a unified API for the client to interact with multiple backend services, simplifying the communication process and improving performance.

## Architectural Design Credit and Contact Information

The architectural design of this microservice is credited to.  
For inquiries, feedback, or further information regarding the architecture, please direct your communication to:

**Email**:

We encourage open communication and welcome any questions or discussions related to the architectural aspects of this microservice.

## Documentation Scope

Welcome to the official documentation for the BFF Service Event Listeners. This guide details the Kafka-based event listeners responsible for reacting to ElasticSearch index events. It describes listener responsibilities, the topics they subscribe to, and expected payloads.

**Intended Audience**  
This documentation is intended for developers, architects, and system administrators involved in the design, implementation, and maintenance of the BFF Service. It assumes familiarity with microservices architecture, the Kafka messaging system, and ElasticSearch.

**Overview**  
Each ElasticSearch index operation (create, update, delete) emits a corresponding event to Kafka. These events are consumed by listeners responsible for executing aggregate functions to ensure index- and system-level consistency.

## Kafka Event Listeners
