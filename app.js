const express = require("express");

const cors = require("cors");

const prisma = require("./model/prisma");
const app = express();
app.use(cors());
app.use(express.json()); 

app.post("/create", async (req, res) => {
  const timeStamp = Date.now();

  const response = await prisma.user.create({
    data: {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      score: "" + req.body.score,
      totalClick : +req.body.totalClick,
      totalSkip : +req.body.totalSkip,
      createdAt: "" + timeStamp,
      totalTime: "" + req.body.time,
    },
  });

  const picTimes = [];
  for (let i = 1; i <= 30; i++) {
    const picTime = req.body[`pic${i}`];
    picTimes.push(picTime);
  }
  const clickCounts = [];
  for (let i = 1; i <= 30; i++) {
    const clickCount = req.body[`click${i}`];
    clickCounts.push(clickCount);
  }
  const scoreCounts = [];
  for (let i = 1; i <= 30; i++) {
    const scoreCount = req.body[`isCorrect${i}`];
    scoreCounts.push(scoreCount);
  }

  const skipCounts = []
  for (let i = 1; i <= 30; i++){
    const skipCount = req.body[`skip${i}`]
    skipCounts.push(skipCount)
  }
  const afterStoreTime = await prisma.picture.create({
    data: {
      userId: +response.id,

      timeCounts: JSON.stringify(picTimes),
      clickCounts: JSON.stringify(clickCounts),
      scoreCounts: JSON.stringify(scoreCounts),
      skipCounts: JSON.stringify(skipCounts)
    },
  });

  console.log("afterStoreTime", afterStoreTime);
});

app.get("/readAllCandidates", async (req, res) => {
  const response = await prisma.user.findMany();
  return res.status(200).json(response);
});

app.get("/readSingleCandidate", async (req, res) => {
  console.log("readdd", req.query);
  const response = await prisma.picture.findFirst({
    where: {
      userId: +req.query.targetId,
    },
  });
  return res.status(200).json(response);
});

app.get('/readAllPictures', async (req,res)=>{
  const response = await prisma.picture.findMany()

  return res.status(200).json(response)
})

app.listen(4567, () => {
  console.log("Server listening on port 4567");
});
