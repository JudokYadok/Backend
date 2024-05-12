const express = require("express");
const router = express.Router();
const { spawn } = require("child-process");

const app = express();

const createPrevtextQuiz = (req, res) => {
    const { category, text_id } = req.params;
    const { quiz_type } = req.body;

    let pythonScript;
    switch (quiz_type) {
        case 'content_match':
            pythonScript = '/home/t24123/src/v0.5src/ai/content_match.py';
            break;
        case 'content_pattern':
            pythonScript = '/home/t24123/src/v0.5src/ai/content_pattern.py';
            break;
        case 'content_understanding':
            pythonScript = '/home/t24123/src/v0.5src/ai/content_understanding.py';
            break;
        case 'target_comparison':
            pythonScript = '/home/t24123/src/v0.5src/ai/target_comparison.py';
            break;
        case 'all_types':
            pythonScript = '/home/t24123/src/v0.5src/ai/all_types.py';
            break;
        default:
            return res.status(400).json({ error: 'Invalid quiz_type' });
    }

    const pythonProcess = spawn('python', [pythonScript, category, text_id]);

    pythonProcess.stdout.on('data', (data) => {
        const result = JSON.parse(data);
        res.status(200).json(result);
        console.log(result);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        res.status(500).send("An error occurred while processing the request.");
    });

    pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
};

// 기출 지문 퀴즈 채점
const markPrevtextQuiz = (req, res) => {
    //  
};

// 기출 지문 퀴즈 저장
const savePrevtextQuiz = (req, res) => {
    // 
};

router.post("/", createPrevtextQuiz);
router.post("/result", markPrevtextQuiz);
router.post("/save", savePrevtextQuiz);

module.exports = router;