# Documentation

- [Documentation](#documentation)
  - [1. Introduction](#1-introduction)
  - [2. Getting Started](#2-getting-started)
  - [3. Purpose](#3-purpose)
  - [4. Use Cases to Cover](#4-use-cases-to-cover)
    - [4.1. Industry](#41-industry)
    - [4.2. Automotive](#42-automotive)
    - [4.3. Retail](#43-retail)
    - [4.4. DIY Initiatives](#44-diy-initiatives)
  - [5. Features](#5-features)
  - [6. Components](#6-components)
    - [6.1. Frontend](#61-frontend)
    - [6.2. Agent-Connector](#62-agent-connector)
    - [6.3. Agent](#63-agent)
    - [6.4. Kustomize](#64-kustomize)
  - [7. Roadmap](#7-roadmap)

---

## 1. Introduction

RCIoTs, short for "Remote Containerized Internet of Things," represents a groundbreaking platform for managing edge devices that execute containerized workloads. It was conceived as a proof of concept and is currently in its early stages of development, with this document being authored in the final quarter of 2023. As of now, RCIoTs is a personal endeavor, and I am the sole individual responsible for its design and progress. However, I am wholeheartedly open to collaborations and contributions from the community to propel its evolution.

The overarching objective behind RCIoTs is to offer a versatile solution that can be deployed as a multi-tenant Platform as a Service (PaaS) or hosted within a private infrastructure environment. At the core of this initiative lies a fundamental commitment: simplicity. The primary emphasis is to ensure that RCIoTs is exceptionally user-friendly, requiring minimal time and resources for users to embark on their journey with it.

A secondary but crucial aspect of the project revolves around the establishment of robust communication channels between edge devices and RCIoTs. This communication is facilitated through the use of WebSockets with Mutual TLS (MTLS). The beauty of this approach is that it necessitates only an HTTPS connection to function effectively. This design decision eases the burden of communication across various network conditions, including mobile networks and corporate firewalls.

The communication channel serves a dual purpose. On one hand, it allows for the seamless deployment of workload manifests to edge devices, ensuring that they execute tasks precisely as required. On the other hand, it serves as a conduit for collecting invaluable data from the edge. This includes logs, metrics, and any other data that applications running on the edge may need to export. This section of the project is still in its conceptual stage, waiting in the garage of ideas to be further developed and to address a wide range of use cases.

In essence, RCIoTs aims to be a transformative solution that streamlines the management of edge devices with containerized workloads. With its commitment to user-friendliness and robust communication capabilities, it strives to empower organizations and individuals to leverage the full potential of the Internet of Things in an efficient and scalable manner.

## 2. Getting Started

***Prerequisites***

At present, the RCIoTs agent is designed to run on the following platforms:

- **Red Hat Edge Devices:** This includes the new distribution of RHEL for Edge, which incorporates MicroShift—a minimalistic distribution of OpenShift.

- **Red Hat Single Node OpenShift:** This distribution of OpenShift is tailored to run on a single node, combining the control plane and workload.

- **Red Hat OpenShift:** While not its primary purpose, the agent can also be run for testing on OpenShift clusters since it utilizes the necessary components available within OpenShift.

As of now, it has been primarily tested on these three types of OpenShift. The agent communicates with the `oc` binary (OpenShift CLI). However, it can also be adapted for use with `kubectl`, or the manifests can be applied through scripts, API calls to the edge, or device service management. The agent's source code can be found at [https://github.com/rciots/rciots-agent](https://github.com/rciots/rciots-agent).

**Network Requirements:** Edge devices only need to connect to `https://enroll.rciots.com:443` and `https://edge.rciots.com:443`. The first connection is required for the initial enrollment, during which the agent receives client certificates to establish communication using WebSockets with Mutual TLS (MTLS) via the second connection. Once connected, certificate renewal is handled via WebSockets.

***Registration at www.rciots.com***

If you haven't already registered, click on the "Create an account" link on [www.rciots.com](www.rciots.com). Provide your email, username, and password to complete the registration.

***Creating an Enrollment Token***

To create an enrollment token, follow these steps:

1. Navigate to "Devices" > "Provisioning Tokens."
2. Create a new provisioning token.

***Running the Agent***

Once you have the token, you can run the agent using the generated token. To do this, execute the following command. You can find the command in the token creation template.

```
oc process -f https://raw.githubusercontent.com/rciots/rciots-agent/main/manifest/openshift-template/template.yaml token=[TOKEN] devicename=device001 namespace=rciots-agent -o yaml | oc create -f -
```

***Device Approval***

If the token was created automatically, the device is automatically accepted. If you deselected this option during token creation, the device(s) will appear in the "Pending Devices" view, awaiting approval.

***Check the devices***

Go to the Devices --> current devices view to check your new managed devices.

Congratulations! By following these simple steps, you have successfully connected your device to the platform. The next step is to define the workload to run on the devices, set it individually or create a reusable Template, based on Kustomize, to deploy the workload you wish to run on the edge. This can involve pointing to a GitHub repository or defining YAML directly through the interface.

## 3. Purpose

## 4. Use Cases to Cover

### 4.1. Industry

### 4.2. Automotive

### 4.3. Retail

### 4.4. DIY Initiatives

## 5. Features

## 6. Components

### 6.1. Frontend

### 6.2. Agent-Connector

### 6.3. Agent

### 6.4. Kustomize

## 7. Roadmap