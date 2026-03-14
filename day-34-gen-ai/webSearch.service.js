import "dotenv/config"
import { tavily } from "@tavily/core";

const tvly = tavily({
    apiKey: process.env.TAVILY_API_KEY
})

export async function webSearch({query}){
    const response = await tvly.search(query);

    // console.log(response); 

    return response.results.map(r=>{
        return `${r.title}\n${r.url}\n${r.content}\nSource: ${r.url}`
    }).join("\n\n")
} 