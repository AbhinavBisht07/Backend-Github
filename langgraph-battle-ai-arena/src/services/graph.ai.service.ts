import { StateSchema, MessagesValue, StateGraph, START, END } from "@langchain/langgraph";


type JUDGEMENT = {
    winner: "solution_1" | "solution_2";
    solution_1_score: number;
    solution_2_score: number;
}

type AIBATTLESTATE = {
    messages: typeof MessagesValue;
    solution_1: string;
    solution_2: string;
    judgement: JUDGEMENT;
}


const state: AIBATTLESTATE = {
    messages: MessagesValue,
    solution_1: "",
    solution_2: "",
    judgement: {
        winner: "solution_1",
        solution_1_score: 0,
        solution_2_score: 0
    }
}
// humare nodes ke beech mein jitna bhi data transfer hora hota hai wo iss state ki help se hi transfer hora hota hai ..
// starting mein state ki value null hi rehti hai ... fir jese jese workflow aage badhta ha wese wese nodes apne apne hisaab se state ko upate kar rahi hoti hain 