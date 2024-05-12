const { spawn } = require("child_process");
const router = require("./usertext");

const createTestQuiz = (req, res) => {
    // const { category, text_id } = req.params;
    // const { someDataFromBody } = req.body;

    // content_match.py 실행
    const pythonProcess = spawn('python', ['/home/t24123/src/v0.5src/ai/content_match.py']);

    let result = '';

    pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        res.status(500).send("An error occurred while processing the request.");
    });

    pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        // 여기서 한 번만 응답을 보냅니다.
        res.json(result);
    });
};

router.post("/", createTestQuiz);

module.exports = router;
