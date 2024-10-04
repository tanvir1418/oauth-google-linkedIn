require("dotenv").config();
const express = require("express");
const app = express();
const passport = require("passport");
const session = require("express-session");
app.use(
  session({ secret: "yourSecretKey", resave: false, saveUninitialized: true })
);

require("./passport");
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send(
    "<button><a href='/auth/google'>Login With Google</a></button><button><a href='/auth/linkedin'>Login With LinkedIn</a></button>"
  );
});

app.get("/profile", (req, res) => {
  const email = req.query.email;
  const id = req.query.id;
  const picture = req.query.picture;
  const provider = req.query.provider;
  res.send(
    `<div><h1>Login Successful!</h1><h2>Email: ${email}</h2>
    <h4>Id: ${id}</h4>
    <h4>Provider: ${provider}</h4>
    <img src="${picture}"/></div>`
  );
});

// Google Auth
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

// Google Auth Callback
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    console.log(req.user);
    res.redirect(
      `/profile?email=${req.user.email}&id=${req.user.id}&picture=${req.user.picture}&provider=${req.user.provider}`
    );
  }
);

// LinkedIn Auth
app.get("/auth/linkedin", passport.authenticate("linkedin"));

// LinkedIn Auth Callback
app.get(
  "/auth/linkedin/callback",
  passport.authenticate("linkedin"),
  (req, res) => {
    console.log("/auth/linkedin/callback", req.user);
    res.redirect(
      `/profile?email=${req.user.email}&id=${req.user.id}&picture=${req.user.picture}&provider=${req.user.provider}`
    );
  }
);

// Success
app.get("/auth/callback/success", (req, res) => {
  if (!req.user) res.redirect("/auth/callback/failure");
  console.log(req.user);
  res.send("Welcome " + req.user.email);
});

// failure
app.get("/auth/callback/failure", (req, res) => {
  res.send("Error");
});

app.listen(5000, () => {
  console.log("Server Running on http://localhost:5000");
});
