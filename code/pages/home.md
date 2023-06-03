# RCIOTS - Remote Control IOT Service

Welcome to RCIOTS.COM, the MVP proof of concept PaaS for managing IoT/Edge devices.

The idea is to be able to manage the workload running on Edge devices, using websockets with MTLS to comunicate FROM the devices TO an endpoint in the cloud or datacenter. The enrollment process is automated as much as possible, and the management of hundreds of devices can be facilitated from the start.

From now on, you are able to manage the manifests to run on your Red Hat Edge Devices by connecting to this site. Follow the next steps to achieve it!

1. -Register on this site.
    
2. -Go to "Devices" and select "Enrollment tokens".

3. -Create a new token, set a name, Automatic or not (Manual) approval method, how many devices can enroll this token, and expiration date.

4. -Copy the generated token from the form.

5. -Clone the repo https://github.com/rciots/rciots-agent

6. -Add your token to manifest/secret-cfg.yaml under the "TOKEN" field, and change your "DEVICENAME" to your desired device name.

7. -Log in to your Edge Device using the "oc" CLI and apply the manifests using the command: "oc apply -k manifest/".

8. -Check the newly generated device in the devices view. If the token was not set to automatic approval, you will need to approve it in the "Pending devices" section.

9. -Set the manifests you want to apply. You can create a template and associate it with the device. Keep in mind that they will be generated with [kustomize](https://kustomize.io/) on the server side. 

10. -Every 5 minutes your device will receive the manifests and apply them on the device with *oc apply -f -*

