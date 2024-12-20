import jwt from 'jsonwebtoken';
const secret = "a$T8#fGz!x7%kH4q";
import { invalidatedTokens } from '../controllers/logoutController.js';

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Get the token from the Authorization header
  //console.log("from verifyToken: ",token);
  if (!token) {
    //console.log("where", token);
    return res.status(401).json({ message: 'No token provided' });
  }

  if (invalidatedTokens.has(token)) {
    return res.status(401).json({ error: 'Token is invalid or has been logged out' });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token is not valid' });
    }
    //console.log('Decoded Token:', decoded); 

    // Attach user info to the request object
    req.user = {
      userId: decoded.userId, // Extract userId from the payload
      role: decoded.role ,      // Extract role from the payload
      username: decoded.username
    };
    //console.log('req.user:', req.user); 

    // Call next() to proceed to the next middleware or route handler
    next();
  });
};
export default verifyToken; // Export the function for use in other files
