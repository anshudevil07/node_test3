

const express = require('express');
const bodyParser = require('body-parser');
const { connect, getDb } = require('./db');

const app = express();
const port = 3000; // Replace with your desired port number

app.use(bodyParser.json());

// GET /students
app.get('/',(req,res)=>{
    res.send("HEy Whatsip!!")
})
app.get('/students', async (req, res) => {
  const studentsCollection = getDb().collection('students');
  const students = await studentsCollection.find().toArray();
  res.json(students);
});

// GET /students/:id
app.get('/students/:id', async (req, res) => {
  const studentId = req.params.id;
  const studentsCollection = getDb().collection('students');
  const student = await studentsCollection.findOne({ id: studentId });
  
  if (student) {
    res.json(student);
  } else {
    res.status(404).json({ error: 'Student not found' });
  }
});

// POST /students
app.post('/students', async (req, res) => {
  const student = req.body;
  const studentsCollection = getDb().collection('students');

  try {
    const result = await studentsCollection.insertOne(student);
    res.json(result.ops[0]);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the student' });
  }
});

// PUT /students/:id
app.put('/students/:id', async (req, res) => {
  const studentId = req.params.id;
  const updatedStudent = req.body;
  const studentsCollection = getDb().collection('students');

  try {
    const result = await studentsCollection.updateOne({ id: studentId }, { $set: updatedStudent });

    if (result.matchedCount === 0) {
      res.status(404).json({ error: 'Student not found' });
    } else {
      res.json(updatedStudent);
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the student' });
  }
});

// DELETE /students/:id
app.delete('/students/:id', async (req, res) => {
  const studentId = req.params.id;
  const studentsCollection = getDb().collection('students');

  try {
    const result = await studentsCollection.deleteOne({ id: studentId });

    if (result.deletedCount === 0) {
      res.status(404).json({ error: 'Student not found' });
    } else {
      res.json({ message: 'Student deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the student' });
  }
});

// Start the server
connect().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
