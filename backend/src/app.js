const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const tenantRoutes = require('./routes/tenantRoutes');
const projectRoutes = require('./routes/projectRoutes');

const app = express();
app.use(cors());
app.use(express.json());


// Health Check (Mandatory)
app.get('/api/health', (req, res) => {
    res.json({ status: "ok", database: "connected" });
});

app.use('/api/auth', authRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/projects', projectRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));