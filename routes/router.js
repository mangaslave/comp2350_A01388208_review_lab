const router = require("express").Router();
const database = include("databaseConnection");
const dbModel = include("databaseAccessLayer");
//const dbModel = include('staticData');

router.get("/", async (req, res) => {
  console.log("page hit");

  try {
    const result = await dbModel.getAllRestaurants();
    res.render("index", { restaurants: result });

    //Output the results of the query to the Heroku Logs
    console.log(result);
  } catch (err) {
    res.render("error", { message: "Error reading from MySQL" });
    console.log("Error reading from mysql");
  }
});

router.post("/addRestaurant", async (req, res) => {
  console.log("form submit");
  console.log(req.body);
  try {
    const success = await dbModel.addRestaurant(req.body);
    if (success) {
      res.redirect("/");
    } else {
      res.render("error", { message: "Error writing to MySQL" });
      console.log("Error writing to MySQL");
    }
  } catch (err) {
    res.render("error", { message: "Error writing to MySQL" });
    console.log("Error writing to MySQL");
    console.log(err);
  }
});

router.get("/deleteRestaurant", async (req, res) => {
  console.log("delete user");
  console.log(req.query);
  let restaurantID = req.query.id;
  if (restaurantID) {
    const success = await dbModel.deleteRestaurant(restaurantID);
    if (success) {
      res.redirect("/");
    } else {
      res.render("error", { message: "Error writing to MySQL" });
      console.log("Error writing to mysql");
      console.log(err);
    }
  }
});

router.get("/review", async (req, res) => {
  const restaurantId = req.query.id;

  try {
    const restaurant = await dbModel.getRestaurantById(restaurantId);
    const result = await dbModel.getAllReviews(restaurantId);
    res.render("reviews", { review: result, name: restaurant, id: restaurantId });

    console.log(result);
  } catch (err) {
    res.render("error", { message: "Error reading from MySQL" });
    console.log("Error reading from mysql");
  }
});


router.get("/deleteReview", async (req, res) => {
  let restaurantID = req.query.id;
  if (restaurantID) {
    const success = await dbModel.deleteReview(restaurantID);
    if (success) {
      res.redirect("/");
    } else {
      res.render("error", { message: "Error writing to MySQL" });
      console.log("Error writing to mysql");
      console.log(err);
    }
  }
});



router.post("/addReview", async (req, res) => {
  try {
    const restaurant_id = req.query.id;
    const { details, reviewer_name, rating } = req.body;
    const result = {restaurant_id, details, reviewer_name, rating}
    console.log(result)

    const reviewAdd = await dbModel.addReview(result);
    if (reviewAdd) {
      res.redirect("/");
    } else {
      res.render("error", { message: "Error writing to MySQL" });
      console.log("Error writing to MySQL");
    }
  } catch (err) {
    res.render("error", { message: "Error writing to MySQL" });
    console.log("Error writing to MySQL");
    console.log(err);
  }
});
   
module.exports = router;
