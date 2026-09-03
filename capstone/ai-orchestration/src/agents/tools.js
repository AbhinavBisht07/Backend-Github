// tools.js
import axios from "axios";
import { tool } from "langchain";
// humko schema bhi define karna padta hai... ki jo humara tool hai wo input mein kese kya data mangega .. to isko define karne ke liye we use zod ....
import * as z from "zod"

import http from "http";
import dns from "dns";
const customLookup = (hostname, options, callback) => {
    if (hostname.endsWith(".localhost")) {
        if (options.all) {
            return callback(null, [{ address: "127.0.0.1", family: 4 }]);
        }
        return callback(null, "127.0.0.1", 4);
    }
    return dns.lookup(hostname, options, callback);
};
const agentHttpAgent = new http.Agent({ lookup: customLookup });
// then per-request:
// await axios.get(url, { httpAgent: agentHttpAgent });


// Our AI Agent will use these tools :-
// tool for list-files API :-
// export const listFiles = tool (
//     // kyuki list-files wali api kuch demand ni karti isliye parameter mein kuch accept nahi karre hum 
//     async ({}) => {
//         console.log("=================================");
//         console.log("Using listFiles tool");
//         console.log("=================================");

//         try{

//         }

//         // list-files wali API hit karenge axios ki help se... filhaal ke liye hardcoded API le rahe hain... baad mein dyncamic kar denge isko 
//         const response = await axios.get("http://019f6a6c-4bad-766f-976e-ad07894bb32f.agent.localhost/list-files");

//         console.log("=================================");
//         console.log("Response from listFiles tool : ", response.data);
//         console.log("=================================");

//         // ab postman mein jaake dekh lo kesa data response mein deri ye api .. fir uss hisaab se neeche data return kara do
//         return JSON.stringify(response.data.files); 
//     },
//     {
//         name: "list_files",
//         description: "List all the files in the project directory. This is useful for understanding what files are available to work with.",
//         schema: z.object({})
//     }
// )

export const listFiles = tool(
    // kyuki list-files wali api kuch demand ni karti isliye parameter mein kuch accept nahi karre hum 
    async ({ }, config) => {
        // console.log("========== listFiles START ==========");
        // console.log("writer exists:", !!config?.writer);
        // console.log("context:", config?.context);
        // console.log("projectId:", config?.context?.projectId);
        // console.log("====================================");

        const writer = config.writer;
        writer("Listing files in project directory...\n")

        // console.log("=================================");
        // console.log("Using listFiles tool");
        // console.log("=================================");

        // console.log("========== CONFIG ==========");
        // console.dir(config, { depth: null });

        // console.log("context =", config?.context);
        // console.log("projectId =", config?.context?.projectId);


        console.time("listFiles");
        try {
            // list-files wali API hit karenge axios ki help se... filhaal ke liye hardcoded API le rahe hain... baad mein dyncamic kar denge isko 
            console.log("Calling list-files API...");
            const response = await axios.get(`http://sandbox-service-${config.context.projectId}:3000/list-files`, { httpAgent: agentHttpAgent, timeout: 15000 });

            writer("Files listed successfully." + "Files:" + response.data.files.join(",") + "\n");

            // console.log("=================================");
            // console.log("Response from listFiles tool : ", response.data);
            // console.log("=================================");

            // ab postman mein jaake dekh lo kesa data response mein deri ye api .. fir uss hisaab se neeche data return kara do
            console.log("listFiles returning...");
            return JSON.stringify(response.data.files);
        } catch (error) {
            console.log("=================================");
            console.error("Error in listFiles tool:", error);
            console.log("=================================");
            throw error;
        }
        finally {
            console.timeEnd("listFiles");
        }
    },
    {
        name: "list_files",
        description: "List all the files in the project directory. This is useful for understanding what files are available to work with.",
        schema: z.object({})
    }
);

// tool for read-files API :-
export const readFiles = tool(
    // kyuki read-files wali api files naam ke array mein multiple ya single file ka path maangti hai( in string format .. example "/src/App.jsx") isliye parameter mein files naam ka array accept karre hum 
    async ({ files }, config) => {
        // console.log("========== readFiles START ==========");
        // console.log("writer exists:", !!config?.writer);
        // console.log("context:", config?.context);
        // console.log("projectId:", config?.context?.projectId);
        // console.log("files:", files);
        // console.log("====================================");

        const writer = config.writer;
        writer("Reading files..." + files.join(",") + "\n");


        // console.log("=================================");
        // console.log("Using readFiles tool with the files : ", files);
        // console.log("=================================");

        console.time("readFiles");
        try {
            console.log("Calling read-files API...");
            const response = await axios.get(
                `http://sandbox-service-${config.context.projectId}:3000/read-files?files=` + files.join(","),
                { httpAgent: agentHttpAgent, timeout: 15000 }
            );

            writer("Files read successfully.\n")

            // console.log("=================================");
            // console.log("Response from readFiles tool : ", response.data);
            // console.log("=================================");

            console.log("readFiles returning...");
            return JSON.stringify(response.data);

        } catch (error) {

            console.log("=================================");
            console.error("Error in readFiles tool:", error);
            console.log("=================================");

            throw error;
        }
        finally {
            console.timeEnd("readFiles");
        }
    },
    {
        name: "read_files",
        description: "Read the contents of specified files. This is useful for understanding the content of files that are relevant to the task at hand.",
        schema: z.object({
            files: z.array(z.string()).describe("The list of files' absolute paths to read. These should be files that were listed using the list_files tool or created later.")
        })
    }
)

