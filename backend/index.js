const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const fetch = require('node-fetch');

dotenv.config();    
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k2nj4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const database = client.db('Assignment-10');
        const equipmentCollection = database.collection('equipments');
        const votesCollection = database.collection('votes'); // New collection for votes

        // Create index for votes collection
        await votesCollection.createIndex({ userId: 1 });

        // ========== VOTING ENDPOINTS ========== //
        app.post('/api/votes', async (req, res) => {
            try {
                const { userId, userName, vote, intensity } = req.body;

                if (!userId || !userName || !vote || !intensity) {
                    return res.status(400).json({ message: 'All fields are required' });
                }

                const newVote = {
                    userId,
                    userName,
                    vote,
                    intensity,
                    timestamp: new Date()
                };

                const result = await votesCollection.insertOne(newVote);
                res.status(201).json({
                    message: 'Vote submitted successfully',
                    voteId: result.insertedId
                });
            } catch (err) {
                console.error('Vote submission error:', err);
                res.status(500).json({ message: 'Server error' });
            }
        });

        app.get('/api/votes', async (req, res) => {
            try {
                const cursor = votesCollection.find().sort({ timestamp: -1 });
                const votes = await cursor.toArray();
                res.json(votes);
            } catch (err) {
                console.error('Error fetching votes:', err);
                res.status(500).json({ message: 'Server error' });
            }
        });

        app.get('/api/votes/:userId', async (req, res) => {
            try {
                const userId = req.params.userId;
                const query = { userId };
                const vote = await votesCollection.findOne(query);
                
                if (!vote) {
                    return res.status(404).json({ message: 'No vote found for this user' });
                }
                
                res.json(vote);
            } catch (err) {
                console.error('Error fetching user vote:', err);
                res.status(500).json({ message: 'Server error' });
            }
        });

       

        
    } finally {
        // Client cleanup handled elsewhere
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Backend connected')
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await client.close();
    process.exit();
});