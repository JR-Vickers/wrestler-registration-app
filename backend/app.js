const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

app.use(cors());
app.use(express.json()); // for parsing application/json

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.post('/add-wrestler', async (req, res) => {
  try {
    const { wrestlerName, teamId, classId } = req.body;

    // Check if classId is above 3
    if (classId > 3) {
      return res.status(400).json({ message: 'Invalid classId. Please enter a classId of 1 (heavyweight), 2 (middleweight), or 3 (lightweight).' });
    }

    // Check for duplicate entry
    const duplicateCheck = await pool.query(
    'SELECT * FROM wrestlers WHERE team_id = $1 AND class_id = $2',
    [teamId, classId]
    );

    if (duplicateCheck.rows.length > 0) {
    return res.status(400).json({ message: 'A wrestler from this team is already registered in this weight class.' });
    }

    // Insert new wrestler
    const newWrestler = await pool.query(
    'INSERT INTO wrestlers (wrestler_name, team_id, class_id) VALUES ($1, $2, $3) RETURNING *',
    [wrestlerName, teamId, classId]
    );

    res.json(newWrestler.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to the Wrestling Tournament API!');
});

app.get('/wrestlers', async (req, res) => {
  try {
    console.log('Fetching all wrestlers from the database...');
    const allWrestlers = await pool.query('SELECT * FROM wrestlers');
    console.log('Wrestlers fetched:', allWrestlers.rows);
    res.json(allWrestlers.rows);
  } catch (err) {
    console.error('Error occurred:', err.message);
    res.status(500).send('Server Error');
  }
});
