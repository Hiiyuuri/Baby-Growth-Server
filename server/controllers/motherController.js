const { babiesWeightConverter } = require("../helpers/babyWeight");
const { comparePassword, hashPassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { selisihCalculator } = require("../helpers/selisihCalculator");
const { calculateStatistics } = require("../helpers/statisticCalculator");
const {
  User,
  MotherProfile,
  Pregnancy,
  PregnancyData,
  BabyData,
} = require("../models");

class MotherController {
  static async tes(req, res) {
    try {
      res.send("hello world");
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async login(req, res) {
    try {
      const { NIK, password } = req.body;

      if (!NIK) {
        throw { name: "NIKRequired" };
      }
      if (!password) {
        throw { name: "PasswordRequired" };
      }

      const foundMotherProfile = await MotherProfile.findOne({
        where: { NIK },
      });

      if (!foundMotherProfile) {
        throw { name: "InvalidLogin" };
      }

      const isMatched = comparePassword(password, foundMotherProfile.password);

      if (!isMatched) {
        throw { name: "InvalidLogin" };
      }

      const payload = {
        id: foundMotherProfile.id,
        NIK: foundMotherProfile.NIK,
      };
      console.log(payload);

      const access_token = signToken(payload);

      res.status(200).json({
        access_token,
        NIK: foundMotherProfile.NIK,
        name: foundMotherProfile.name,
      });
    } catch (err) {
      if (err.name == "PasswordRequired") {
        res.status(400).json({ message: "Password is required" });
      } else if (err.name == "NIKRequired") {
        res.status(400).json({ message: "NIK is required" });
      } else if (err.name == "InvalidLogin") {
        res.status(401).json({ message: "Invalid email/password" });
      } else {
        res.status(500).json(err);
      }
    }
  }
}

module.exports = MotherController;
