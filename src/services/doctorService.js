import { Model } from "sequelize";
import db from "../models/index";
import { resolveInclude } from "ejs";

let getTopDoctor = (limitInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        limit: limitInput,
        where: { roleId: "R2" },
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["valueEn", "valueVi"],
          },
        ],
        raw: true,
        nest: true,
      });
      resolve({
        errCode: 0,
        data: users,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getAllDoctor = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctor = await db.User.findAll({
        where: { roleId: "R2" },
        attributes: {
          exclude: ["password", "image"],
        },
      });
      resolve({
        errCode: 0,
        data: doctor,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let saveDetailInfoDoctor = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !inputData.doctorId ||
        !inputData.contentHTML ||
        !inputData.contentMarkDown ||
        !inputData.action
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter input!!!",
        });
      } else {
        if (inputData.action === "CREATE") {
          await db.MarkDown.create({
            contentHTML: inputData.contentHTML,
            contentMarkDown: inputData.contentMarkDown,
            description: inputData.description,
            doctorId: inputData.doctorId,
          });
        } else if (inputData.action === "EDIT") {
          let doctorMarkDown = await db.MarkDown.findOne({
            where: { doctorId: inputData.doctorId },
            raw: false
          });
          if (doctorMarkDown) {
            (doctorMarkDown.contentHTML = inputData.contentHTML),
              (doctorMarkDown.contentMarkDown = inputData.contentMarkDown),
              (doctorMarkDown.description = inputData.description),
              (doctorMarkDown.doctorId = inputData.doctorId);
            await doctorMarkDown.save();
          }
        }
        resolve({
          errCode: 0,
          errMessage: "Save info success!!!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getDetailDoctorById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter!!!",
        });
      } else {
        let info = await db.User.findOne({
          where: { id: inputId },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.MarkDown,
              attributes: ["contentHTML", "contentMarkDown", "description"],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],
            },
          ],
          raw: true,
          nest: true,
        });
        if (info && info.image) {
          // info.image = new Buffer(info.image, "base64").toString("binary");
          info.image = Buffer.from(info.image, "base64").toString("binary");
        }
        if (!info) info = {};
        resolve({
          errCode: 0,
          data: info,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getTopDoctor: getTopDoctor,
  getAllDoctor: getAllDoctor,
  saveDetailInfoDoctor: saveDetailInfoDoctor,
  getDetailDoctorById: getDetailDoctorById,
};
