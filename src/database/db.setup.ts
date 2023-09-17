import mongoose from 'mongoose';

// Connect to the MongoDB database
let mongoDBURI;

if (process.env.NODE_ENV === 'test') {
  mongoDBURI = process.env.TEST_MONGODB_URI ?? 'mongodb://localhost:27017';
} else {
  mongoDBURI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017';
}

mongoose.connect(mongoDBURI);
export default mongoose;