// iss next tool ko hum dono power dedenge.. power of updating and creating files ....
// tool for update-files and create-files API :-
export const updateFiles = tool(
    // update-files api 2 cheezein maangti hai 1. File path, 2. Content
    // to ye dono cheezein accept karwani padengi humko ... to neeche ye files naam ka ek array of objects accept karwa re hum... that contains multiple objects ... each object containing a FILE PATH and its CONTENT 
    async ({ files }, config) => {
        // console.log("========== updateFiles START ==========");
        // console.log("writer exists:", !!config?.writer);
        // console.log("context:", config?.context);
        // console.log("projectId:", config?.context?.projectId);
        // console.log("files to update:", files.map(f => f.file));
        // console.log("======================================");

        const writer = config.writer;

        writer("Updating files...\n" + files.map(f => f.file).join(",") + "\n");

        // console.log("=================================");
        // console.log("Using updateFiles tool with the files : ", files);
        // console.log("=================================");

        console.time("updateFiles");
        try {
            // console.log("Calling update-files API...");

            console.log("Calling update-files API...");
            const response = await axios.patch(
                `http://sandbox-service-${config.context.projectId}:3000/update-files`,
                {
                    updates: files
                },
                {
                    httpAgent: agentHttpAgent,
                    timeout: 15000
                }
            );

            writer("Files updated successfully.\n")

            // console.log("Returned from update-files API");

            // console.log("=================================");
            // console.log("Response from updateFiles tool : ", response.data);
            // console.log("=================================");

            console.log("updateFiles returning...");
            return JSON.stringify(response.data.results);

        } catch (error) {

            console.log("=================================");
            console.error("Error in updateFiles tool:", error);
            console.log("=================================");

            throw error;
        }
        finally {
            console.timeEnd("updateFiles");
        }
    },
    {
        name: "update_files",
        description: `
        Update the contents of the specified files. This is useful for making changes to files based on the requirements of the task at hand. 
        This tool can also be used to create new files by providing a new file name in the file field and the content to be added in the content field.`,
        schema: z.object({
            files: z.array(z.object({
                file: z.string().describe("The absolute path of the file to update"),
                content: z.string().describe("The new content for the file.")
            })).describe("the list of files to update and their new contents")
        })
    }
);





// // tools.js
// import axios from "axios";
// import { tool } from "langchain";
// // humko schema bhi define karna padta hai... ki jo humara tool hai wo input mein kese kya data mangega .. to isko define karne ke liye we use zod ....
// import * as z from "zod"

// import http from "http";
// import dns from "dns";

// const customLookup = (hostname, options, callback) => {
//     if (hostname.endsWith(".localhost")) {
//         if (options.all) {
//             return callback(null, [{ address: "127.0.0.1", family: 4 }]);
//         }
//         return callback(null, "127.0.0.1", 4);
//     }
//     return dns.lookup(hostname, options, callback);
// };

// const agentHttpAgent = new http.Agent({ lookup: customLookup });
// // then per-request:
// // await axios.get(url, { httpAgent: agentHttpAgent });


// // ==========================================================
// // ================= CHATGPT UPDATE START ====================
// // Reason:
// // Shared helper utilities for all tools.
// // - Prevent duplicate tool calls.
// // - Retry transient network failures.
// // - Validate projectId.
// // - Keep response format consistent.
// // ==========================================================

// // cache survives for the lifetime of one agent execution
// const toolCache = new Map();

// function getCacheKey(toolName, payload, projectId) {
//     return `${projectId}:${toolName}:${JSON.stringify(payload)}`;
// }

// async function withRetry(fn, retries = 1) {
//     let lastError;

//     for (let attempt = 0; attempt <= retries; attempt++) {
//         try {
//             return await fn();
//         } catch (err) {
//             lastError = err;

//             const shouldRetry =
//                 err.code === "ECONNRESET" ||
//                 err.code === "ECONNREFUSED" ||
//                 err.code === "ETIMEDOUT" ||
//                 err.code === "ECONNABORTED";

