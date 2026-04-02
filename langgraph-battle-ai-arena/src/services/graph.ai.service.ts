import { HumanMessage } from "@langchain/core/messages";
import { StateSchema, MessagesValue, ReducedValue, StateGraph, START, END } from "@langchain/langgraph";
import type { GraphNode } from "@langchain/langgraph";
// typescript mein jab hum kaam karte hain to humko jagah jagah pe type batane padte hain cheezon ke(thats why its called typescript)... and agar langchhain mein humko kahin pe type batana hai to langchain mein type batane ke liye hum use kar rahe hote hain zod ka ... to zod ko install krke import kr denge
import { z } from "zod";
import { mistralModel, cohereModel, geminiModel } from "./models.service.js";
import { createAgent, providerStrategy } from "langchain";



const State = new StateSchema({
    messages: MessagesValue,
    solution_1: new ReducedValue(z.string().default(""), {
        reducer: (current, next) => {
            return next
        }
    }),
    solution_2: new ReducedValue(z.string().default(""), {
        reducer: (current, next) => {
            return next
        }
    }),
    judge_recommendation: new ReducedValue(z.object().default({
        solution_1_score: 0,
        solution_2_score: 0,
    }),
        {
            reducer: (current, next) => {
                return next
            }
        }
    )
});


const solutionNode: GraphNode<typeof State> = async (state: typeof State) => {

    const [mistral_solution, cohere_solution] = await Promise.all([
        mistralModel.invoke(state.messages[0].text),
        cohereModel.invoke(state.messages[0].text)
    ])

    return {
        solution_1: mistral_solution.text,
        solution_2: cohere_solution.text,
    }

    // console.log(state.messages);
    // return {
    //     messages: state.messages
    // }
}


const judgeNode: GraphNode<typeof State> = async (state: typeof State) => {
    const { solution_1, solution_2 } = state;

    const judge = createAgent({
        model: geminiModel,
        tools: [],
        responseFormat: providerStrategy(z.object({
            solution_1_score: z.number().min(0).max(10),
            solution_2_score: z.number().min(0).max(10),
        }))
    })

    const judgeResponse = await judge.invoke({
        messages: [
            new HumanMessage(
                `You are a judge tasked with evaluating two solutions to a problem. The problem is: ${state.messages[0].text}. The first Solution is: "${solution_1}". The second Solution is: "${solution_2}". Please provide a score between 0 and 10 for each solution, where 0 means the solution is completely incorrect or irrelevant, and 10 means the solution is perfect and fully addresses the problem.`
            )
        ]
    })

    const result = judgeResponse.structuredResponse

    return{
        judge_recommendation: result
    }
}


const graph = new StateGraph(State)
    .addNode("solution", solutionNode)
    .addNode("judge", judgeNode)
    .addEdge(START, "solution")
    .addEdge("solution", "judge")
    .addEdge("judge", END)
    .compile();
//START node by default rehta hai > "soltion" node humne create kar diya > Fir ek edge create kar diya START node and solution node ke beech mein.
// ab hoga ye ki user input dega start node ko > fir ye input start node se move kar jaega solution node mein ... and ooper hum dekh sakte hain ki solutionNode mein humne state ke messages ko print karwa diya hai 


export default async function (userMessage: string) {
    const result = await graph.invoke({
        messages: [
            new HumanMessage(userMessage)
        ]
    })

    console.log(result)

    return result.messages
}





// import { StateSchema, MessagesValue, StateGraph, START, END } from "@langchain/langgraph";


// type JUDGEMENT = {
//     winner: "solution_1" | "solution_2";
//     solution_1_score: number;
//     solution_2_score: number;
// }

// type AIBATTLESTATE = {
//     messages: typeof MessagesValue;
//     solution_1: string;
//     solution_2: string;
//     judgement: JUDGEMENT;
// }


// const state: AIBATTLESTATE = {
//     messages: MessagesValue,
//     solution_1: "",
//     solution_2: "",
//     judgement: {
//         winner: "solution_1",
//         solution_1_score: 0,
//         solution_2_score: 0
//     }
// }
// humare nodes ke beech mein jitna bhi data transfer hora hota hai wo iss state ki help se hi transfer hora hota hai ..
// starting mein state ki value null hi rehti hai ... fir jese jese workflow aage badhta ha wese wese nodes apne apne hisaab se state ko upate kar rahi hoti hain 