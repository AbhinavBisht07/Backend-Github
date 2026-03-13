import "dotenv/config"
import readline from "readline/promises" //readline/promises kar dete hain yahan pe to aage promises create nahi karne padte humko ..
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage } from "langchain";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const model = new ChatMistralAI({
    model: "mistral-small-latest",
})

const messages = [];


while (true) { 
    const userInput = await rl.question("\x1b[32mYou:\x1b[0m ");

    messages.push(new HumanMessage(userInput));

    // exit condition :- 
    if (userInput.toLowerCase() === "exit") {
        console.log("\x1b[31mChat ended\x1b[0m");
        rl.close();
        break;
    }

    const response = await model.invoke(messages);
    
    messages.push(response);

    console.log(`\x1b[34m[AI Chatbot:]\x1b[0m ${response.content}`);
}



// 4th:-
// // ab ye jo infinite while loop create kia tha humne .. hum isme "You :" and "AI chatbot" ko thoda colorful format mein bhi kar sakte display .. terminal mein ... by updating our console.log code and jo .question() ke andar ka hai usko bhi update karenge:-
// while (true) { // infinite loop
//     const userInput = await rl.question("\x1b[32mYou:\x1b[0m ");

//     // exit condition :- type exit to end the chat
//     if (userInput.toLowerCase() === "exit") {
//         console.log("\x1b[31mChat ended\x1b[0m");
//         rl.close();
//         break;
//     }

//     const response = await model.invoke(userInput);

//     console.log(`\x1b[34m[AI Chatbot:]\x1b[0m ${response.content}`);
// }
// // we can print “Chat ended” in red using ANSI escape codes (same way you colored You: and AI Chatbot:).



//3rd :-
// while (true) { //infinite loop
//     const userInput = await rl.question("You: ");

//     // exit condition :- type exit to end the chat
//     if (userInput.toLowerCase() === "exit") {
//         console.log("Chat ended");
//         rl.close();
//         break;
//     }

//     const response = await model.invoke(userInput);

//     console.log(`AI Chatbot: ${response.content}`);
// }




//2nd
// const response= await model.invoke("What is the capital of India? Under 10 words");
// console.log(response.text);

// rl.close();



//1st
// rl.question("What is your name? ", (name) => {
//     console.log(`Hello ${name}`);
//     rl.close();
// })