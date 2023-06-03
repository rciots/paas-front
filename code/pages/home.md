# RCIOTS - Remote Control IOT Service

Welcome to RCIOTS.COM the MVP proof of concept PaaS for managing IoT/Edge devices.

The idea is to be able to manage the workload running on Edge devices, using websockets with MTLS to comunicate FROM the devices TO a endpoint in the cloud or datacenter, automating the enrollment process as much as possible, the management of hundreds of devices can be facilitated from minute 0.

From now, you are able to manage the manifests to run on your Red Hat Edge Devices connecting to this site, follow the next steps to achieve it!

1. -Register at this site
    
2. -Go to devices --> Enrollment tokens

3. -Create a new token, set a name, Automatic or not (Manual) approval method, how many devices can enroll this token, and expiration date

4. -Copy the token generated at the form

5. -Clone the repo https://github.com/rciots/rciots-agent

6. -Add your token to manifest/secret-cfg.yaml at the "TOKEN", and change your "DEVICENAME"

7. -Logged at your Edge Device with oc/kubectl command, apply the manifests like: *oc apply -k manifest/*

8. -Check the new device generated at devices view, if the token wasn't automatic, you need to approve it at Pending devices

9. -Set the manifests you want to apply, you can create a template and associate to the device, take in consideration that are going to be generated with [kustomize](https://kustomize.io/) in server side.

10. -Every 5 minutes your device will receive the manifests and apply them on the device with oc apply -f -

