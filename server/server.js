import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';

dotenv.config();

const app = express();
app.use(cors());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.get('/api/auth', (req, res) => {
  const client_id = process.env.CLIENT_ID;
  const redirect_uri = process.env.REDIRECT_URI;
  const url = `https://oauth.yandex.com/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}`;
  res.redirect(url);
});

app.get('/api/auth/callback', async (req, res) => {
  const code = req.query.code;
  const client_id = process.env.CLIENT_ID;
  const client_secret = process.env.CLIENT_SECRET;
  const redirect_uri = process.env.REDIRECT_URI;
  try {
    const response = await axios.post('https://oauth.yandex.com/token', {
      grant_type: 'authorization_code',
      code,
      client_id,
      client_secret,
      redirect_uri,
    });
    const token = response.data.access_token;
    req.session.token = token;
    res.redirect('/');
  } catch (error) {
    res.status(500).send({ error: 'Authorization failed' });
  }
});

app.get('/api/auth/token', (req, res) => {
  if (req.session.token) {
    res.send({ token: req.session.token });
  } else {
    res.status(401).send({ error: 'Not authorized' });
  }
});

app.get('/upload', async (req, res) => {
  const { url, token } = req.query;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `OAuth ${token}`,
      },
    });
    res.send(response.data);
  } catch (error) {
    res.status(500).send({ error: 'Upload request failed' });
  }
});

app.put('/upload', async (req, res) => {
  const { url, type, token } = req.query;
  const file = req.body;
  try {
    await axios.put(url, file, {
      headers: {
        'Content-Type': type,
        Authorization: `OAuth ${token}`,
      },
    });
    res.send({ message: 'Upload successful' });
  } catch (error) {
    res.status(500).send({ error: 'Upload failed' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
