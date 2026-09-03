// agent.routes.js
import { Router } from "express";
import agent from "../agents/code.agent.js"

const agentRouter = Router();

agentRouter.post("/invoke", async (req, res) => {
    // console.time("agent-invoke");
    const start = Date.now();
    try {
        const { message, projectId } = req.body;

        // 1. Set SSE mandatory headers
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });

        // console.log("========== INVOKE REQUEST ==========");
        // console.log("Request Body:", req.body);
        // console.log("Message:", message);
        // console.log("Project ID:", projectId);
        // console.log("====================================");

        console.log("Starting agent.invoke...");

        const response = await agent.stream(
            {
                messages: [
                    {
                        role: "user",
                        content: message,
                    },
                ],
            },
            {
                context: {
                    projectId,
                },
                streamMode: "custom" // changed from "values"
            }
        );

        // const chunks = [];
        for await (const chunk of response) {
            console.log(chunk);
            // 2. Keep connection alive with an optional heartbeat string
            res.write(`data: ${chunk}\n\n`);

            // chunks.push(chunk);

            // console.log(`\n[+${Date.now() - start}ms]`);
            // console.log("NODE:", Object.keys(chunk));

            // console.log("========== STREAM CHUNK ==========");
            // console.dir(chunk, { depth: null });
            // console.log("==================================");
        }

        // console.log("========== ALL CHUNKS ==========");
        // console.dir(chunks, { depth: null });
        // console.log("================================");

        // console.log(
        //     `agent.invoke completed in ${Date.now() - start} ms`
        // );
        // console.timeEnd("agent-invoke");

        console.log("Agent finished successfully.");
        // res.json({ response });
        res.end();

        // res.json({ chunks });
    }
    catch (error) {
    console.log(
        `agent.invoke failed after ${Date.now() - start} ms`
    );

    console.error("========== INVOKE ERROR ==========");
    console.error(error);
    console.error(error?.stack);

    if (error?.cause) {
        console.error("Cause:");
        console.error(error.cause);
    }

    if (error?.response) {
        console.error("Response:");
        console.error(error.response.data);
    }

    // If SSE has already started, send the error through the stream
    if (res.headersSent) {
        res.write(
            `event: error\n` +
            `data: ${JSON.stringify({
                error: error.message,
            })}\n\n`
        );

        return res.end();
    }

    // Otherwise send a normal HTTP error response
    return res.status(500).json({
        error: error.message,
    });
}
});

export default agentRouter;