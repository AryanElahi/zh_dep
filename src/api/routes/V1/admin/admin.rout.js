const express = require("express")
const router = express.Router()
const upload = require('./../../../middlewares/photoUploading'); 
const creatErrors = require("http-errors")
const {signupVal, loginVal} = require("../../../../validation/announce.crud.validation")
const {getAllUsers,updateUser} = require("../../../../services/user/auth")
const {
    getByUid,
    getAll,
    getchecked,
    getunchecked,
    check} = require("../../../../services/request/services")
const {
    uncheckedRequests
} = require("../../../../services/adminpanel/userManagement/services")
const {
    creatannounce,
    getAllAnnouns,
    inPrigressStates,
    deleted_or_not_confirmed,
    search
} = require("../../../../services/adminpanel/adminannounce/announservices")
const {
    get_ip,
    get_exact_date,
    save_visitor,
    get_daily_visitors,
    get_all_visitors
}= require ("../../../../services/adminpanel/visitCountingServices")
const {verifyAccessToken, verifyRefreshToken} = require("../../../middlewares/isAuth.middleware")
const { not } = require("joi")
const {
    creatvisit,
    getAllVisits,
    updateVisits,
    deleteVisits
} = require("./../../../../services/adminpanel/visit/CRUD")
const {
    creatdeal,
    getAlldeals,
    updatedeal,
    deletedeal
} = require("./../../../../services/adminpanel/deal/CRUD")
const {
    promotToAdmin,
    softDelete
} = require("./../../../../services/adminpanel/userManagement/services")
const {creatval} = require("./../../../../validation/adminval")
require('dotenv').config();
//Dashboard started
router.get("/dashboard", async (req, res, next) => {
try {
    const user = await getAllUsers()
    const announcount = await getAllAnnouns()
    console.log(announcount)
    const inprogress = await inPrigressStates()
    const notConfirmed = await deleted_or_not_confirmed()
    const uncheckedRequest = await uncheckedRequests()
    const allVisitors = await get_all_visitors()
    const dailyVisitors = await get_daily_visitors()
    res.send ({
        "all announcements" : announcount.number.toString(),
        "all users" : user.number.toString(), 
        "in progress ": inprogress.number.toString(),
        "deleted or not confirmed" : notConfirmed.number.toString(),
        "unchecked requests" : uncheckedRequest.number.toString(),
        "all visitors" : allVisitors.number.toString(),
        "daily visitors" : dailyVisitors.toString()
    })
} catch (error) {
    if (error.isJoi === true) error.status = 422
    next(error)
}
})

router.get("/notconfirmed", async (req, res, next) => {
    const notconfirmed = await deleted_or_not_confirmed()
    res.send(notconfirmed)
})
router.get("/getAllRequests", async (req, res, next) => {
    const requests = await getAll()
    res.send(requests)
})
//announcement management
router.post("/creatAnnouncement", async (req, res, next) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).send({
                success: 0,
                message: err.message
            });
        }
        try {
            let imageUrls = [];
            if (req.files && req.files.length > 0) {
                imageUrls = req.files.map(file => `${process.env.SERVER_URL}/profile/${file.filename}`);
            }
            console.log(req.body);
            let result = await creatval.validateAsync(req.body);
            result.Uid = String(new Date().getTime());
            if (imageUrls.length > 0) {
                result.images = imageUrls.join(','); 
            }
            console.log(result);
            const newA = await creatannounce(result);
            res.send({
                success: 1,
                data: newA,
                images: imageUrls
            });

        } catch (error) {
            res.status(500).send({
                success: 0,
                message: error.message
            });
        }
    });
});

router.get("/inprogress", async (req, res, next) => {
    const inprogress = await inPrigressStates()
    res.send(inprogress)
})
router.get("/notconfirmed", async (req, res, next) => {
    const notconfirmed = await deleted_or_not_confirmed()
    res.send(notconfirmed)
})
router.post("/search", async (req, res, next) => {
    console.log(req.body)
    const result = await search(req.body)
    res.send(result)
})
//visit part
router.post("/creatVisit", async(req, res, next) => {
    data = req.body
    data.Uid = new Date().getTime().toString()
    visit = await creatvisit(data)
    res.send(visit)
})
router.get("/getAllVisits", async (req, res, next) => {
    const visits = await getAllVisits()
    res.send(visits)
})
router.post("/updateVisits", async(req, res, next) => {
    ID = req.body.ID
    let requestData = req.body
    delete requestData.ID
    const data = requestData
    visit = await updateVisits(ID ,data)
    res.send(visit)
})
router.post("/deleteVisit", async(req, res, next) => {
    ID = req.body.ID
    const del = deleteVisits(ID)
    res.send(await getAllVisits())
})
//deal part
router.post("/creatdeal", async(req, res, next) => {
    data = req.body
    data.Uid = new Date().getTime().toString()
    deal = await creatdeal(data)
    res.send(deal)
})
router.get("/getAlldeals", async (req, res, next) => {
    const deals = await getAlldeals()
    res.send(deals)
})
router.post("/updatedeal", async(req, res, next) => {
    ID = req.body.ID
    let requestData = req.body
    delete requestData.ID
    const data = requestData
    deal = await updatedeal(ID, data)
    res.send(deal)
})
router.post("/deletedeal", async(req, res, next) => {
    ID = req.body.ID
    const del = deletedeal(ID)
    res.send(await getAlldeals())
})
//user management
router.get("/alluseres", async (req, res, next) => {
    try {
        res.send (await getAllUsers())
    } catch (error) {
        next(error)
    }
})
router.put("/updateuser", async (req, res) => {
    try {
        let result = req.body
        let phone = req.phone
        res.send(await updateUser(phone, result))
    } catch (error) {
        if (error) throw error
    }
})
router.put("/promotToAdmin", async (req, res, next) => {
    const phone = req.body.phone
    const PA = await promotToAdmin(phone)
    res.send(PA)
})
router.put("/softDelete", async (req, res, next) => {
    const phone = req.body.phone
    const SD = await softDelete(phone)
    res.send(SD)
})
module.exports = router


