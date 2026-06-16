import { k8sCoreV1Api } from "./config.js";


export async function createPod(sandboxId) {

    // iss podManifest mein hum basically ye bata rahe hain ki humare pod ka kya configuration hoga, pod ka naam kya hoga, aur uske andar kitne containers honge(1 container in this case) and container kiss image se banega, kya kya resources use karega, etc.
    const podManifest = {
        metadata: {
            name: `sandbox-pod-${sandboxId}`,
            labels: {
                app: "sandbox",
                sandboxId: sandboxId
            }
        },
        spec: {
            containers: [
                {
                    image: "template",
                    imagePullPolicy: "IfNotPresent",
                    name: `sandbox-container-${sandboxId}`,
                    ports: [{ containerPort: 5173, name: "http" }],
                    resources: {
                        limits: { cpu: "500m", memory: "1Gi" },
                        requests: { cpu: "250m", memory: "500Mi" }
                    }
                }
            ]
        }
    }

    // At this point, the Pod has not been created yet. podManifest is only a specification (manifest) that describes the desired configuration of the Pod. The actual Pod is created only when createNamespacedPod() sends this manifest to the Kubernetes API server.
    const response = await k8sCoreV1Api.createNamespacedPod({
        namespace: "default",
        body: podManifest
    });
    // How does createNamespacedPod() send the manifest to the Kubernetes API Server?
    // When you call createNamespacedPod(), you are not directly talking to Kubernetes yourself. The Kubernetes JavaScript client library (@kubernetes/client-node) does the work for you.
    // The Kubernetes JS client converts the podManifest object into JSON and sends it as an HTTPS POST request to the API Server endpoint configured in the config.js file. The API Server then validates, stores, and processes the Pod creation request. And our pod will be created.

    return response;
}