import { PDFParse } from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MistralAIEmbeddings } from "@langchain/mistralai";
import dotenv from "dotenv";
dotenv.config();
import { Pinecone } from '@pinecone-database/pinecone'
import fs from 'fs';


const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pc.index('cohort-2-rag');


// let dataBuffer = fs.readFileSync('./story.pdf');

// const parser = new PDFParse(
//     { data: dataBuffer }
// )

// const data = await parser.getText();


const embeddings = new MistralAIEmbeddings({
    apiKey: process.env.MISTRAL_API_KEY,
    model: "mistral-embed"
})

// comment out isliye kiya kyuki ab pdf ko read nahi karwaenge and chunks mein divide bhi nahhi karwaenge .. kyuki ek baar karke database mein bhej diya already
// const splitter = new RecursiveCharacterTextSplitter(
//     {
//         chunkSize: 500, 
//         chunkOverlap: 0
//     }
// )
// const chunks = await splitter.splitText(data.text); 

// const docs = await Promise.all(chunks.map(async (chunk) => {
//     const embedding = await embeddings.embedQuery(chunk)
//     return {
//         text: chunk,
//         embedding
//     }
// }))


// comment out isliye kiya kyuki ek baar bhej di embeddings database mein already
// const result = await index.upsert({
//     records: docs.map((doc, i) => {
//         return (
//             {
//                 id: `doc-${i}`,
//                 values: doc.embedding,
//                 metadata: {
//                     text: doc.text
//                 }
//             }
//         )
//     })
// })
// console.log(result)

const queryEmbedding = await embeddings.embedQuery("How was the internship ?");
// console.log(queryEmbedding);
const result = await index.query({
    vector: queryEmbedding,
    topK: 2,
    includeMetadata: true
})
console.log(result);
console.log(JSON.stringify(result));







// OLD CODE WITH NOTES :-
// import { PDFParse } from "pdf-parse";
// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
// import { MistralAIEmbeddings } from "@langchain/mistralai";
// import dotenv from "dotenv";
// dotenv.config();
// import { Pinecone } from '@pinecone-database/pinecone'
// import fs from 'fs';


// const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
// const index = pc.index('cohort-2-rag');


// let dataBuffer = fs.readFileSync('./story.pdf');

// const parser = new PDFParse(
//     { data: dataBuffer }
// )

// const data = await parser.getText();

// // console.log(data);

// const embeddings = new MistralAIEmbeddings({
//     apiKey: process.env.MISTRAL_API_KEY,
//     model: "mistral-embed"
// })



// // comment out isliye kiya kyuki ab pdf ko read nahi karwaenge and chunks mein divide bhi nahhi karwaenge .. kyuki ek baar karke database mein bhej diya already
// // const splitter = new RecursiveCharacterTextSplitter(
// //     {
// //         chunkSize: 500, // character ke hissaab se chunks banata hai ye .. mtlb 10 characters ka ek chunk hona chahiye... ab kyuki ye characters ke hisaab se split karta hai to 10 bohot chhota number hojaega ... iso thoda bada karenge  
// //         chunkOverlap: 0
// //     }
// // )
// // const chunks = await splitter.splitText(data.text); // resulting data mein jo text tha usko split kar diya chunks mein

// // // console.log(chunks);
// // // console.log(chunks.length);


// // // const docs = await embeddings.embedDocuments(chunks);
// // // object ki trh perform karwana hai inko to docs ka code thoda acche se likhenge:-
// // const docs = await Promise.all(chunks.map(async (chunk) => {
// //     const embedding = await embeddings.embedQuery(chunk)
// //     return {
// //         text: chunk,
// //         embedding
// //     }
// // }))
// // // console.log(docs);


// // comment out isliye kiya kyuki ek baar bhej di embeddings database mein already
// // const result = await index.upsert({
// //     records: docs.map((doc, i) => {
// //         return (
// //             {
// //                 id: `doc-${i}`,
// //                 values: doc.embedding,
// //                 metadata: {
// //                     text: doc.text
// //                 }
// //             }
// //         )
// //     })
// // })
// // console.log(result)