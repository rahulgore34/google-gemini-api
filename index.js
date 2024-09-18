const express = require('express');
const multer = require('multer');
const path = require('path');
const genai = require("@google/generative-ai");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

const genAI = new genai.GoogleGenerativeAI(process.env.API_KEY);
// Serve static files from public folder
app.use(express.static('public'));
// Serve static files from the 'images' directory
app.use('/images', express.static('images'));
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
        const imageParts = [fileToGenerateOart("100rp","image/jpeg")]
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



// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'images/'); // Directory to store images
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      console.log('file.originalname ',file.originalname);
      console.log('file.fieldname ',file.fieldname);
      cb(null, file.originalname); // Save with unique filename
    }
  });
  const upload = multer({ storage: storage });

// Define route for image upload
app.post('/upload', upload.single('image'), async(req, res) => {
    try {
        const comment = req.body.promt;
        console.log('comment ',comment);
        
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const imageParts = [fileToGenerateOart(`./images/${req.file.originalname}`,req.file.mimetype)];
        const prompt = comment ? comment : "Please evaluate or explain content of this image";
        const result = await model.generateContent([prompt, ...imageParts]);
        const res1 = await result.response;
        const text = res1.text();
        res.json({
            answer: text
        });
    } catch (err) {
        console.log(err)
      res.status(500).send('Error uploading image');
    } finally{
        console.log('Finally ');
      
    }
  });



// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


