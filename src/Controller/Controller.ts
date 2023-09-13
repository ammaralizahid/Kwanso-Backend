import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const createTask = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const conn = (req as any).conn; // Access 'conn' from the request object
    const Task = conn.db.model('Tasks');

    // Extract user ID from JWT
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authorization token missing' });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, 'secretKey') as { userId: number };
    } catch (error) {
      return res.status(403).json({ error: 'Token verification failed' });
    }

    // Create a new Task in the database
    const task = await Task.create({
      name,
      description,
      user_id: decodedToken.userId, // Use the decoded user ID
    });

    res.status(201).json({ task: { id: task.id, name: task.name } });
  } catch (error) {
    console.error('Error creating Task:', error);
    res.status(500).json({ error: 'Task creation failed' });
  }
};




export const getTask = async (req: Request, res: Response) => {
  try {
    const conn = (req as any).conn; // Access 'conn' from the request object
    const Task = conn.db.model('Tasks');

    // Extract user ID from JWT
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authorization token missing' });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, 'secretKey') as { userId: number };
    } catch (error) {
      return res.status(403).json({ error: 'Token verification failed' });
    }

    // Retrieve tasks where user_id matches the decoded user ID
    const tasks = await Task.findAll({
      attributes: ['id', 'name'],
      where: {
        user_id: decodedToken.userId,
      },
    });

    res.status(200).json({ tasks: tasks });
  } catch (error) {
    console.error('Error getting tasks:', error);
    res.status(500).json({ error: 'Failed to retrieve tasks' });
  }
};


export const getUser = async (req: Request, res: Response) => {
  try {
    const conn = (req as any).conn; // Access 'conn' from the request object
    const User = conn.db.model('Users');

      // Retrieve all categories from the database
      const users = await User.findAll({
          attributes: ['id','name'], // Specify the attributes you want to retrieve
      });

      res.status(200).json({ user: users });
  } catch (error) {
      console.error('Error getting users:', error);
      res.status(500).json({ error: 'Failed to retrieve users' });
  }
};

