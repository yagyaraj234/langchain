import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import * as dotenv from "dotenv";

dotenv.config();

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  temperature: 0.7,
});

// From template method to create a prompt
const prompt = ChatPromptTemplate.fromTemplate(`
    You are a professional resume creator and you have built more then 1000 of resume for job seeker in the past 5 years. You are professional in modify experiene points, skills, and education to make the resume more attractive. You are also good at writing cover letters, you help your clients to land job by improving the resume of the candidate

    Here are the details of the job seeker: {input}
    
    `);

// From messages to create a prompt

const prompt2 = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a professional resume creator and you have built more then 1000 of resume for job seeker in the past 5 years. You are professional in modify experiene points, skills, and education to make the resume more attractive. You are also good at writing cover letters, you help your clients to land job by improving the resume of the candidate",
  ],
  ["human", " {input}"],
]);

// console.log(
//   await prompt.format({
//     input:
//       "I am a software engineer with 5 years of experience in web development",
//   })
// );

// Creating chain of prompts

const chain = prompt2.pipe(model);

const response = await chain.invoke({
  input:
    "I am a software engineer with 5 years of experience in web development",
});

console.log(response.content);
