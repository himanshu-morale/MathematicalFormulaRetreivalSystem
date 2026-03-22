import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const app = express();
const PORT = 3000;
const SECRET_KEY = process.env.JWT_SECRET || "math-formula-secret-key";

app.use(express.json());

// --- Database Mock (JSON based for portability) ---
const DB_FILE = path.join(process.cwd(), "db.json");

interface User {
  id: string;
  email: string;
  password: string;
  role: "admin" | "user";
}

interface Formula {
  id: string;
  name: string;
  category: string;
  description: string;
  latex: string;
  example: string;
  createdAt: string;
}

interface Bookmark {
  userId: string;
  formulaId: string;
}

interface DB {
  users: User[];
  formulas: Formula[];
  bookmarks: Bookmark[];
}

const initialData: DB = {
  users: [
    {
      id: "1",
      email: "admin@example.com",
      password: bcrypt.hashSync("admin123", 10),
      role: "admin",
    },
    {
      id: "2",
      email: "user@example.com",
      password: bcrypt.hashSync("user123", 10),
      role: "user",
    },
  ],
  formulas: [
    {
      id: "1",
      name: "Quadratic Formula",
      category: "Algebra",
      description: "Used to find the roots of a quadratic equation ax^2 + bx + c = 0.",
      latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
      example: "For x^2 + 5x + 6 = 0, a=1, b=5, c=6.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Euler's Identity",
      category: "Calculus",
      description: "A beautiful equation connecting five fundamental mathematical constants.",
      latex: "e^{i\\pi} + 1 = 0",
      example: "Used in complex analysis and physics.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Pythagorean Theorem",
      category: "Geometry",
      description: "Relates the sides of a right-angled triangle.",
      latex: "a^2 + b^2 = c^2",
      example: "If a=3 and b=4, then c=5.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "4",
      name: "Area of a Circle",
      category: "Geometry",
      description: "Calculates the area enclosed by a circle with radius r.",
      latex: "A = \\pi r^2",
      example: "If r=7, A = 49\\pi.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "5",
      name: "Binomial Theorem",
      category: "Algebra",
      description: "Describes the algebraic expansion of powers of a binomial.",
      latex: "(x+y)^n = \\sum_{k=0}^n \\binom{n}{k} x^{n-k} y^k",
      example: "(x+y)^2 = x^2 + 2xy + y^2.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "6",
      name: "Logarithm Product Rule",
      category: "Algebra",
      description: "The logarithm of a product is the sum of the logarithms.",
      latex: "\\log_b(xy) = \\log_b(x) + \\log_b(y)",
      example: "\\log(100) = \\log(10) + \\log(10) = 1 + 1 = 2.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "7",
      name: "Derivative Power Rule",
      category: "Calculus",
      description: "Basic rule for differentiating powers of x.",
      latex: "\\frac{d}{dx}x^n = nx^{n-1}",
      example: "The derivative of x^3 is 3x^2.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "8",
      name: "Fundamental Theorem of Calculus",
      category: "Calculus",
      description: "Relates differentiation and integration.",
      latex: "\\int_a^b f(x)dx = F(b) - F(a)",
      example: "Used to calculate the area under a curve.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "9",
      name: "Law of Sines",
      category: "Trigonometry",
      description: "Relates the lengths of the sides of a triangle to the sines of its angles.",
      latex: "\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}",
      example: "Used to solve non-right triangles.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "10",
      name: "Law of Cosines",
      category: "Trigonometry",
      description: "Generalization of the Pythagorean theorem for all triangles.",
      latex: "c^2 = a^2 + b^2 - 2ab \\cos C",
      example: "Find side c if a, b and angle C are known.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "11",
      name: "Bayes' Theorem",
      category: "Probability",
      description: "Describes the probability of an event based on prior knowledge.",
      latex: "P(A|B) = \\frac{P(B|A)P(A)}{P(B)}",
      example: "Used in medical testing and spam filters.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "12",
      name: "Standard Deviation",
      category: "Statistics",
      description: "Measure of the amount of variation or dispersion of a set of values.",
      latex: "\\sigma = \\sqrt{\\frac{\\sum(x_i - \\mu)^2}{N}}",
      example: "High sigma means data is spread out.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "13",
      name: "Newton's Second Law",
      category: "Physics",
      description: "Force equals mass times acceleration.",
      latex: "F = ma",
      example: "A 10kg mass accelerating at 2m/s^2 requires 20N of force.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "14",
      name: "Mass-Energy Equivalence",
      category: "Physics",
      description: "Einstein's famous equation relating mass and energy.",
      latex: "E = mc^2",
      example: "Shows that mass can be converted into energy.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "15",
      name: "Ohm's Law",
      category: "Physics",
      description: "Relates voltage, current, and resistance.",
      latex: "V = IR",
      example: "If I=2A and R=5Ω, then V=10V.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "16",
      name: "Volume of a Sphere",
      category: "Geometry",
      description: "Calculates the space occupied by a sphere.",
      latex: "V = \\frac{4}{3}\\pi r^3",
      example: "If r=3, V = 36\\pi.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "17",
      name: "Arithmetic Series Sum",
      category: "Algebra",
      description: "Sum of the first n terms of an arithmetic progression.",
      latex: "S_n = \\frac{n}{2}(a_1 + a_n)",
      example: "Sum of 1 to 100 is 5050.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "18",
      name: "Product Rule",
      category: "Calculus",
      description: "Rule for differentiating the product of two functions.",
      latex: "(uv)' = u'v + uv'",
      example: "Derivative of x*sin(x) is sin(x) + x*cos(x).",
      createdAt: new Date().toISOString(),
    },
    {
      id: "19",
      name: "Pythagorean Identity",
      category: "Trigonometry",
      description: "Fundamental identity relating sine and cosine.",
      latex: "\\sin^2 \\theta + \\cos^2 \\theta = 1",
      example: "True for any angle theta.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "20",
      name: "Combinations Formula",
      category: "Probability",
      description: "Number of ways to choose k items from n without regard to order.",
      latex: "\\binom{n}{k} = \\frac{n!}{k!(n-k)!}",
      example: "Choosing 2 items from 5: 10 ways.",
      createdAt: new Date().toISOString(),
    },
  ],
  bookmarks: [],
};

