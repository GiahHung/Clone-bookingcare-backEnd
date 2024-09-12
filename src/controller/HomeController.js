import CRUDService from "../services/CRUDService";
import db from "../models/index";


let getHomepage = async (req, res) =>{
    try {
        let data = await db.User.findAll();
        return res.render("homePage.ejs",{
            data: JSON.stringify(data)
        });
    } catch (e) {
        console.log(e);
    }
}

let getCRUD = (req, res) =>{
    return res.render("test/CRUD.ejs");
}

let postCRUD = async(req, res) =>{
    let message = await CRUDService.createNewUser(req.body);
    console.log(message);
    return res.send("AAAAAAAA");
}

let displayGetCRUD = async (req, res) =>{
    let data = await CRUDService.getAllUser();
    console.log("------------");
    console.log(data);
    console.log("-------------");
    return res.render("test/displayGetCRUD.ejs",{
        dataTable: data
    });
}

let getEditCRUD = async (req, res) =>{
    let userId = req.query.id;
    if(userId){
        let userData = await CRUDService.getUserInfo(userId);
        //check user ID
        return res.render('test/editUser.ejs',{
            user: userData,
        });
    }
    else{
        return res.send("NOT FOUND USER!!!!!!!!!");
    }
}

let putCRUD = async (req,res) =>{
    let data = req.body;
    let allUsers = await CRUDService.updateUser(data);
    return res.render("test/displayGetCRUD.ejs",{
        dataTable: allUsers
    });
}

let deleteCRUD = async (req, res) =>{
    let id = req.query.id;
    await CRUDService.deleteUser(id);
    return res.send("delete success!!!")
}

module.exports = {
    getHomepage : getHomepage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
}