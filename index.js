import { ChatGroq } from "@langchain/groq";

import * as dotenv from "dotenv";
dotenv.config();

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
});

const response = await model.invoke("Hello how are you ?");

console.log(response.content);
