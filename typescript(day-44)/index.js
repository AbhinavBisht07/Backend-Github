"use strict";
// console.log("hello")
// const a = "world"
// const b = 5;
// console.log(a+b); // world5 miljaega output .. addition to support kar diya isne string and number ka 
// console.log(a-b); // Subtraction mein ek error mil jaega :-
// index.ts:8:13 - error TS2362: The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type. 
// console.log(a*b)
// Primitive datatypes :-
// string, number, boolean, array, tuple(array jesa hota hai but inme difference hota hai), void & never(inn dono ke beech ke difference ko padhna rahega humko ...)
// hum variables ke datatypes ko define kar sakte hain typescript mein kuch ese :-
// const a: string = "hello"; 
// const b: string = 123; // ye error dega kyuki humne b ko pehle define kar diya ki wo ek string hoga and then hum usme value ek number ki de rahe
// console.log(b); // error :- index.ts:20:7 - error TS2322: Type 'number' is not assignable to type 'string'.
// Array and Tuple 
// Array can be defined in 2 ways :-
// const a: Array<number> = [1,2] ; // this means a is an Array of numbers
// const b: number[] = [3,4] // this means b is a numbers' Array
// kaan ulte hath se pakdo ya seedhe hath se baat barabar hai ...
// a.push(34);
// console.log(a);
// ab agar hum b mein .. jo ki ek array of numbers hai ... usme ek string push karein to error aega 
// b.push("hello");
// console.log(b); //error :- index.ts:35:8 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
// Ab jo humne ooper pe kara wo humne array define kara ... ki ye array numbers ka hoga ... but hum ye define nahi kar rahe the ki uss array mein kitne numbers aa sakte hain .... to hum ek array mein kitne bhi numbers push kar sakte hain mtlb ...
// Ab yahan pe aata hai TUPLE .... ek tuple mein hum type to define karte hi hain but ye bhi define karte hain ki kitne elements aenge uske andar ..
// const a: [number, number, number] = [1,2,5];
// const b: [number, string, number] = [1, "Hello World", 5];
// Array :- fixed type but not the length.
// Tuple :- fixed type and length.
// Void & Never :-
// function greet(name:string){
//     console.log(`Hello ${name}`)
// }
// greet("Abhinav");
// abhi iss function mein kuch return nahi kara rahe hum ... bas kuch console karwa rahe hain ... to by default iss function ka type rahega :- void 
// iss function ko ese bhi likh sakte hain :-
// function greet(name:string):void{
//     console.log(`Hello ${name}`)
// }
// greet("Abhinav");
// but suppose humko console nahi karwana kuch return karwana hai to humko jiss datatype ki cheez return karwani hai... function ka type wahi dena padega void ke jagah :-
// function greet(name:string):string{
//     return `Hello ${name}`
// }
// console.log(greet("Abhinav"));
// ab jese iss function ka type humne string define kar diya .. ab hum agar ek number ya kuch bhi alag datatype ki value return karenge iske andar se to error aega ...
// ab never ka use hum tab karte hain jab humko pata hai humara function kabhi khatam hi nahi hoga .... 
// kabhi khatam hi nahi hoga mtlb ? ... mtlb ye kabhi kuch return hi nahi karega .... khatam hone se pehle hi kuch error throw kar dega ye ..
// to ese function ka type hum dete hain :- never
// function greet(name:string): never{
//     throw new Error("Something went wrong !");
// }
// greet("Abhinav");
// ab humne void and never samajh liya .... ab humko ek keyword smjhna rahega ... uska naam hai :- type
// const user = {
//     name: "test",
//     age: 34,
//     isMale: true
// }
// function greet(data){
//     console.log(`Hello ${data.name}, your age is ${data.age}`)
// }
// greet(user)
// jab humne sirf itna likha tha hum dekh sakte hain ki parameter data mein kuch error aarha hai ... wo keh ra hai :- Parameter 'data' implicitly has an 'any' type.
// ab esa isliye hora hai kyuki typescript mein humko hamesha parameters ke type define karne hote hain agar nahi karenge to error aega ..
// kuch iss tarah se define karenge hum :-
// function greet(data: {name: string, age: number, isMale: boolean}){
//     console.log(`Hello ${data.name}, your age is ${data.age}.`)
// }
// greet(user)
// ab dekho koi error nahi aarha hai 
// ab jo humne parameters ko define karne ke liye itni badi line likh di thi isko avoid karne ke liye hum kuch aur bhi likh sakte hain iski jagah .. hum type ko pehle hi declare kar denge :-
// type keyword yahan pe kaam aata hai :-
// type USER = { name: string, age: number, isMale: boolean }
// // yahan pe jo user declare karenge uska type bhi USER hoga
// const user: USER = {
//     name: "test",
//     age: 34,
//     isMale: true
// }
// // yahan pe data ka type bhi USER set kar denge
// function greet(data: USER): void {
//     console.log(`Hello ${data.name}, your age is ${data.age}.`)
// }
// greet(user)
// Inke baad humare paas 2 types aur hote hain :- any & unknown 
// any :- any bole to hum bas variable ko declare kar de rahe hain and koi commitment nahi de rahe pinpoint karke ki bhyi yahi hoga iska datatype ...
// fir ja bhi first value de rahe hain usko uske basis pe type decide ho ja raha hai uska ..
// iska mtlb yahi hoa hai ki jo itne saare datatypes the humare unme se kuch bhi ho sakta hai datatype variable ka ..
// let a: any;
// a = "hello"
// console.log(a);  
// console.log(a.toUpperCase());  
// but iske sath ek dikkat ye hai ki suppose humne a ki value ek number dedi lekin console.log karte time a ko tUpperCase() kar diya 
// let a: any;
// a = 123;  
// console.log(a.toUpperCase());
// ab hum dekhene ki run time mein error aegi .... but hum screen mein clearly dekh sakte hain ki compile time mein koi error nahi aarhi hai 
// ye error typescript mein nahi aarhi ... ye error humari javascript file mein aarhi hai (runtime error) .... typescript to isko clear hari jhandi dikha ke aage bhej de rahi hai 
// error :- file:///C:/Users/Abhinav%20Bisht/Desktop/COHORT%202.0/3.Back-End/Backend-Github/typescript/index.js:98
// isi dikkat ko solve karke deta hai unknown :-
// Lekin abhi to complie time error aaraha(typescript error deraha) ki "a is of type unknown" 
// let a: unknown;
// a = 123;
// console.log(a.toUpperCase());
// unknow bolta hai ki theek hai jiss bhi datatype ka data store karna hai variable mein wo kar lo aap ... LEKIN USS VARIABLE KO USE KARNE SE PEHLE AAPKO CHECK JARUR LAGANA PADEGA :-
let a;
a = 123;
if (typeof a === "string") {
    console.log(a.toUpperCase());
}
// dekho ab compile time error nahi aarha
