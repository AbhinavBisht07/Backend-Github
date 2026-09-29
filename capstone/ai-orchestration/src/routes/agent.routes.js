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

        console.log("Starting agent.invoke...");

        const writer = (text) => res.write(text);

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
                    writer
                },
                streamMode: "values"
            }
        );

        let lastState = null;

        for await (const state of response) {
            lastState = state;
        }

        console.log("========== LAST STATE ==========");
        console.dir(lastState, { depth: null });
        console.log("================================");

        if (lastState?.messages?.length) {
            const msgs = lastState.messages;

            for (let i = msgs.length - 1; i >= 0; i--) {
                const m = msgs[i];

                const role = m.role ?? m.type ?? m._getType?.();

                if (
                    (role === "ai" || role === "assistant") &&
                    !m.tool_calls?.length
                ) {
                    const content =
                        typeof m.content === "string"
                            ? m.content
                            : JSON.stringify(m.content);

                    res.write(content + "\n");
                    break;
                }
            }
        }

        console.log("Agent finished successfully.");
        res.end();
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