import { tavily } from "@tavily/core";

const tvly = tavily({
    apiKey: process.env.TAVILY_API_KEY
})


export async function webSearch({query}){
    const response = await tvly.search(query, {
        maxResults: 5,
        searchDepth: "advanced"
    });

    return response.results.map(r=>{
        return `${r.title}\n${r.url}\n${r.content}\nSource: ${r.url}`
    }).join("\n\n")

    // or  :-
    // return JSON.stringify(response.results);
}