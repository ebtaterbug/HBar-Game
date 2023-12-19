const express = require('express');
const app = express();
const path = require('path');

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
