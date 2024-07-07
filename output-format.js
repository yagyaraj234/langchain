import { ChatGroq } from "@langchain/groq";
import {
  StringOutputParser,
  CommaSeparatedListOutputParser,
} from "@langchain/core/output_parsers";

import { StructuredOutputParser } from "langchain/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import * as dotenv from "dotenv";
import { resumeInput } from "./prompt.js";

dotenv.config();

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  temperature: 0.7,
});

// String output parser

async function stringOutput() {
  const prompt = ChatPromptTemplate.fromTemplate(`
        You are a professional resume creator and you have built more then 1000 of resume for job seeker in the past 5 years. You are professional in modify experiene points, skills, and education to make the resume more attractive. You are also good at writing cover letters, you help your clients to land job by improving the resume of the candidate
    
        Here are the details of the job seeker: {input}
        
        `);

  const outputParser = new StringOutputParser();

  const chain = prompt.pipe(model).pipe(outputParser);

  const response = await chain.invoke({
    input:
      "I am a software engineer with 5 years of experience in web development",
  });

  console.log(response);
}

// stringOutput();

// JSON output parser

async function jsonOutput() {
  const prompt = ChatPromptTemplate.fromTemplate(`
        You are a professional resume creator and you have built more then 1000 of resume for job seeker in the past 5 years. You are professional in modify experiene points, skills, and education to make the resume more attractive. You are also good at writing cover letters, you help your clients to land job by improving the resume of the candidate. list out 10 most important skills for the job seeker as a software developer
    
        Here are the details of the job seeker: {input}
        
        `);

  const outputParser = new CommaSeparatedListOutputParser();

  const chain = prompt.pipe(model).pipe(outputParser);

  const response = await chain.invoke({
    input:
      "I am a software engineer with 5 years of experience in web development",
  });

  console.log(response);
}

// jsonOutput();

// Structured output parser

async function structuredOutput() {
  const prompt = ChatPromptTemplate.fromTemplate(`
      

      Extract name , email, phone number,address and work experience of the job seeker.

      If there is no information available for any of the fields, please leave it blank.

      Formatting Instructions: {format}
      \n\n
      User the following text as input: {input} 
        `);

  const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
    name: "the name of the job seeker",
    email: "the email of the job seeker",
    phone: "the phone number of the job seeker",
    address: "the address of the job seeker",
    github: "the github of the job seeker",
    workExperience: "the work experience of the job seeker",
  });

  const chain = prompt.pipe(model).pipe(outputParser);

  const response = await chain.invoke({
    input: resumeInput,
    format: "name, email, phone,github, address, workExperience",
  });

  console.log(response);
}

// structuredOutput();

async function structuredZodFormat() {
  const prompt = ChatPromptTemplate.fromTemplate(`
        
    
        Extract name , email, phone number,address and work experience with company Name ,start date, end date, points etc. of the job seeker.
    
        If there is no information available for any of the fields, please leave it blank.
    
        Formatting Instructions: {format}
        \n\n
        User the following text as input: {input} 
            `);

  const outputParser = StructuredOutputParser.fromZodSchema(
    z.object({
      name: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
      github: z.string().optional(),
      Experience: z.array(
        z.object({
          title: z.string().optional(),
          company: z.string().optional(),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
          description: z.string().optional(),
          experience_points: z.array(z.string()).optional(),
        })
      ),
    })
  );

  const formatUserInput = ChatPromptTemplate.fromTemplate(`
        Format the following text: {input} to llm understandble format 
        `);

  const formatChain = formatUserInput.pipe(model);
  const formatedInput = await formatChain.invoke({
    input: resumeInput,
  });

  console.log(formatedInput);

  const chain = prompt.pipe(model).pipe(outputParser);

  const response = await chain.invoke({
    input: formatedInput.content,
    format: "name, email, phone,github, address, Experience",
  });

  console.log(response);
}

// structuredZodFormat();

async function structuredOutput2() {
  const prompt = ChatPromptTemplate.fromTemplate(`
    Extract name, email, phone number, address, github, and work experience of the job seeker.

    If there is no information available for any of the fields, please leave it blank.

    Formatting Instructions: {format}
    \n\n
    Use the following text as input: {input} 
  `);

  const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
    name: "the name of the job seeker",
    email: "the email of the job seeker",
    phone: "the phone number of the job seeker",
    address: "the address of the job seeker",
    github: "the github of the job seeker",
    workExperience: "the work experience of the job seeker",
  });

  const chain = prompt.pipe(model).pipe(outputParser);

  try {
    const response = await chain.invoke({
      input: resumeInput,
      format: "name, email, phone, github, address, workExperience",
    });

    // Ensure all fields are present, defaulting to empty string if missing
    const result = {
      name: response.name || "",
      email: response.email || "",
      phone: response.phone || "",
      address: response.address || "",
      github: response.github || "",
      workExperience: response.workExperience || "",
    };

    console.log(result);
    return result;
  } catch (error) {
    console.error("Error processing resume:", error);
    // Return object with all fields as empty strings if an error occurs
    return {
      name: "",
      email: "",
      phone: "",
      address: "",
      github: "",
      workExperience: "",
    };
  }
}

// structuredOutput2();
