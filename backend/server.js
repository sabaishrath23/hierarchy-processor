const express = require('express');
const cors = require('cors');
const hierarchyController = require('./controllers/hierarchyController');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Main endpoint
app.post('/bfhl', hierarchyController.processHierarchy);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
