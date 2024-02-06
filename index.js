import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { userRouter } from "./Routes/User.js";
import { leadRouter } from "./Routes/lead.js";
import { requestRouter } from "./Routes/servicerequest.js";
import { isAuthenticated } from "./Authentication/auth.js";
import { signUpRouter } from "./Routes/signup.js";
import { loginRouter } from "./Routes/login.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
// import { Register } from './Routes/Register.js';
//config dotenv
dotenv.config();

const PORT = process.env.PORT;

//initializing server
const app = express();

//middle wares
app.use(cors());
app.use(express.json());
const users = [];
// app.use('/', Register);
app.use("/", signUpRouter);
app.use("/", loginRouter);
app.use("/users", isAuthenticated, userRouter);
app.use("/leads", isAuthenticated, leadRouter);
app.use("/request", isAuthenticated, requestRouter);
app.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if the email is already registered
    if (users.some((user) => user.email === email)) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = {
      id: uuidv4(),
      firstName,
      lastName,
      email,
      password: hashedPassword,
    };

    // Store the user in your database or in-memory array
    users.push(newUser);

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Login Route
// Login Route
app.post('/loginn', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find((u) => u.email === email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




app.get('/', (req, res) => {
    res.send('crm working good');
  });

// start listening server
app.listen(PORT, () => console.log(`Server started in localhost:${PORT}`));