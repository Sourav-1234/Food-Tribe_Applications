const express = require('express');
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let db;
(async () => {
  try {
    db = await open({
      filename: "./BD4_Assignment1/database.sqlite",
      driver: sqlite3.Database,
    });
    console.log("Database connected.");
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
})();

// 1. Get All Restaurants
app.get("/restaurants", async (req, res) => {
  try {
    const query = "SELECT * FROM restaurants";
    const response = await db.all(query,[]);
    res.status(200).json({ restaurants: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Get Restaurant by ID
app.get("/restaurants/details/:id", async (req, res) => {
  try {
    const query = "SELECT * FROM restaurants WHERE id = ?";
    const response = await db.get(query, [req.params.id]);
    if (!response) return res.status(404).json({ message: "Restaurant not found!" });
    res.status(200).json({ restaurant: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Get Restaurants by Cuisine
app.get("/restaurants/cuisine/:cuisine", async (req, res) => {
  try {
    const query = "SELECT * FROM restaurants WHERE LOWER(cuisine) = LOWER(?)";
    const response = await db.all(query, [req.params.cuisine]);
    res.status(200).json({ restaurants: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Get Restaurants by Filter
app.get("/restaurants/filter", async (req, res) => {
  const { isVeg, hasOutdoorSeating, isLuxury } = req.query;
  const filters = [];

  if (isVeg) filters.push(`isVeg = '${isVeg}'`);
  if (hasOutdoorSeating) filters.push(`hasOutdoorSeating = '${hasOutdoorSeating}'`);
  if (isLuxury) filters.push(`isLuxury = '${isLuxury}'`);

  const query = `SELECT * FROM restaurants ${filters.length ? "WHERE " + filters.join(" AND ") : ""}`;
  try {
    const response = await db.all(query);
    res.status(200).json({ restaurants: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Get Restaurants Sorted by Rating
app.get("/restaurants/sort-by-rating", async (req, res) => {
  try {
    const query = "SELECT * FROM restaurants ORDER BY rating DESC";
    const response = await db.all(query);
    res.status(200).json({ restaurants: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Get All Dishes
app.get("/dishes", async (req, res) => {
  try {
    const query = "SELECT * FROM dishes";
    const response = await db.all(query);
    res.status(200).json({ dishes: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Get Dish by ID
app.get("/dishes/details/:id", async (req, res) => {
  try {
    const query = "SELECT * FROM dishes WHERE id = ?";
    const response = await db.get(query, [req.params.id]);
    if (!response) return res.status(404).json({ message: "Dish not found!" });
    res.status(200).json({ dish: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 8. Get Dishes by Filter
app.get("/dishes/filter", async (req, res) => {
  const { isVeg } = req.query;
  const query = "SELECT * FROM dishes WHERE isVeg = ?";
  try {
    const response = await db.all(query, [isVeg]);
    res.status(200).json({ dishes: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 9. Get Dishes Sorted by Price
app.get("/dishes/sort-by-price", async (req, res) => {
  try {
    const query = "SELECT * FROM dishes ORDER BY price ASC";
    const response = await db.all(query);
    res.status(200).json({ dishes: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
