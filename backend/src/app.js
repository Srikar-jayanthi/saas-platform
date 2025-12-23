const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const tenantRoutes = require('./routes/tenantRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/tenants', tenantRoutes);

// Health Check (Mandatory)
app.get('/api/health', (req, res) => {
    res.json({ status: "ok", database: "connected" });
});

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));