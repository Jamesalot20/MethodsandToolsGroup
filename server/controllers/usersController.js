const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      role: role || 'buyer', // Set role from request body, default to 'buyer'
    });

    await newUser.save();
    res.status(201).json({ message: 'User successfully registered.' });

  } catch (error) {
    console.error("Error in registerUser:", error);
  res.status(500).json({ message: 'Server error.', error });
  }
};
exports.getUserByEmail = async (req, res) => {
  try {
    const allUsers = await User.find({});
    
    const user = await User.findOne({ email: req.params.email });
    

    if (!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the user.' });
  }
};
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password.' });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '400h' });
    
    res.status(200).json({ message: 'Login successful.', token, userId: user._id, role: user.role });

  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.logoutUser = (req, res) => {
  // Since JWT tokens are stateless, you cannot invalidate the token on the server-side.
  // To "log out" a user, simply remove the token from the client-side (e.g., delete it from local storage).
  res.status(200).json({ message: 'Logout successful.' });
};


exports.protectedRoute = (req, res) => {
  res.status(200).json({ message: 'This is a protected route.' });
};

exports.deleteUser = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOneAndDelete({ email });

    if (!user) {

      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'User account deleted successfully.' });

  } catch (error) {
    
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Unable to get users' });
  }
};
