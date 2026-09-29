import express from "express";
import morgan from "morgan";
import { createPod } from "./kubernetes/pod.js";
import { createService } from "./kubernetes/service.js";
import { v7 as uuid } from "uuid";
import { createSandboxKey } from "./config/redis.js"; // import kar diya createSandboxKey wala function
// and jahan pe sandbox id create honi wale hogi(mtlb naya sandbox pod create hone wala hoga) wahan pe use kar lenge iss function ko

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/sandbox/health", (req, res) => {
    res.status(200).json({
        message: "Sandbox API is healthy and running!",
        status: "ok"
    });
});

app.post("/api/sandbox/start", async (req, res) => {
    const sandboxId = uuid();

    await Promise.all([
        createPod(sandboxId),
        createService(sandboxId),
        createSandboxKey(sandboxId) // use kar liya redis wala createSandboxKey wala function
    ]);
    // ooper pe basically kya hora hai ? ... 1st line mein Sandbox Pod create karre hain, second line mein Sandbox Service create karre hain and in third line we are creating Sandbox Key for the Redis ...

    return res.status(200).json({
        message: "Sandbox environment created successfully",
        sandboxId,
        previewUrl: `http://${sandboxId}.preview.localhost` 
    });
});

export default app;