//             if (!shouldRetry || attempt === retries) {
//                 throw lastError;
//             }

//             console.log(
//                 `Retrying request (${attempt + 1}/${retries})...`
//             );

//             await new Promise(resolve => setTimeout(resolve, 500));
//         }
//     }

//     throw lastError;
// }

// function validateProjectId(config) {
//     const projectId = config?.context?.projectId;

//     if (!projectId) {
//         throw new Error(
//             "Missing projectId in tool context."
//         );
//     }

//     return projectId;
// }

// function getAxiosError(error) {

//     if (error.response) {
//         return new Error(
//             `Sandbox API failed (${error.response.status}) : ${typeof error.response.data === "string"
//                 ? error.response.data
//                 : JSON.stringify(error.response.data)
//             }`
//         );
//     }

//     if (error.code === "ECONNABORTED") {
//         return new Error("Sandbox API request timed out.");
//     }

//     return error;
// }

// // ================== CHATGPT UPDATE END =====================


// // ================= CHATGPT UPDATE START =================
// // Reason:
// // Improved listFiles
// // - Cache repeated requests
// // - Validate projectId
// // - Retry transient failures
// // - Better writer messages
// // - Better errors
// // - Backward compatible response
// // ========================================================

// export const listFiles = tool(
//     // kyuki list-files wali api kuch demand ni karti isliye parameter mein kuch accept nahi karre hum
//     async ({ }, config) => {

//         console.log("========== listFiles START ==========");
//         console.log("writer exists:", !!config?.writer);
//         console.log("context:", config?.context);
//         console.log("projectId:", config?.context?.projectId);
//         console.log("====================================");

//         const writer = config.writer;

//         const projectId = validateProjectId(config);

//         writer("Listing files in project directory...\n");

//         // CHATGPT UPDATE : cache key
//         const cacheKey = getCacheKey(
//             "list_files",
//             {},
//             projectId
//         );

//         // CHATGPT UPDATE : prevent duplicate API calls
//         if (toolCache.has(cacheKey)) {

//             console.log("Returning cached listFiles response.");

//             writer("Using cached file list.\n");

//             return toolCache.get(cacheKey);
//         }

//         console.time("listFiles");

//         try {

//             console.log("Calling list-files API...");

//             // CHATGPT UPDATE : retry wrapper
//             const response = await withRetry(() =>
//                 axios.get(
//                     `http://sandbox-service-${projectId}:3000/list-files`,
//                     {
//                         httpAgent: agentHttpAgent,
//                         timeout: 15000
//                     }
//                 )
//             );

//             const files = response.data.files ?? [];

//             writer(
//                 `Found ${files.length} files.\n`
//             );

//             // CHATGPT UPDATE :
//             // Keep return value backward compatible.
//             const result = JSON.stringify(files);

//             toolCache.set(cacheKey, result);

//             console.log("listFiles returning...");

//             return result;

//         } catch (error) {

//             console.log("=================================");
//             console.error("Error in listFiles tool:", error);
//             console.log("=================================");

//             throw getAxiosError(error);

//         } finally {

//             console.timeEnd("listFiles");

//         }

//     },
//     {
//         name: "list_files",
//         description: `List all files in the project.

//         IMPORTANT:
//         - This tool should normally be called only once.
//         - Do NOT repeatedly call this tool with the same arguments.
//         - After obtaining the file list, use read_files to inspect specific files.
//         - If the project structure has not changed, do not call this tool again.`,
//         schema: z.object({})
//     }
// );

// // ================== CHATGPT UPDATE END =================



// // ================= CHATGPT UPDATE START =================
// // Reason:
// // Improved readFiles
// // - Better validation
// // - URL encode file paths
// // - Retry transient failures
// // - Better error messages
// // ========================================================

// export const readFiles = tool(
//     // kyuki read-files wali api files naam ke array mein multiple ya single file ka path maangti hai( in string format .. example "/src/App.jsx") isliye parameter mein files naam ka array accept karre hum
//     async ({ files }, config) => {

//         console.log("========== readFiles START ==========");
//         console.log("writer exists:", !!config?.writer);
//         console.log("context:", config?.context);
//         console.log("projectId:", config?.context?.projectId);
//         console.log("files:", files);
//         console.log("====================================");

//         const writer = config.writer;

//         const projectId = validateProjectId(config);

//         // ================= CHATGPT UPDATE START =================
//         // Validate tool input
//         if (!Array.isArray(files) || files.length === 0) {
//             throw new Error("read_files requires at least one file.");
//         }
//         // ================= CHATGPT UPDATE END ===================

//         writer(
//             `Reading ${files.length} file(s)...\n`
//         );

//         console.time("readFiles");

//         try {

//             // console.log("Calling read-files API...");
//             console.log({
//                 tool: "read_files",
//                 projectId,
//                 files
//             });

