const mongoose = require("mongoose");
const bCrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: [true, "This username is already provided"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email already in use"],
    validate: {
      validator: function(str){
        var re = /\S+@\S+\.\S+/;
        return re.test(str);
      },
      message: "Email is invalid"
    }
  },
  password: {
    type: String,
    required: [true, "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 symbol and at least 8 characters"],
    validate: {
      validator: function(str){
        var re = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
        return re.test(str);
      },
      message: "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 symbol and at least 8 characters"
    }
  },
  role: {
    type: String,
    required: [true, "Role is required"]
  },
  school: {
    type: String,
    required: [true, "School is required"]
  },
  startYear: {
    type: Number,
    required: [true, "Start year is required"],
    cast: "Start year must be a number",
    validate: {
      validator: function(nr){
        return (Number.isInteger(nr) && nr >= 1950 && nr <= 2100) || nr === null;
      },
      message: "If start year is specified, it must be a whole number between 1950 and 2100"
    }
  },
  endYear: {
    type: Number,
    cast: "End year must be a number",
    validate: {
      validator: function(nr){
        return (Number.isInteger(nr) && nr >= 1950 && nr <= 2100) || nr === null;
      },
      message: "If end year is specified, it must be a whole number between 1950 and 2100"
    }
  },
  classYear: {
    type: Number,
    cast: "Class year must be a number",
    validate: {
      validator: function(nr){
        return (Number.isInteger(nr) && nr >= 1 && nr <= 8) || nr === null;
      },
      message: "If class year is specified, it must be a whole number between 1 and 8"
    }
  },
  subject: {
    type: [String],
    default: []
  }
});

userSchema.methods.setPassword = function(password) {
  var re = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  if(password && re.test(password)){
    this.password = bCrypt.hashSync(password, bCrypt.genSaltSync(6));
  }
};

userSchema.methods.validPassword = function(password) {
  return bCrypt.compareSync(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;