import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import * as z from "zod";
import { webSearch } from "./webSearch.service.js";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

const geminiModel = new ChatGoogleGenerativeAI({
    // model: "gemini-2.5-flash-lite",
    // model: "gemini-flash-latest",
    model: "gemini-2.5-flash",
    apiKey: process.env.GEMINI_API_KEY
});

const mistralModel = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: process.env.MISTRAL_API_KEY
});


const webSearchTool = tool(
    webSearch,
    {
        name: "searchInternet",
        description: "Search the internet for any information, especially current events, latest news, or anything after 2023. Always use this tool if the answer might require updated information.",
        schema: z.object({
            query: z.string().describe("Search query for the internet")
        })
    }
)

const agent = createReactAgent({
    llm: geminiModel,
    tools: [webSearchTool],
});



export async function generateResponse(messages) {
    // const response = await geminiModel.invoke([
    //     new HumanMessage(messages)
    // ])

    // when we invoke agent we send messages in object format
    const response = await agent.invoke({
        messages: messages.map(msg => {
            if (msg.role === "user") {
                return new HumanMessage(msg.content);
            } else if (msg.role === "ai") {
                return new AIMessage(msg.content);
            }
        })
    })
    // map() function bhi array hi return kkarta hai .. to ab humko response mein ek naya array mil jaega HumanMessage and AIMessage ka

    return response.messages[response.messages.length - 1].content; // Return the text of the last message in the response
}

export async function generateChatTitle(message) {
    const response = await mistralModel.invoke([
        new SystemMessage(`You are a helpful assistant that generates concise and descriptive titles for chat conversations.
        
        User will provide you with the first message of the conversation, and you will generate a title that captures the essence of the conversation in 2-4 words. 
        The title should be clear, relevant, and engaging, giving users a quick understanding of the conversation's topic.
            `),
        new HumanMessage(`Generate a title for a chat conversation based on the following first message: "${message}"`)
    ])

    return response.content;
}




// export async function testAi(){
//     await model.invoke("Ok thanks thats all")
//     .then((response)=>{
//         console.log(response.text)
//     })
// }