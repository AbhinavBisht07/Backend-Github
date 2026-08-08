// import * as K8sApi from "@kubernetes/client-node";

// const kc = new K8sApi.KubeConfig();
// kc.loadFromDefault();

// export const k8sCoreV1Api = kc.makeApiClient(K8sApi.CoreV1Api);


import * as K8sApi from "@kubernetes/client-node";

const kc = new K8sApi.KubeConfig();
kc.loadFromDefault();

console.log("Current Context:", kc.getCurrentContext());
console.log("Current Cluster:", kc.getCurrentCluster());
console.log("Clusters:", kc.clusters);
console.log("Contexts:", kc.contexts);

export const k8sCoreV1Api = kc.makeApiClient(K8sApi.CoreV1Api);