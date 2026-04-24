const express = require('express');
const cors = require('cors');
const hierarchyController = require('./controllers/hierarchyController');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Main endpoint
app.post('/bfhl', hierarchyController.processHierarchy);

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
