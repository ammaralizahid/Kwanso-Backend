import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { assignToken } from '../Utils/SharedFunc';

// Helper function to validate email format
const isEmailValid = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Controller function for user sign-up
const signUp = async (req: Request, res: Response): Promise<Response> => {
  const { name, email, password } = req.body;
  const role = 'Seller'; // Set role to 'Seller' by default

  try {
    const conn = (req as any).conn;
    const User = conn.db.model('Users');
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Validate email format
    if (!isEmailValid(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password should be at least 8 characters long' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData: any = { email, password: hashedPassword, role }; // Include role in user data

    if (name) {
      userData.name = name; // Include name if provided
    }

    const user = await User.create(userData);

    const token = assignToken({ userId: user.id, email: user.email });
    res.setHeader('Authorization', `Bearer ${token}`);

    // Modified response format
    return res.status(201).json({ user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error('Error creating user:', error);
    if ((error as Error).name === 'SequelizeValidationError') {
      const errors = (error as any).errors.map((e: any) => ({ field: e.path, message: e.message }));
      return res.status(400).json({ errors });
    } else {
      return res.status(500).json({ error: 'User creation failed' });
    }
  }
};





// Controller function for user sign-in
const signIn = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  try {
    const conn = (req as any).conn;
    const User = conn.db.model('Users');
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = assignToken({ userId: user.id, email: user.email });
    res.setHeader('Authorization', `Bearer ${token}`);

    return res.status(200).json({ jwt:token });
  } catch (error) {
    console.error('Error signing in user:', error);
    return res.status(500).json({ error: 'Sign-in failed' });
  }
};

// Export the signUp signIn controller function
export { signUp, signIn };
