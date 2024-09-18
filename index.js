const express = require('express');
const genai = require("@google/generative-ai");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const port = 3000;

const genAI = new genai.GoogleGenerativeAI(process.env.API_KEY);

// Middleware to parse JSON bodies
app.use(express.json());

function fileToGenerateOart(path,mimeType) {
    return {
        inlineData:{
            data: Buffer.from(fs.readFileSync(path)).toString('base64'),
            mimeType
        }
    }
}



// GET endpoint
app.post('/get-textanswer', async (req, res) => {
    try {
        const que = req.body.question;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = que;
        const result = await model.generateContent(prompt);
        res.json({
            answer: result?.response?.candidates[0]?.content?.parts[0]?.text || 'Sorry..I don"t know'
        });
    } catch (error) {
        res.send(error.message);
        console.log(error)
    }
});


app.get('/imgdescription', async (req, res1) => {
    try {
        // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const imageParts = [fileToGenerateOart("note.jpeg","image/jpeg")]
        const prompt = "How much rupees is this?";
        const result = await model.generateContent([prompt, ...imageParts]);
        const res = await result.response;
        const text = res.text()
        res1.json({
            answer: text
        });
    } catch (error) {
        res1.send(error.message);
        console.log(error)
    }
});

// POST endpoint
app.post('/post-data', (req, res) => {
    const data = req.body;  // Access data sent in the request body
    res.send(`Hello! This is a POST request with data: ${JSON.stringify(data)}`);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


