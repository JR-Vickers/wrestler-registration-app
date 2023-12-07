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

    // Check if the team exists
    const teamExists = await pool.query('SELECT * FROM teams WHERE team_id = $1', [teamId]);

    // If the team doesn't exist, create it
    if (teamExists.rowCount === 0) {
      await pool.query('INSERT INTO teams (team_id) VALUES ($1)', [teamId]);
    }

    // Check for duplicate entry
    const duplicateCheck = await pool.query(
    'SELECT * FROM wrestlers WHERE team_id = $1 AND class_id = $2',
    [teamId, classId]
    );

    if (duplicateCheck.rows.length > 0) {
    return res.status(400).json({ message: 'A wrestler from this team is already registered in this weight class.' });
    }

    // check if the class is full (16 wrestlers)
    const classCount = await pool.query(
      'SELECT COUNT(*) FROM wrestlers WHERE class_id = $1',
      [classId]
    );

    if (parseInt(classCount.rows[0].count) >= 16) {
      return res.status(400).json({ message: 'This weight class is already full.' });
    }

    // Insert new wrestler
    const newWrestler = await pool.query(
    'INSERT INTO wrestlers (wrestler_name, team_id, class_id) VALUES ($1, $2, $3) RETURNING *',
    [wrestlerName, teamId, classId]
    );

    res.json(newWrestler.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});


// TODO: update password security via hashing
app.post('/login', async (req, res) => {
  const { password } = req.body;
  const storedPassword = 'password'; // This should be retrieved from your database

  if (password === storedPassword) {
    res.json({ success: true, token: 'simpleToken123' }); // For the full app, generate a secure token
  } else {
    res.status(401).json({ success: false, message: 'Invalid password' });
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to the Wrestling Tournament API!');
});

app.get('/wrestlers', async (req, res) => {
  try {
    const allWrestlersWithDetails = await pool.query(
      'SELECT w.wrestler_id, w.wrestler_name, w.team_id, t.team_name, c.class_name ' +
      'FROM wrestlers w ' +
      'JOIN teams t ON w.team_id = t.team_id ' +
      'JOIN weight_classes c ON w.class_id = c.class_id'
    );
    res.json(allWrestlersWithDetails.rows);
  } catch (err) {
    console.error('Error occurred:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.get('/weight-classes', async (req, res) => {
  try {
    const allClasses = await pool.query('SELECT * FROM weight_classes');
    res.json(allClasses.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.get('/teams', async (req, res) => {
  try {
    const allTeams = await pool.query('SELECT team_id, team_name FROM teams');
    res.json(allTeams.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});