//             // ================= CHATGPT UPDATE START =================
//             // URL encode file paths before sending to sandbox.
//             const encodedFiles = files.map(file =>
//                 encodeURIComponent(file)
//             );

//             const response = await withRetry(() =>
//                 axios.get(
//                     `http://sandbox-service-${projectId}:3000/read-files?files=${encodedFiles.join(",")}`,
//                     {
//                         httpAgent: agentHttpAgent,
//                         timeout: 15000
//                     }
//                 )
//             );
//             // ================= CHATGPT UPDATE END ===================

//             writer(
//                 `Successfully read ${files.length} file(s).\n`
//             );

//             console.log("readFiles returning...");

//             return JSON.stringify(response.data);

//         } catch (error) {

//             console.log("=================================");
//             console.error("Error in readFiles tool:", error);
//             console.log("=================================");

//             throw getAxiosError(error);

//         } finally {

//             console.timeEnd("readFiles");

//         }

//     },
//     {
//         name: "read_files",
//         description:
//             `Read the contents of one or more files.

//         IMPORTANT:
//         - Read only the files necessary to solve the user's request.
//         - Do not repeatedly read the same file unless it has been modified.
//         - Prefer reading a few relevant files instead of the whole project`,
//         schema: z.object({
//             files: z.array(z.string()).describe(
//                 "The list of files' absolute paths to read. These should be files that were listed using the list_files tool or created later."
//             )
//         })
//     }
// );

// // ================== CHATGPT UPDATE END =================



// // ================= CHATGPT UPDATE START =================
// // Reason:
// // Improved updateFiles
// // - Better validation
// // - Retry transient failures
// // - Better writer output
// // - Better error handling
// // ========================================================

// export const updateFiles = tool(
//     // update-files api 2 cheezein maangti hai 1. File path, 2. Content
//     // to ye dono cheezein accept karwani padengi humko ... to neeche ye files naam ka ek array of objects accept karwa re hum... that contains multiple objects ... each object containing a FILE PATH and its CONTENT
//     async ({ files }, config) => {

//         console.log("========== updateFiles START ==========");
//         console.log("writer exists:", !!config?.writer);
//         console.log("context:", config?.context);
//         console.log("projectId:", config?.context?.projectId);
//         console.log("files to update:", files.map(f => f.file));
//         console.log("======================================");

//         const writer = config.writer;

//         const projectId = validateProjectId(config);

//         // ================= CHATGPT UPDATE START =================
//         // Validate tool input
//         if (!Array.isArray(files) || files.length === 0) {
//             throw new Error(
//                 "update_files requires at least one file."
//             );
//         }

//         for (const file of files) {

//             if (!file.file?.trim()) {
//                 throw new Error(
//                     "File path cannot be empty."
//                 );
//             }

//             if (typeof file.content !== "string") {
//                 throw new Error(
//                     `Invalid content for ${file.file}`
//                 );
//             }

//         }
//         // ================= CHATGPT UPDATE END =================

//         writer(
//             `Updating ${files.length} file(s)...\n`
//         );

//         console.time("updateFiles");

//         try {

//             console.log("Calling update-files API...");

//             const response = await withRetry(() =>
//                 axios.patch(
//                     `http://sandbox-service-${projectId}:3000/update-files`,
//                     {
//                         updates: files
//                     },
//                     {
//                         httpAgent: agentHttpAgent,
//                         timeout: 15000
//                     }
//                 )
//             );

//             // ================= CHATGPT UPDATE START =================
//             // Clear cached file listings because project structure may have changed.
//             // This ensures future list_files calls fetch the latest project state.
//             toolCache.clear();
//             // ================= CHATGPT UPDATE END =================

//             writer(
//                 `Successfully updated ${files.length} file(s).\n`
//             );

//             console.log("updateFiles returning...");

//             return JSON.stringify(response.data.results);

//         } catch (error) {

//             console.log("=================================");
//             console.error("Error in updateFiles tool:", error);
//             console.log("=================================");

//             throw getAxiosError(error);

//         } finally {

//             console.timeEnd("updateFiles");

//         }

//     },
//     {
//         name: "update_files",
//         description: `
//         Update or create files.

//         IMPORTANT:
//         - Only update files after identifying the root cause.
//         - Avoid rewriting unrelated files.
//         - Only modify files necessary to solve the task.`,
//         schema: z.object({
//             files: z.array(
//                 z.object({
//                     file: z
//                         .string()
//                         .describe("The absolute path of the file to update"),
//                     content: z
//                         .string()
//                         .describe("The new content for the file.")
//                 })
//             ).describe(
//                 "the list of files to update and their new contents"
//             )
//         })
//     }
// );

// // ================== CHATGPT UPDATE END =================
