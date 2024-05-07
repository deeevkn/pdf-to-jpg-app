import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import clientPromise from '../../../lib/mongodb';

async function register(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
        const client = await clientPromise;
        const db = client.db('yourDatabaseName');

        const { email, password } = req.body;
        const existingUser = await db.collection('users').findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.collection('users').insertOne({
            email,
            password: hashedPassword,
        });

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not defined in your environment variables');
        }

        const token = jwt.sign(
            { userId: result.insertedId, email },
            secret,
            { expiresIn: '2h' }
        );

        res.status(201).json({ token });
        } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.status(405).end();
    }
}

export default register;