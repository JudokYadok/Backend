const { spawn } = require("child_process");
const express = require("express");
const router = express.Router();

const createPrevtextQuiz = (req, res) => {
    const { category, text_id } = req.params;
    const { quiz_type } = req.body;

    let pythonScript;
    switch (quiz_type) {
        case 'content_match':
            pythonScript = '/home/t24123/src/v0.9src/ai/content_match.py';
            break;
        case 'content_pattern':
            pythonScript = '/home/t24123/src/v0.9src/ai/content_pattern.py';
            break;
        case 'content_understanding':
            pythonScript = '/home/t24123/src/v0.9src/ai/content_understanding.py';
            break;
        case 'target_comparison':
            pythonScript = '/home/t24123/src/v0.9src/ai/target_comparison.py';
            break;
        case 'all_types':
            pythonScript = '/home/t24123/src/v0.9src/ai/all_types.py';
            break;
        default:
            return res.status(400).json({ error: 'Invalid quiz_type' });
    }

    const pythonProcess = spawn('python', [pythonScript]);

    let result = '';
    let errorOccurred = false; // 에러 발생 여부를 나타내는 변수

    pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
    });

    pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        console.log('Received Data: \n', result);
        console.log(errorOccurred);
        // 파이썬 프로세스가 종료된 후에 에러가 발생하지 않았다면 응답을 보냄
        if (!errorOccurred) {
            try {
                const parsedResponse = JSON.parse(result);
                console.log(parsedResponse);
    
                res.status(200).json(parsedResponse);
            } catch (error) {
                console.error('JSON parsing Error', error);
            }
        }
    });

    pythonProcess.stderr.on('data', (data) => {
        const errorMessage = data.toString();
        if (errorMessage.includes('LangChainDeprecationWarning')) {
            // LangChainDeprecationWarning과 같은 경고 메시지는 무시
            return;
        }
    
        console.error(`stderr: ${errorMessage}`);
        // 에러가 발생했음을 표시
        errorOccurred = true;
    });
};

// // 기출 지문 퀴즈 채점
// const markPrevtextQuiz = (req, res) => {
//     //  
// };

// 기출 지문 퀴즈 저장
const savePrevtextQuiz = (req, res) => {
    // 
};

router.post("/", createPrevtextQuiz);
// router.post("/result", markPrevtextQuiz);
router.post("/save", savePrevtextQuiz);

module.exports = router;