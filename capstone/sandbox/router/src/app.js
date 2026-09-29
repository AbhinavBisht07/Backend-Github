import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware"
import morgan from "morgan";
import http from "http";
import { refreshTTL } from "./config/redis.js";


const app = express();
const httpServer = http.createServer(app);

app.use(morgan("combined"));


app.get("/api/status/healthz", (req, res) => {
    res.status(200).json({ status: "ok" })
})
app.get("/api/status/readyz", (req, res) => {
    res.status(200).json({ status: "ready" })
})


const proxies = {};
const agentProxies = {};

function getProxy(sandboxId) {

    const target = `http://sandbox-service-${sandboxId}`;  // Construct the target URL based on the sandbox ID

    if (!proxies[sandboxId]) {
        proxies[sandboxId] = createProxyMiddleware({
            target,
            changeOrigin: true,
            ws: true
        })
    }

    return proxies[sandboxId];
}

function getAgentProxy(sandboxId) {

    const target = `http://sandbox-service-${sandboxId}:3000`;  // Construct the target URL based on the sandbox ID

    if (!agentProxies[sandboxId]) {
        agentProxies[sandboxId] = createProxyMiddleware({
            target,
            changeOrigin: true,
            ws: true
        })
    }

    return agentProxies[sandboxId];
}


app.use(async (req, res, next) => {
    const host = req.headers.host;
    const sandboxId = host.split(".")[0]; // Extract the sandbox ID from the subdomain

    /**
     * if else if conditional for these two type of URLs :-
     * pod1.preview.localhost
     * pod1.agent.localhost
     */

    await refreshTTL(sandboxId); // TTL refreshed for Sandbox Pod key

    if (host.split('.')[1] === 'agent') {
        return getAgentProxy(sandboxId)(req, res, next);
    }

    else if (host.split('.')[ 1 ] === 'preview'){
        return getProxy(sandboxId)(req, res, next);
    }
})


// WebSocket upgrade requests (e.g. socket.io) bypass Express's normal
// middleware chain entirely — Node's http.Server emits a separate
// 'upgrade' event for them, so we route them here using the same
// subdomain logic as above.
httpServer.on("upgrade", (req, socket, head) => {
    console.log("========== UPGRADE ==========");
    console.log("Host:", req.headers.host);
    console.log("URL:", req.url);
    console.log("Headers:", req.headers);

    const host = req.headers.host;
    if (!host) {
        socket.destroy();
        return;
    }

    const sandboxId = host.split(".")[0];

    if (host.split(".")[1] === "agent") {
        console.log("Proxying to agent:", sandboxId);
        getAgentProxy(sandboxId).upgrade(req, socket, head);
    } else if (host.split(".")[1] === "preview") {
        console.log("Proxying to preview:", sandboxId);
        getProxy(sandboxId).upgrade(req, socket, head);
    } else {
        console.log("Unknown host");
        socket.destroy();
    }
});


export default httpServer