function getDB(): DB {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}

function saveDB(data: DB) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// --- Middleware ---
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const isAdmin = (req: any, res: any, next: any) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
  next();
};

// --- API Routes ---

// Auth
app.post("/api/auth/signup", async (req, res) => {
  const { email, password } = req.body;
  const db = getDB();
  if (db.users.find((u) => u.email === email)) {
    return res.status(400).json({ message: "User already exists" });
  }
  const newUser: User = {
    id: Date.now().toString(),
    email,
    password: await bcrypt.hash(password, 10),
    role: "user",
  };
  db.users.push(newUser);
  saveDB(db);
  res.status(201).json({ message: "User created" });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const db = getDB();
  const user = db.users.find((u) => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET_KEY);
  res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
});

// Formulas
app.get("/api/formulas", (req, res) => {
  const db = getDB();
  const { q, category } = req.query;
  let results = db.formulas;

  if (category) {
    results = results.filter((f) => f.category.toLowerCase() === (category as string).toLowerCase());
  }

  if (q) {
    const query = (q as string).toLowerCase();
    // Simple ranking: Name match > Description match > LaTeX match
    results = results
      .map((f) => {
        let score = 0;
        if (f.name.toLowerCase().includes(query)) score += 10;
        if (f.description.toLowerCase().includes(query)) score += 5;
        if (f.latex.toLowerCase().includes(query)) score += 2;
        if (f.category.toLowerCase().includes(query)) score += 3;
        return { ...f, score };
      })
      .filter((f) => f.score > 0)
      .sort((a, b) => b.score - a.score);
  }

  res.json(results);
});

app.post("/api/formulas", authenticateToken, isAdmin, (req, res) => {
  const db = getDB();
  const newFormula: Formula = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  db.formulas.push(newFormula);
  saveDB(db);
  res.status(201).json(newFormula);
});

app.put("/api/formulas/:id", authenticateToken, isAdmin, (req, res) => {
  const db = getDB();
  const index = db.formulas.findIndex((f) => f.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Formula not found" });
  db.formulas[index] = { ...db.formulas[index], ...req.body };
  saveDB(db);
  res.json(db.formulas[index]);
});

app.delete("/api/formulas/:id", authenticateToken, isAdmin, (req, res) => {
  const db = getDB();
  db.formulas = db.formulas.filter((f) => f.id !== req.params.id);
  saveDB(db);
  res.sendStatus(204);
});

// Bookmarks
app.get("/api/bookmarks", authenticateToken, (req: any, res) => {
  const db = getDB();
  const userBookmarks = db.bookmarks.filter((b) => b.userId === req.user.id);
  const formulas = db.formulas.filter((f) => userBookmarks.some((b) => b.formulaId === f.id));
  res.json(formulas);
});

app.post("/api/bookmarks/:id", authenticateToken, (req: any, res) => {
  const db = getDB();
  if (!db.bookmarks.some((b) => b.userId === req.user.id && b.formulaId === req.params.id)) {
    db.bookmarks.push({ userId: req.user.id, formulaId: req.params.id });
    saveDB(db);
  }
  res.sendStatus(201);
});

app.delete("/api/bookmarks/:id", authenticateToken, (req: any, res) => {
  const db = getDB();
  db.bookmarks = db.bookmarks.filter((b) => !(b.userId === req.user.id && b.formulaId === req.params.id));
  saveDB(db);
  res.sendStatus(204);
});

// --- Vite Integration ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
