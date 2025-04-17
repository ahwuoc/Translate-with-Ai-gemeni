import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyC-9fsF6UiYjxUw3IApBNMBGYb3TglW3hs");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const run = async (content) => {
  const prompt = `
Hãy phát hiện ngôn ngữ của đoạn văn sau và dịch nó sang tiếng Việt một cách chính xác, tự nhiên và đúng ngữ cảnh:

"${content}"
`;
  const result = await model.generateContent(prompt);
  const response = result.response;
  console.log(response.text());
};

run("Hi, how are you doing? I'm currently working on my project.");
