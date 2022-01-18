const { createWorker, createScheduler } = require("tesseract.js");
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["https://www.youtube.com"],
  })
);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/img", async (req, res) => {
  let payload = "";
  //   const startTime = new Date().getTime();

  const scheduler = createScheduler();

  try {
    (async () => {
      for (let i = 0; i < 1; i++) {
        const worker = createWorker();
        await worker.load();
        await worker.loadLanguage("eng+sin");
        await worker.initialize("eng+sin");
        scheduler.addWorker(worker);
      }

      const text = await scheduler.addJob("recognize", req.body.image);
      res.send(JSON.stringify(text.data.text));
      //   const endTime = new Date().getTime();
      //   console.log(`time taken ${(endTime - startTime) / 1000} seconds`);
      await scheduler.terminate();
    })();
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
