import jwt from 'jsonwebtoken';
const secretKey = "secretKey";

// Function to assign a JWT token
const assignToken = (payload: any): string => {
  return jwt.sign(payload, secretKey, { expiresIn: '1h' }); // 1-hour expiration, adjust as needed
};

// Function to verify a JWT token
const verifyToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1]; // Extract the token from the "Bearer <token>" format

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // Attach the decoded user information to the request object
    next(); // Move on to the next middleware or route handler
  } catch (error) {
    return res.status(403).json({ error: 'verification failed' });
  }
};

export { assignToken, verifyToken };
