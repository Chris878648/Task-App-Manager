const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, query, where, updateDoc, doc } = require('firebase/firestore');

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDJ5TtjO5GI-wOza5dC2LLx4Cccu4PD1GM",
  authDomain: "taskapp-341af.firebaseapp.com",
  projectId: "taskapp-341af",
  storageBucket: "taskapp-341af.firebasestorage.app",
  messagingSenderId: "214913111245",
  appId: "1:214913111245:web:e408a4cfbf3f331fc28584",
  measurementId: "G-L59J1TQKW4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Crear un servidor Express
const Api = express();
const port = 3001;

Api.use(express.json());
Api.use(cors());

const SECRET_KEY = 'HKAHS22SJX4223DXE'; 

// Middleware para verificar el token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Función para registrar un usuario
Api.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const docRef = await addDoc(collection(db, 'Users'), {
      username,
      email,
      password: hashedPassword,
      last_login: ""
    });

    const userId = docRef.id;

    res.status(200).json({ message: `User added with ID: ${userId}`, userId });
  } catch (error) {
    res.status(500).json({ message: 'Error adding user: ' + error.message });
  }
});

// Función para hacer login
Api.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const q = query(collection(db, 'Users'), where('username', '==', username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const userDoc = querySnapshot.docs[0];
    const user = userDoc.data();
    const userId = userDoc.id;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: '10m' });

    await updateDoc(doc(db, 'Users', userDoc.id), {
      last_login: token
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in: ' + error.message });
  }
});

// Función para crear una tarea
Api.post('/tasks', authenticateToken, async (req, res) => {
  const { name, description, time, status, category } = req.body;
  try {
    const docRef = await addDoc(collection(db, 'Tasks'), {
      name,
      description,
      time,
      status,
      category,
      userId: req.user.userId 
    });
    res.status(200).json({ message: `Task added with ID: ${docRef.id}` });
  } catch (error) {
    res.status(500).json({ message: 'Error adding task: ' + error.message });
  }
});

// Función para obtener todas las tareas del usuario autenticado
Api.get('/get_tasks', authenticateToken, async (req, res) => {
  try {
    const q = query(collection(db, 'Tasks'), where('userId', '==', req.user.userId));
    const querySnapshot = await getDocs(q);
    const tasks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error getting tasks: ' + error.message });
  }
});

// Función para hacer logout
Api.post('/logout', authenticateToken, async (req, res) => {
  try {
    const q = query(collection(db, 'Users'), where('username', '==', req.user.username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(400).json({ message: 'User not found' });
    }

    const userDoc = querySnapshot.docs[0];

    await updateDoc(doc(db, 'Users', userDoc.id), {
      last_login: "" // Borrar token
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging out: ' + error.message });
  }
});

// Iniciar el servidor Express
Api.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});