import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/upload', async (req, res) => {
  try {
    const response = await axios({
      method: 'get',
      url: req.query.url,
      headers: { Authorization: `OAuth ${req.query.token}` },
      responseType: 'stream',
    });

    response.data.pipe(res);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put('/upload', async (req, res) => {
  try {
    const response = await axios({
      method: 'put',
      url: req.query.url,
      data: req,
      headers: {
        'Content-Type': req.query.type,
        Authorization: `OAuth ${req.query.token}`,
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    res.send(response.data);
  } catch (error) {
    res.status(500).send(error);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
