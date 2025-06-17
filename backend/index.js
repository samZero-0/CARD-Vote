const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

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
        const database = client.db('CARD');
        
        const usersCollection = database.collection('Users');
        const votesCollection = database.collection('Votes'); 

        await usersCollection.createIndex({ uid: 1 }, { unique: true });
        await usersCollection.createIndex({ email: 1 }, { unique: true });
        await votesCollection.createIndex({ voterId: 1 });
        await votesCollection.createIndex({ voterEmail: 1 });
        await votesCollection.createIndex({ participantId: 1 });

        // ========== USERS ENDPOINTS ========== //
        app.post('/users', async (req, res) => {
            try {
                const { name, email, photo, role, uid } = req.body;

                if (!name || !email || !uid) {
                    return res.status(400).json({ message: 'Name, email, and uid are required' });
                }

                const existingUser = await usersCollection.findOne({ 
                    $or: [{ uid }, { email }] 
                });

                if (existingUser) {
                    const updateData = {
                        name,
                        photo,
                        role: role || "student",
                        lastLogin: new Date()
                    };

                    await usersCollection.updateOne(
                        { uid },
                        { $set: updateData }
                    );

                    return res.status(200).json({
                        message: 'User updated successfully',
                        user: { ...existingUser, ...updateData }
                    });
                }

                const newUser = {
                    name,
                    email,
                    photo: photo || null,
                    role: role || "student",
                    uid,
                    createdAt: new Date(),
                    lastLogin: new Date()
                };

                const result = await usersCollection.insertOne(newUser);
                res.status(201).json({
                    message: 'User created successfully',
                    user: { ...newUser, _id: result.insertedId }
                });

            } catch (err) {
                console.error('User save error:', err);
                
                if (err.code === 11000) {
                    return res.status(409).json({ 
                        message: 'User already exists with this email or uid' 
                    });
                }
                
                res.status(500).json({ message: 'Server error while saving user' });
            }
        });

        app.get('/users', async (req, res) => {
            try {
                const cursor = usersCollection.find().sort({ createdAt: -1 });
                const users = await cursor.toArray();
                res.json(users);
            } catch (err) {
                console.error('Error fetching users:', err);
                res.status(500).json({ message: 'Server error' });
            }
        });

        app.get('/users/:uid', async (req, res) => {
            try {
                const uid = req.params.uid;
                const user = await usersCollection.findOne({ uid });
                
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                
                res.json(user);
            } catch (err) {
                console.error('Error fetching user:', err);
                res.status(500).json({ message: 'Server error' });
            }
        });

        app.put('/users/:uid', async (req, res) => {
            try {
                const uid = req.params.uid;
                const { name, photo } = req.body;

                const updateData = {
                    ...(name && { name }),
                    ...(photo && { photo }),
                    updatedAt: new Date()
                };

                const result = await usersCollection.updateOne(
                    { uid },
                    { $set: updateData }
                );

                if (result.matchedCount === 0) {
                    return res.status(404).json({ message: 'User not found' });
                }

                res.json({ message: 'User updated successfully' });
            } catch (err) {
                console.error('Error updating user:', err);
                res.status(500).json({ message: 'Server error' });
            }
        });

        // ========== VOTING ENDPOINTS ========== //
        app.post('/api/votes', async (req, res) => {
            try {
                const { voterId, voterName, voterEmail, participantId, participantName, vote, intensity } = req.body;

                if (!voterId || !voterName || !voterEmail || !participantId || !participantName || !vote || !intensity) {
                    return res.status(400).json({ message: 'All fields are required' });
                }

                const user = await usersCollection.findOne({ uid: voterId });
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }

                const existingVote = await votesCollection.findOne({ 
                    voterId,
                    participantId
                });
                
                if (existingVote) {
                    return res.status(409).json({ 
                        message: 'You have already voted for this participant' 
                    });
                }

                const newVote = {
                    voterId,
                    voterName,
                    voterEmail,
                    participantId,
                    participantName,
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
                res.status(500).json({ message: 'Server error while submitting vote' });
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

        app.get('/api/votes/user/:userId', async (req, res) => {
            try {
                const userId = req.params.userId;
                const votes = await votesCollection.find({ voterId: userId }).toArray();
                res.json(votes);
            } catch (err) {
                console.error('Error fetching user votes:', err);
                res.status(500).json({ message: 'Server error' });
            }
        });

        app.get('/api/participants/available/:userId', async (req, res) => {
            try {
                const userId = req.params.userId;
                
                const allParticipants = [
                    {
                        id: 1,
                        name: 'John Doe',
                        role: 'Software Engineer',
                        avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
                    },
                    {
                        id: 2,
                        name: 'Jane Smith',
                        role: 'Product Manager',
                        avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
                    },
                    {
                        id: 3,
                        name: 'Robert Johnson',
                        role: 'UX Designer',
                        avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
                    },
                    {
                        id: 4,
                        name: 'Emily Davis',
                        role: 'Data Scientist',
                        avatar: 'https://randomuser.me/api/portraits/women/4.jpg'
                    },
                    {
                        id: 5,
                        name: 'Michael Wilson',
                        role: 'DevOps Engineer',
                        avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
                    },
                    {
                        id: 6,
                        name: 'Sarah Brown',
                        role: 'Frontend Developer',
                        avatar: 'https://randomuser.me/api/portraits/women/6.jpg'
                    },
                    {
                        id: 7,
                        name: 'David Taylor',
                        role: 'Backend Developer',
                        avatar: 'https://randomuser.me/api/portraits/men/7.jpg'
                    },
                    {
                        id: 8,
                        name: 'Jessica Martinez',
                        role: 'QA Engineer',
                        avatar: 'https://randomuser.me/api/portraits/women/8.jpg'
                    }
                ];

                const userVotes = await votesCollection.find({ voterId: userId }).toArray();
                const votedParticipantIds = userVotes.map(vote => vote.participantId);

                const availableParticipants = allParticipants.filter(
                    participant => !votedParticipantIds.includes(participant.id)
                );

                res.json(availableParticipants);
            } catch (err) {
                console.error('Error fetching available participants:', err);
                res.status(500).json({ message: 'Server error' });
            }
        });

        // ========== ADMIN ENDPOINTS ========== //
        app.get('/api/admin/stats', async (req, res) => {
            try {
                const totalUsers = await usersCollection.countDocuments();
                const totalVotes = await votesCollection.countDocuments();
                
                const voteStats = await votesCollection.aggregate([
                    {
                        $group: {
                            _id: "$vote",
                            count: { $sum: 1 }
                        }
                    }
                ]).toArray();

                res.json({
                    totalUsers,
                    totalVotes,
                    voteDistribution: voteStats
                });
            } catch (err) {
                console.error('Error fetching stats:', err);
                res.status(500).json({ message: 'Server error' });
            }
        });

        console.log("Successfully connected to MongoDB!");
        
    } finally {
        // Client cleanup handled elsewhere
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('CARD 2025 - 3 Minute Thesis Voting Backend Connected');
});

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date(),
        service: 'CARD 2025 Backend'
    });
});

app.listen(port, () => {
    console.log(`CARD 2025 Backend is running on port: ${port}`);
});