const { spawn } = require("child_process");
const express = require('express');
const router = express.Router();

const createTestQuiz = (req, res) => {
    // content_match.py 실행
    const query = `
      SELECT contents
      FROM text
      WHERE text_id = 2
  `;
    let text = '';

    // 데이터베이스에서 쿼리 실행
    req.conn.query(query, (err, textfile) => {
        if (err) {
            console.error('Error executing query:', err);
            return;
        }
        // 쿼리 결과에서 텍스트 가져오기
        text = textfile[0].contents;

        const pythonProcess = spawn('python', ['/home/t24123/src/v0.9src/ai/content_match.py', text]);

        let quiz = '';
        let errorOccurred = false; // 에러 발생 여부를 나타내는 변수

        pythonProcess.stdout.on('data', (data) => {
            quiz += data.toString();
        });

        pythonProcess.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            console.log('Received Data: \n', quiz);
            console.log(errorOccurred);
            // 파이썬 프로세스가 종료된 후에 에러가 발생하지 않았다면 응답을 보냄
            if (!errorOccurred) {
                try {
                    const parsedResponse = JSON.parse(quiz);
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
    });
};

router.post("/", createTestQuiz);

module.exports = router;
