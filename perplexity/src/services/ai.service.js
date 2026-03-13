import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
    // model: "gemini-2.5-flash-lite",
    model: "gemini-2.5-flash",
    apiKey: process.env.GEMINI_API_KEY
});


export async function testAi(){
    await model.invoke("Ok thanks thats all")
    .then((response)=>{
        console.log(response.text)
    })
}