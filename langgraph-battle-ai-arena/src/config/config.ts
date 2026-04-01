import { config } from "dotenv";
config();


// ab config ka jo hum object create karenge iske andar humare paas 3 API keys hone waali hain :-
// GEMINI_API_KEY, MISTRAL_API_KEY and COHERE_API_KEY
// Ab ye jo 3 properties aengi object mein to humko inka type bhi define karna padega kyuki typescript use kar re hum ... to pehle hi "type" ka use karke define kar denge inko :-
type CONFIG = {
    readonly GEMINI_API_KEY: string;
    readonly MISTRAL_API_KEY: string;
    readonly COHERE_API_KEY: string;
}
// Ab kyuki jitni bhi keys hoti hain humari unko humko bas access(read) karna hota hai and hum nahi chaahte ki koi bhi unme changes kar sake to thats why readonly dediya aage humne inke 


// ab config object create karenge :-
const config: CONFIG = {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY || "",
    COHERE_API_KEY: process.env.COHERE_API_KEY || ""
}
export default config