import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import clientPromise from '../../../lib/mongodb';

async function login(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
        const client = await clientPromise;
        const db = client.db('yourDatabaseName');

        const { email, password } = req.body;
        const user = await db.collection('users').findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not defined in your environment variables');
        }

        const token = jwt.sign(
            { userId: user._id, email },
            secret,
            { expiresIn: '2h' }
        );

        res.status(200).json({ token });
        } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.status(405).end();
    }
}

export default login;