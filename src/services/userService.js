import { raw } from "body-parser";
import db from "../models/index";
import bcrypt, { hash } from "bcryptjs";
import { where } from "sequelize";

const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    let userData = {};
    let isExist = await checkUserEmail(email);
    try {
      if (isExist) {
        let user = await db.User.findOne({
          attributes: ["email", "roleId", "password", "firstName", "lastName"],
          where: { email: email },
          raw: true,
        });
        if (user) {
          let check = bcrypt.compareSync(password, user.password);
          if (check) {
            userData.errCode = 0;
            userData.message = `Ok`;

            delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.message = `password wrong`;
          }
        } else {
          userData.errCode = 2;
          userData.message = `User isn't exist`;
        }
      } else {
        userData.errCode = 1;
        userData.message = `your email isn't exist`;
      }
      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};

let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAllUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = "";
      if (userId == "All") {
        user = await db.User.findAll({
          attributes: {
            exclude: ["password"],
          },
        });
      }
      if (userId && userId !== "All") {
        user = await db.User.findOne({
          where: { id: userId },
          attributes: {
            exclude: ["password"],
          },
        });
      }
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });
};

let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};

let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let check = await checkUserEmail(data.email);
      if (check == true) {
        resolve({
          errCode: 1,
          errMessage: "Your email are already in use",
        });
      } else {
        let hashPasswordFromBcrypt = await hashUserPassword(data.password);
        await db.User.create({
          email: data.email,
          password: hashPasswordFromBcrypt,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          phoneNumber: data.phoneNumber,
          gender: data.gender,
          roleId: data.roleId,
          positionId: data.positionId,
          image : data.avatar
        });
        resolve({
          errCode: 0,
          message: "okkkkk",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let foundUser = await db.User.findOne({
        where: { id: userId },
      });
      if (!foundUser) {
        resolve({
          errCode: 2,
          message: "can not find user",
        });
      }
      await db.User.destroy({
        where: { id: userId },
      });
      resolve({
        errCode: 0,
        message: "delete success!!",
      });
    } catch (e) {
      reject(e);
    }
  });
};

let editUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(data);
      if (!data.id ) {
        resolve({
          errCode: 2,
          message: "Missing required parameter",
        });
      }
      let user = await db.User.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        user.phoneNumber = data.phoneNumber;
        user.gender = data.gender;
        user.roleId = data.roleId;
        user.positionId = data.positionId;
        if(data.avatar){
          user.image = data.avatar
        }
        
        await user.save();
        resolve({
          errCode: 0,
          message: "Update Success!!!",
        });
      } else {
        resolve({
          errCode: 1,
          message: "ID isn't exist",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAllCodeService = (typeInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!typeInput) {
        resolve({
          errCode: 1,
          errMessage: "missing parameter",
        });
      } else {
        let res = {};
        let allCode = await db.Allcode.findAll({
          where: { type: typeInput },
        });
        res.errCode = 0;
        res.data = allCode;
        resolve(res);
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  handleUserLogin: handleUserLogin,
  getAllUser: getAllUser,
  createNewUser: createNewUser,
  deleteUser: deleteUser,
  editUserData: editUserData,
  getAllCodeService: getAllCodeService,
};
