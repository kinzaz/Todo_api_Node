import express from "express";
const app = express();
const port = process.env.SERVER_PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost${port}`);
});
