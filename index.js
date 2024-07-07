import { ChatGroq } from "@langchain/groq";

import * as dotenv from "dotenv";
dotenv.config();

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  modelName: "mixtral-8x7b-32768",
  temperature: 0.5,
  verbose: true,
});

// Invoke the model by sending a message
const response = await model.invoke("Hello how are you ?");

// Invoke the model by sending multiple messages

// const response = await model.batch(["Hello how are you ?", "I am fine"]);

// console.log(response.content);

// Stream the model by sending a message

const stream = model.streamLog("Hello how are you ?");

for await (const item of stream) {
  console.log(item.ops[0].value.content);
}
