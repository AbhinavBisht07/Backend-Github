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
    async ({}) => {
        console.log("=================================");
        console.log("Using listFiles tool");
        console.log("=================================");

        try {
            // list-files wali API hit karenge axios ki help se... filhaal ke liye hardcoded API le rahe hain... baad mein dyncamic kar denge isko 
            const response = await axios.get("http://sandbox-service-019fccb1-e00c-75a8-8ab3-bbce9266f419:3000/list-files", { httpAgent: agentHttpAgent });

            console.log("=================================");
            console.log("Response from listFiles tool : ", response.data);
            console.log("=================================");

            // ab postman mein jaake dekh lo kesa data response mein deri ye api .. fir uss hisaab se neeche data return kara do
            return JSON.stringify(response.data.files);
        } catch (error) {
            console.log("=================================");
            console.error("Error in listFiles tool:", error);
            console.log("=================================");
            throw error;
        }
    },
    {
        name: "list_files",
        description: "List all the files in the project directory. This is useful for understanding what files are available to work with.",
        schema: z.object({})
    }
);

// tool for read-files API :-
export const readFiles = tool (
    // kyuki read-files wali api files naam ke array mein multiple ya single file ka path maangti hai( in string format .. example "/src/App.jsx") isliye parameter mein files naam ka array accept karre hum 
    async ({ files }) => {
        console.log("=================================");
        console.log("Using readFiles tool with the files : ", files);
        console.log("=================================");

        try {

            const response = await axios.get(
                "http://sandbox-service-019fccb1-e00c-75a8-8ab3-bbce9266f419:3000/read-files?files=" + files.join(","),
                { httpAgent: agentHttpAgent }
            );

            console.log("=================================");
            console.log("Response from readFiles tool : ", response.data);
            console.log("=================================");

            return JSON.stringify(response.data);

        } catch (error) {

            console.log("=================================");
            console.error("Error in readFiles tool:", error);
            console.log("=================================");

            throw error;
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
export const updateFiles = tool (
    // update-files api 2 cheezein maangti hai 1. File path, 2. Content
    // to ye dono cheezein accept karwani padengi humko ... to neeche ye files naam ka ek array of objects accept karwa re hum... that contains multiple objects ... each object containing a FILE PATH and its CONTENT 
    async ({ files }) => {
        console.log("=================================");
        console.log("Using updateFiles tool with the files : ", files);
        console.log("=================================");

        try {
            console.log("Calling update-files API...");
            const response = await axios.patch(
                "http://sandbox-service-019fccb1-e00c-75a8-8ab3-bbce9266f419:3000/update-files",
                {
                    updates: files
                },
                {
                    httpAgent: agentHttpAgent
                }
            );

            console.log("Returned from update-files API");

            console.log("=================================");
            console.log("Response from updateFiles tool : ", response.data);
            console.log("=================================");

            return JSON.stringify(response.data.results);

        } catch (error) {

            console.log("=================================");
            console.error("Error in updateFiles tool:", error);
            console.log("=================================");

            throw error;
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
