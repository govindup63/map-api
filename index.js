import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3000;

app.use(cors({
  origin: 'http://127.0.0.1',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.get('/time', async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    const timeZoneResponse = await fetch(`http://api.timezonedb.com/v2.1/get-time-zone?key=CS3RP72R3JMP&format=json&by=position&lat=${lat}&lng=${lng}`);
    const timeZoneData = await timeZoneResponse.json();

    if (timeZoneData && timeZoneData.status === 'OK') {
      const timezone = timeZoneData.zoneName;

      const timeResponse = await fetch(`http://worldtimeapi.org/api/timezone/${timezone}`);
      const timeData = await timeResponse.json();

      const dateTime = new Date(timeData.datetime);

      res.json({
        time: dateTime.toLocaleTimeString(),
        timezone: timezone,
        date: dateTime.toLocaleDateString()
      });
    } else {
      res.status(500).json({ error: 'Timezone not found for the given coordinates' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching time or timezone data' });
  }
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
