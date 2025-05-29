import express from "express";
import {createClient} from "redis";
import cors from "cors";

const app = express();
const port = parseInt(process.env.PORT ?? '3000', 10);

const redis = await createClient({url: process.env.REDIS_URL})
    .on("error", (err) => console.log("Redis Client Error", err))
    .on('ready', () => console.log('Redis Client Ready'))
    .connect()
;


app.use(cors({origin: true}));

app.get('/', (req, res) => res.redirect('http://localhost'));

app.get('/homepage', async (req, res) => {
  // Adding delay to show loader/pre-rendering on frontend
  setTimeout(async () => {
    if (redis.isReady && await redis.exists('homepage')) {
      const post = await redis.get('homepage');

      res.setHeader('Content-Type', 'application/json');
      return res.send(post);
    }

    const resp = await fetch('http://wordpress/wp-json/wp/v2/posts');
    const post = await resp.json().then(x => x[0]);
    if (redis.isReady) {
      await redis.set('homepage', JSON.stringify(post));
    }

    res.json(post);
  }, 2000);
});

app.get('/reset-variant', (req, res) => {
  res.clearCookie('ab_variant');

  res.redirect("http://localhost")
})

app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});