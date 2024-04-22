const express = require('express');

const app = express();
const port = 60023;

const server = app.listen(port, () => {
    const { address, port } = server.address();
    console.log(`Server is running on http://${address}:${port}`);
})