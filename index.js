import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3000;

app.use(cors({
  origin: '*', // Allow requests from any origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // If you want to allow cookies, set this to true
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
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const localTime = new Date((currentTimestamp + timeZoneData.gmtOffset) * 1000);

      res.json({
        time: localTime.toLocaleTimeString('en-US', { timeZone: 'UTC' }),
        timezone: timezone,
        date: localTime.toLocaleDateString('en-US', { timeZone: 'UTC' })
      });
    } else {
      res.status(500).json({ error: 'Timezone not found for the given coordinates' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error fetching time or timezone data' });
  }
});
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
