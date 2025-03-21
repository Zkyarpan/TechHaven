const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcrypt");
const User = require("../models/User");

// JWT Options
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || "aksjdaklsdjioqiwue[pqiewj",
};

// Configure Local Strategy for username/password authentication
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        // Find the user
        const user = await User.findOne({ email }).select("+password");

        // If no user found with that email
        if (!user) {
          console.log(`User not found with email: ${email}`);
          return done(null, false, { message: "Invalid email or password" });
        }

        // Check if password is correct - manually compare with bcrypt
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          console.log(`Password mismatch for user: ${email}`);
          return done(null, false, { message: "Invalid email or password" });
        }

        // Remove password from user object
        const userResponse = user.toObject();
        delete userResponse.password;

        // If all is well, return the user
        return done(null, userResponse);
      } catch (error) {
        console.error("Error in passport local strategy:", error);
        return done(error);
      }
    }
  )
);

// Configure JWT Strategy for token authentication
passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      // Find the user by ID from JWT payload
      const user = await User.findById(payload.id);

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

// Middleware to protect routes
exports.protect = passport.authenticate("jwt", { session: false });

// Middleware to check roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this resource`,
      });
    }

    next();
  };
};
