var mongojs = require('mongojs');

var db = mongojs('mongodb://admin:root@ds127399.mlab.com:27399/eatoeat');

var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var dns = require('dns');
var os = require('os');
var randomstring = require("randomstring");
// var jwt=require('jsonwebtoken');

module.exports.add_cook_info = function (req, res, next) {

    // res.send('Task API');
    console.log('reached');
    db.cook_infos.find({ cook_email: req.body.basic_detail.cook_email }, function (err, cook_details) {

        if (cook_details != "") {

            throw err;
            console.log('already have this email id');
            // res.status(404);
            //  res.send(cook_details);

        } else if (cook_details == "") {

            db.cook_infos.save(
                {
                    cook_name: req.body.basic_detail.cook_name,
                    cook_email: req.body.basic_detail.cook_email,
                    cook_contact: req.body.basic_detail.cook_contact_no,
                    cook_password: bcrypt.hashSync(req.body.basic_detail.cook_password, bcrypt.genSaltSync(10)),
                    street_address: req.body.profile_detail.street_address,
                    gender: req.body.profile_detail.gender,
                    landmark: req.body.profile_detail.landmark,
                    city: req.body.profile_detail.city,
                    pincode: req.body.profile_detail.pincode,
                    state: req.body.profile_detail.state,
                    longitude: req.body.profile_detail.longitude,
                    latitude: req.body.profile_detail.latitude,
                    about_us: req.body.profile_detail.about_us,
                    first_name: req.body.profile_detail.first_name,
                    last_name: req.body.profile_detail.last_name,
                    display_phone: req.body.profile_detail.display_phone,
                    display_email: req.body.profile_detail.display_email,
                    bank_type: req.body.profile_detail.bank_type,
                    bank_account_no: req.body.profile_detail.bank_account_no,
                    bank_ifsc: req.body.profile_detail.bank_ifsc,
                    food_details: [],
                    status: "InActive",
                    isApproved: "new",
                    updated_fields: []

                }
                , function (err, cook_details) {

                    if (err) throw err;


                    res.send(cook_details);
                    console.log('COOK DETAILS saved');

                });


        }
    });
};

module.exports.cook_login_check = function (req, res, next) {

    // res.send('Task API');
    console.log(req.body);
    db.cook_infos.find(
        {
            cook_email: req.body.email,

        }
        , function (err, cook) {

            if (err) {

                console.log(err);
                res.status(404);
              
                res.send('cook not find');
            } else {
                if (cook != "") {
                    if (bcrypt.compareSync(req.body.password, cook[0].cook_password)) {

                        if (cook[0].status == "inactive") {
                            res.status(400).send('account disabled');
                            console.log('cook is inactive');
                        }
                        else {
                            console.log(cook);
                            res.status(200).json(cook);

                        }
                    }
                }
                else {
                    res.status(401).send('Credentials Are Invalid.!');

                    console.log('cook not valid');
                }


            }


        });
};

module.exports.cook_pass_update = function (req, res, next) {

    //console.log('cook pass update');
    console.log(req.body);
    var flag = false;
    db.cook_infos.find(
        {
            _id: mongojs.ObjectId(req.body.cook_id)

        }
        , function (err, cook) {

            if (err || cook == "") {

                console.log(err);
                res.status(404);
                res.send('cook not find');
            } else {

                if (bcrypt.compareSync(req.body.old_pass, cook[0].cook_password)) {
                    //     console.log(cook);
                    // res.status(200).json(cook);
                    db.cook_infos.findAndModify({
                        query: { _id: mongojs.ObjectId(req.body.cook_id) },
                        update: {
                            $set: {

                                cook_password: bcrypt.hashSync(req.body.new_pass, bcrypt.genSaltSync(10))
                            }
                        },
                        new: true
                    }, function (err, data, lastErrorObject) {
                        if (err) {

                            flag = false;

                        }
                        res.status(200);
                        res.send("Password Successfully Updated");
                        flag = true;
                        console.log('COOK password UPDATED');
                    })


                }
                else {
                    if (flag) {
                        console.log('pass updated');
                    }
                    else if (!flag) {
                        res.status(400).send('err');
                        console.log('not match');
                    }
                    // res.status(200).send('fine');


                }


            }
        });

};


module.exports.cook_deactivate = function (req, res, next) {


    console.log(req.body);


    db.cook_infos.find(
        {

            _id: mongojs.ObjectId(req.body.cook_id),
            cook_email: req.body.cook_email,
            cook_contact: req.body.cook_contact_no
        }
        , function (err, cook) {


            if (err || cook == "") {
                res.status(404);
                res.status(404).send('details are incorrect');
            } else {


                if (bcrypt.compareSync(req.body.cook_password, cook[0].cook_password)) {
                    db.cook_infos.findAndModify({
                        query: {
                            _id: mongojs.ObjectId(req.body.cook_id),


                        },
                        update: {
                            $set: {

                                status: "inactive"
                            }
                        },
                        new: true
                    }, function (err, data, lastErrorObject) {
                        if (err) {
                            res.status(400);
                            res.send('error');
                            console.log('err');
                            throw err;

                        }

                        res.status(200).send('acount deactivated');

                    });

                }
                else {

                    res.status(404).send('password not match');
                    console.log('password not match');
                }
            }

        });

};

module.exports.cook_profile_update = function (req, res, next) {


    console.log(req.body);
    /**********************NOTES
     * Make a array subdocument in cook_infos which stores  available hours
     * 
     * 
     * ********** */
    db.cook_infos.findAndModify({
        query: {
            _id: mongojs.ObjectId(req.body.cook_id),
        },
        update: {
            $unset: {

                'available_hours': null


            }
        },
        new: true
    }, function (err, data, lastErrorObject) {
        if (err) {
            res.status(400);
            res.send('error');
            throw err;

        }

        console.log('cook UPDATED');
    });

    db.cook_infos.findAndModify({
        query: { _id: mongojs.ObjectId(req.body.cook_id) },
        update: {
            $set: {
                cook_name: req.body.cook_name,
                cook_email: req.body.cook_email,
                cook_contact: req.body.cook_contact,
                cook_addition_contact: req.body.cook_addition_contact,
                street_address: req.body.street_address,
                gender: req.body.gender,
                landmark: req.body.landmark,
                city: req.body.city,
                pincode: req.body.pincode,
                state: req.body.state,
                cook_latitude: req.body.cook_latitude,
                cook_longitude: req.body.cook_longitude,

            }

        }
        ,
        new: true
    }, function (err, data, lastErrorObject) {
        if (err) {
            res.status(400);
            res.send('error');
            throw err;

        }

        else {

            if (req.body.available_hours.hasOwnProperty('mon_from')) {

                db.cook_infos.findAndModify({
                    query: {
                        _id: mongojs.ObjectId(req.body.cook_id),
                    },
                    update: {
                        $set: {

                            'available_hours.mon_from': req.body.available_hours.mon_from,
                            'available_hours.mon_to': req.body.available_hours.mon_to,

                        }
                    },
                    new: true
                }, function (err, data, lastErrorObject) {
                    if (err) {
                        res.status(400);
                        res.send('error');
                        throw err;

                    }

                    console.log('cook MON UPDATED');
                });
            }
            if (req.body.available_hours.hasOwnProperty('tue_from')) {
                db.cook_infos.findAndModify({
                    query: {
                        _id: mongojs.ObjectId(req.body.cook_id),
                    },
                    update: {
                        $set: {

                            'available_hours.tue_from': req.body.available_hours.tue_from,
                            'available_hours.tue_to': req.body.available_hours.tue_to,

                        }
                    },
                    new: true
                }, function (err, data, lastErrorObject) {
                    if (err) {
                        res.status(400);
                        res.send('error');
                        throw err;

                    }

                    console.log('cook UPDATED');
                });
            }

            if (req.body.available_hours.hasOwnProperty('wed_from')) {
                db.cook_infos.findAndModify({
                    query: {
                        _id: mongojs.ObjectId(req.body.cook_id),
                    },
                    update: {
                        $set: {

                            'available_hours.wed_from': req.body.available_hours.wed_from,
                            'available_hours.wed_to': req.body.available_hours.wed_to,

                        }
                    },
                    new: true
                }, function (err, data, lastErrorObject) {
                    if (err) {
                        res.status(400);
                        res.send('error');
                        throw err;

                    }

                    console.log('cook UPDATED');
                });
            }

            if (req.body.available_hours.hasOwnProperty('thu_from')) {
                db.cook_infos.findAndModify({
                    query: {
                        _id: mongojs.ObjectId(req.body.cook_id),
                    },
                    update: {
                        $set: {

                            'available_hours.thu_from': req.body.available_hours.thu_from,
                            'available_hours.thu_to': req.body.available_hours.thu_to,

                        }
                    },
                    new: true
                }, function (err, data, lastErrorObject) {
                    if (err) {
                        res.status(400);
                        res.send('error');
                        throw err;

                    }

                    console.log('cook UPDATED');
                });
            }

            if (req.body.available_hours.hasOwnProperty('fri_from')) {
                db.cook_infos.findAndModify({
                    query: {
                        _id: mongojs.ObjectId(req.body.cook_id),
                    },
                    update: {
                        $set: {

                            'available_hours.fri_from': req.body.available_hours.fri_from,
                            'available_hours.fri_to': req.body.available_hours.fri_to,

                        }
                    },
                    new: true
                }, function (err, data, lastErrorObject) {
                    if (err) {
                        res.status(400);
                        res.send('error');
                        throw err;

                    }

                    console.log('cook UPDATED');
                });
            }

            if (req.body.available_hours.hasOwnProperty('sat_from')) {
                db.cook_infos.findAndModify({
                    query: {
                        _id: mongojs.ObjectId(req.body.cook_id),
                    },
                    update: {
                        $set: {

                            'available_hours.sat_from': req.body.available_hours.sat_from,
                            'available_hours.sat_to': req.body.available_hours.sat_to,

                        }
                    },
                    new: true
                }, function (err, data, lastErrorObject) {
                    if (err) {
                        res.status(400);
                        res.send('error');
                        throw err;

                    }

                    console.log('cook UPDATED');
                });
            }

            if (req.body.available_hours.hasOwnProperty('sun_from')) {
                db.cook_infos.findAndModify({
                    query: {
                        _id: mongojs.ObjectId(req.body.cook_id),
                    },
                    update: {
                        $set: {

                            'available_hours.sun_from': req.body.available_hours.sun_from,
                            'available_hours.sun_to': req.body.available_hours.sun_to,

                        }
                    },
                    new: true
                }, function (err, data, lastErrorObject) {
                    if (err) {
                        res.status(400);
                        res.send('error');
                        throw err;

                    }

                    console.log('cook UPDATED');
                });
            }


        }

        res.status(200).send('success');
    });

}
module.exports.get_cook_profile_data = function (req, res, next) {


    db.cook_infos.find(
        {
            _id: mongojs.ObjectId(req.body.cook_id)

        }
        , function (err, cook) {

            if (err || cook == "") {

                console.log(err);
                res.status(404);
                res.send('cook not find');
            } else {

                res.status(200).send(cook);

            }
        });
}

module.exports.cook_company_details_update = function (req, res, next) {

    var update_col = [];

    if (req.body.cook_banner_img == "") {

        console.log('This is LOG NULL');
        console.log(req.body);
        db.cook_infos.find({
            _id: mongojs.ObjectId(req.body.cook_id)
        }
            , function (err, data, lastErrorObject) {
                if (err) {
                    res.status(400);
                    res.send('error');
                    throw err;

                }


                console.log(data[0].cook_name);

                if (data[0].about_us != req.body.about_us) {
                    var update_fields = {};
                    update_fields.field_name = "About Cook";
                    update_fields.field_attr = "about_us";
                    update_fields.field_value = req.body.about_us;
                    update_fields.old_val = data[0].about_us;
                    update_col.push(update_fields);
                }

                if (data[0].cook_company_name != req.body.cook_company_name) {
                    var update_fields = {};
                    update_fields.field_name = "Company Name";
                    update_fields.field_attr = "cook_company_name";
                    update_fields.field_value = req.body.cook_company_name;
                    update_fields.old_val = data[0].about_us;
                    update_col.push(update_fields);
                }
                if (data[0].bank_type != req.body.bank_type) {
                    var update_fields = {};
                    update_fields.field_name = "Bank Type";
                    update_fields.field_attr = "bank_type";
                    update_fields.field_value = req.body.bank_type;
                    update_fields.old_val = data[0].bank_type;
                    update_col.push(update_fields);
                }
                if (data[0].cook_name_on_bank_acc != req.body.cook_name_on_bank_acc) {
                    var update_fields = {};
                    update_fields.field_name = "Cook Name On Bank Account";
                    update_fields.field_attr = "cook_name_on_bank_acc";
                    update_fields.field_value = req.body.cook_name_on_bank_acc;
                    update_fields.old_val = data[0].cook_name_on_bank_acc;
                    update_col.push(update_fields);
                }
                if (data[0].branch_name != req.body.branch_name) {
                    var update_fields = {};
                    update_fields.field_name = "Cook Branch Name";
                    update_fields.field_attr = "branch_name";
                    update_fields.field_value = req.body.branch_name;
                    update_fields.old_val = data[0].branch_name;
                    update_col.push(update_fields);
                }
                if (data[0].bank_account_no != req.body.bank_account_no) {
                    var update_fields = {};
                    update_fields.field_name = "Cook Bank Account Number";
                    update_fields.field_attr = "bank_account_no";
                    update_fields.field_value = req.body.bank_account_no;
                    update_fields.old_val = data[0].bank_account_no;
                    update_col.push(update_fields);
                }
                if (data[0].bank_ifsc != req.body.bank_ifsc) {
                    var update_fields = {};
                    update_fields.field_name = "Cook Bank IFSC";
                    update_fields.field_attr = "bank_ifsc";
                    update_fields.field_value = req.body.bank_ifsc;
                    update_fields.old_val = data[0].bank_ifsc;
                    update_col.push(update_fields);
                }

                db.cook_infos.findAndModify({
                    query: { _id: mongojs.ObjectId(req.body.cook_id) },
                    update: {
                        $set: {

                            updated_fields: []


                        }
                    },
                    new: true
                }, function (err, data, lastErrorObject) {
                    if (err) {
                        res.status(400);
                        res.send('error');
                        throw err;

                    }

                    console.log('cook PROFILE NULL');
                });


                db.cook_infos.findAndModify({
                    query: { _id: mongojs.ObjectId(req.body.cook_id) },
                    update: {
                        $set: {

                            about_us: req.body.about_us,
                            cook_company_name: req.body.cook_company_name,

                            bank_type: req.body.bank_type,
                            bank_name: req.body.bank_name,
                            branch_name: req.body.branch_name,
                            isApproved: 'updated',
                            bank_ifsc: req.body.bank_ifsc,
                            cook_name_on_bank_acc: req.body.cook_name_on_bank_acc,
                            bank_account_no: req.body.bank_account_no,
                            updated_fields: update_col


                        }
                    },
                    new: true
                }, function (err, data, lastErrorObject) {
                    if (err) {
                        res.status(400);
                        res.send('error');
                        throw err;

                    }

                    res.status(200);
                    res.send(data);
                    console.log('cook PROFILE UPDATED');
                });

            });




    }
    else if (req.body.cook_banner_img != "") {
        dns.lookup(os.hostname(), function (err, add, fam) {


            var cook_bn_img = randomstring.generate(13);

            var cook_bn_img_for_web = '/uploads/cook_uploads/' + cook_bn_img + '.jpg';


            var cook_banner_img = add + ':3000/uploads/cook_uploads/' + cook_bn_img + '.jpg';



            fs.writeFile("client/uploads/cook_uploads/" + cook_bn_img + ".jpg", new Buffer(req.body.cook_banner_img, "base64"), function (err) {

                if (err) {

                    throw err;
                    console.log(err);
                    res.send(err)
                }
                else {
                    console.log('cook banner Img uploaded');
                    // res.send("success");
                    // console.log("success!");
                }

            });

            db.cook_infos.find({
                _id: mongojs.ObjectId(req.body.cook_id)
            }
                , function (err, data, lastErrorObject) {
                    if (err) {
                        res.status(400);
                        res.send('error');
                        throw err;

                    }


                    console.log(data[0].cook_name);

                    if (data[0].about_us != req.body.about_us) {
                        var update_fields = {};
                        update_fields.field_name = "About Cook";
                        update_fields.field_attr = "about_us";
                        update_fields.field_value = req.body.about_us;
                        update_fields.old_val = data[0].about_us;
                        update_col.push(update_fields);
                    }

                    if (data[0].cook_company_name != req.body.cook_company_name) {
                        var update_fields = {};
                        update_fields.field_name = "Company Name";
                        update_fields.field_attr = "cook_company_name";
                        update_fields.field_value = req.body.cook_company_name;
                        update_fields.old_val = data[0].about_us;
                        update_col.push(update_fields);
                    }
                    if (data[0].bank_type != req.body.bank_type) {
                        var update_fields = {};
                        update_fields.field_name = "Bank Type";
                        update_fields.field_attr = "bank_type";
                        update_fields.field_value = req.body.bank_type;
                        update_fields.old_val = data[0].bank_type;
                        update_col.push(update_fields);
                    }
                    if (data[0].cook_name_on_bank_acc != req.body.cook_name_on_bank_acc) {
                        var update_fields = {};
                        update_fields.field_name = "Cook Name On Bank Account";
                        update_fields.field_attr = "cook_name_on_bank_acc";
                        update_fields.field_value = req.body.cook_name_on_bank_acc;
                        update_fields.old_val = data[0].cook_name_on_bank_acc;
                        update_col.push(update_fields);
                    }
                    if (data[0].branch_name != req.body.branch_name) {
                        var update_fields = {};
                        update_fields.field_name = "Cook Branch Name";
                        update_fields.field_attr = "branch_name";
                        update_fields.field_value = req.body.branch_name;
                        update_fields.old_val = data[0].branch_name;
                        update_col.push(update_fields);
                    }
                    if (data[0].bank_account_no != req.body.bank_account_no) {
                        var update_fields = {};
                        update_fields.field_name = "Cook Bank Account Number";
                        update_fields.field_attr = "bank_account_no";
                        update_fields.field_value = req.body.bank_account_no;
                        update_fields.old_val = data[0].bank_account_no;
                        update_col.push(update_fields);
                    }
                    if (data[0].bank_ifsc != req.body.bank_ifsc) {
                        var update_fields = {};
                        update_fields.field_name = "Cook Bank IFSC";
                        update_fields.field_attr = "bank_ifsc";
                        update_fields.field_value = req.body.bank_ifsc;
                        update_fields.old_val = data[0].bank_ifsc;
                        update_col.push(update_fields);
                    }

                    var update_fields = {};
                    update_fields.field_name = "Cook Banner";
                    update_fields.field_attr = "cook_banner_img_for_web";

                    update_col.push(update_fields);

                    db.cook_infos.findAndModify({
                        query: { _id: mongojs.ObjectId(req.body.cook_id) },
                        update: {
                            $set: {

                                updated_fields: []


                            }
                        },
                        new: true
                    }, function (err, data, lastErrorObject) {
                        if (err) {
                            res.status(400);
                            res.send('error');
                            throw err;

                        }

                        console.log('cook PROFILE NULL');
                    });


                    db.cook_infos.findAndModify({
                        query: { _id: mongojs.ObjectId(req.body.cook_id) },
                        update: {
                            $set: {

                                about_us: req.body.about_us,
                                cook_company_name: req.body.cook_company_name,
                                cook_banner_img: cook_banner_img,
                                cook_banner_img_for_web: cook_bn_img_for_web,
                                bank_type: req.body.bank_type,
                                bank_name: req.body.bank_name,
                                branch_name: req.body.branch_name,
                                isApproved: 'updated',
                                bank_ifsc: req.body.bank_ifsc,
                                cook_name_on_bank_acc: req.body.cook_name_on_bank_acc,
                                bank_account_no: req.body.bank_account_no,
                                updated_fields: update_col


                            }
                        },
                        new: true
                    }, function (err, data, lastErrorObject) {
                        if (err) {
                            res.status(400);
                            res.send('error');
                            throw err;

                        }

                        res.status(200);
                        res.send(data);
                        console.log('cook PROFILE UPDATED');
                    });

                });


        });

    }




}




module.exports.get_cusines_list = function (req, res, next) {

    db.categories_infos.find({}
        , {
            _id: false,
            category_name: true,
            status: true
        }
        ,
        function (err, category) {

            if (err || category == "") {

                console.log(category);
                res.status(404);
                res.send('category not find');
            } else {

                console.log(category);
                res.status(200).send(category);

            }
        });

}


module.exports.get_occ_veg_list = function (req, res, next) {



    db.attributes_infos.find({},{attr_fields:1},function (err, attribute_infos) {

        if (err || !attribute_infos) console.log(err);
        else {

          //  var len=attribute_infos[0].groupname.length
         //   res.status(200).send(attribute_infos[0].groupname[0].group_fields);
            // var data=[];
            // var Occassions;
            // var Vegetable_type;

                           
            //     Occassions=attribute_infos[0].groupname[0].group_fields;
            //     Vegetable_type=attribute_infos[0].groupname[1].group_fields;
            
            //     data.push(Occassions);
            //     data.push(Vegetable_type);
                

                res.send(attribute_infos);
            console.log(attribute_infos);
        }
    });


}


module.exports.add_food_details = function (req, res, next) {

    var ip_details;
    console.log(req.body.food_details);
    var cook_name = "";
    db.cook_infos.find(
        {
            _id: mongojs.ObjectId(req.body.food_details.cook_id)

        },
        { cook_name: 1 }
        , function (err, cook) {

            if (err) {

                console.log(err);
                res.status(404);
                res.send('cook not found');
            } else {

                console.log(cook);
                cook_name = cook[0].cook_name;



                dns.lookup(os.hostname(), function (err, add, fam) {

                     var occ_len=req.body.food_details.occassion_list.length;
                    var cuss_len = req.body.food_details.cuisine_types.length;
                    var occ_data=[];
                    var cuss_data = [];
                    var available_hours = req.body.food_details.available_hours;
                    var date = new Date();
                    var img_name = date.getTime();

                    var food_img_for_web = '/uploads/cook_uploads/' + img_name + '.jpg';

                         for(var i=0;i<occ_len;i++)
                            {
                                    occ_data.push(req.body.food_details.occassion_list[i]);
                            }
                    for (var i = 0; i < cuss_len; i++) {
                        cuss_data.push(req.body.food_details.cuisine_types[i]);
                    }



                    var food_img = add + ':3000/uploads/cook_uploads/' + img_name + '.jpg';

                    fs.writeFile("client/uploads/cook_uploads/" + img_name + ".jpg", new Buffer(req.body.files, "base64"), function (err) {

                        if (err) {

                            throw err;
                            console.log(err);
                            res.send(err)
                        }
                        else {
                            console.log('FOod image uploaded');
                            // res.send("success");
                            // console.log("success!");
                        }

                    });

                    db.cook_infos.findAndModify(

                        {
                            query: { _id: mongojs.ObjectId(req.body.food_details.cook_id) },
                            update: {
                                $push: {
                                    'food_details': {
                                        _id: mongojs.ObjectId(),
                                        'food_selection': req.body.food_details.food_selection,
                                        'cook_name': cook_name,
                                        'food_name': req.body.food_details.food_name,
                                        'food_desc': req.body.food_details.food_desc,
                                        'food_price_per_plate': req.body.food_details.food_price_per_plate,
                                        'food_total_qty': req.body.food_details.food_total_qty,
                                        'food_min_qty': req.body.food_details.food_min_qty,
                                        'food_max_qty': req.body.food_details.food_max_qty,
                                        'cart_qty': '0',
                                        'food_isApproved': 'new',
                                        'food_status': 'Disable',
                                       'occassion_list':occ_data,
                                        'cuisine_list': cuss_data,
                                        'food_type': req.body.food_details.food_type,
                                        'selected_date_from': req.body.food_details.selected_date_from,
                                        'selected_date_to': req.body.food_details.selected_date_to,
                                        'delivery_by': req.body.food_details.delivery_by,
                                        'available_hours': available_hours,
                                        'food_img': food_img,
                                        'food_img_for_web': food_img_for_web

                                    },

                                }
                            },
                            new: true
                        }
                        , function (err, food, lastErrorObject) {
                            if (err) {
                                res.status(400);
                                res.send('error');
                                throw err;

                            }
                            else {


                                console.log('food adds');
                                res.status(200);
                                res.send(food);


                            }


                        });

                });

            }
        });






    // // //    db.attribute_infos.find(function(err, attribute_infos) {

    //   if( err || !attribute_infos) console.log(err);
    //   else 
    //       {
    //             res.status(200).send(attribute_infos);
    //             console.log(attribute_infos);
    //       }     
    // });

}
module.exports.get_cook_details = function (req, res, next) {

    console.log(req.body);
    db.cook_infos.find({ _id: mongojs.ObjectId(req.body.cook_id) }, function (err, cook_details) {

        if (err) console.log(err);

        else {
            res.status(200).send(cook_details[0].food_details)
            console.log(cook_details[0].food_details);
        }
    });

}



module.exports.remove_food_details = function (req, res, next) {

    console.log(req.body);

    db.cook_infos.findAndModify({
        query: { _id: mongojs.ObjectId(req.body.cook_id) },
        update: {
            $pull: { 'food_details': { _id: mongojs.ObjectId(req.body.food_id) } }

        }

    }, function (err, data, lastErrorObject) {
        if (err) {
            res.status(400);
            res.send('error');
            throw err;

        }
        console.log('deleted');
        res.status(200).send(data);

    });

}

module.exports.edit_food_details = function (req, res, next) {


    console.log(req.body);
    db.cook_infos.find({ 'food_details._id': mongojs.ObjectId(req.body.food_id) }, function (err, cook_details) {

        if (err) {
            res.status(400);
            res.send('error');
            throw err;
        }

        //   console.log(cook_details[0]);
        var len = cook_details[0].food_details.length;
        console.log(len);
        for (var i = 0; i < len; i++) {

            if (cook_details[0].food_details[i]._id == req.body.food_id) {

                res.status(200).send(cook_details[0].food_details[i]);
            }
            else {

            }
        }
        //  res.status(200).send(cook_details[0].food_details);


    });


}


module.exports.update_food_details = function (req, res, next) {

    console.log(req.body.update_food_details);
    dns.lookup(os.hostname(), function (err, add, fam) {

        if (req.body.files == "") {


             var occ_len=req.body.update_food_details.occassion_list.length;
            var cuss_len = req.body.update_food_details.cuisine_list.length;
            var occ_data=[];
            var cuss_data = [];

            var available_hours = req.body.update_food_details.available_hours;

            console.log(available_hours);
            for(var i=0;i<occ_len;i++)
            {
                    occ_data.push(req.body.update_food_details.occassion_list[i]);
            }

            for (var i = 0; i < cuss_len; i++) {
                cuss_data.push(req.body.update_food_details.cuisine_list[i]);
            }


            db.cook_infos.findAndModify({
                query: { 'food_details._id': mongojs.ObjectId(req.body.food_id) },
                update: {
                    $set: {
                        'food_details.$.food_selection': req.body.update_food_details.food_selection,
                        'food_details.$.food_name': req.body.update_food_details.food_name,
                        'food_details.$.food_desc': req.body.update_food_details.food_desc,
                        'food_details.$.food_price_per_plate': req.body.update_food_details.food_price_per_plate,
                        'food_details.$.food_total_qty': req.body.update_food_details.food_total_qty,
                        'food_details.$.food_min_qty': req.body.update_food_details.food_min_qty,
                        'food_details.$.food_max_qty': req.body.update_food_details.food_max_qty,
                         'food_details.$.occassion_list':occ_data,
                        'food_details.$.cuisine_list': cuss_data,
                        'food_details.$.available_hours': available_hours,
                        'food_details.$.selected_date_from': req.body.update_food_details.selected_date_from,
                        'food_details.$.selected_date_to': req.body.update_food_details.selected_date_to,

                    }

                }
                ,
                new: true
            }, function (err, data, lastErrorObject) {
                if (err) {
                    res.status(400);
                    res.send('error');
                    throw err;

                }

                else {
                    console.log(data);
                    console.log('Name UPdated');


                }

                res.status(200).send('success');
            });
        }
        else {

            var img_name = date.getTime();

            var food_img_for_web = '/uploads/cook_uploads/' + img_name + '.jpg';

            var food_img = add + ':3000/uploads/cook_uploads/' + img_name + '.jpg';

            fs.writeFile("client/uploads/cook_uploads/" + img_name + ".jpg", new Buffer(req.body.files, "base64"), function (err) {

                if (err) {

                    throw err;
                }
                else {
                    console.log('FOod image uploaded');
                    // res.send("success");
                    // console.log("success!");
                }

            });


            var occ_len=req.body.update_food_details.occassion_list.length;
            var cuss_len = req.body.update_food_details.cuisine_list.length;
             var occ_data=[];
            var cuss_data = [];

            var available_hours = req.body.update_food_details.available_hours;

            console.log(available_hours);

             for(var i=0;i<occ_len;i++)
            {
                    occ_data.push(req.body.update_food_details.occassion_list[i]);
            }

            for (var i = 0; i < cuss_len; i++) {
                cuss_data.push(req.body.update_food_details.cuisine_list[i]);
            }

            db.cook_infos.findAndModify({





                query: { 'food_details._id': mongojs.ObjectId(req.body.update_food_details._id) },
                update: {
                    $set: {
                        'food_details.$.food_selection': req.body.update_food_details.food_selection,
                        'food_details.$.food_name': req.body.update_food_details.food_name,
                        'food_details.$.food_desc': req.body.update_food_details.food_desc,
                        'food_details.$.food_price_per_plate': req.body.update_food_details.food_price_per_plate,
                        'food_details.$.food_total_qty': req.body.update_food_details.food_total_qty,
                        'food_details.$.food_min_qty': req.body.update_food_details.food_min_qty,
                        'food_details.$.food_max_qty': req.body.update_food_details.food_max_qty,
                         'food_details.$.occassion_list':occ_data,
                        'food_details.$.cuisine_list': cuss_data,
                        'food_details.$.available_hours': available_hours,
                        'food_details.$.selected_date_from': req.body.update_food_details.selected_date_from,
                        'food_details.$.selected_date_to': req.body.update_food_details.selected_date_to,


                        'food_details.$.food_img': food_img_for_web,


                    }

                }
                ,
                new: true
            }, function (err, data, lastErrorObject) {
                if (err) {
                    res.status(400);
                    res.send('error');
                    throw err;

                }

                else {
                    console.log(data);
                    console.log('Name UPdated');


                }

                res.status(200).send('success');
            });
        }


    });


}  
module.exports.get_cook_activation_status = function (req, res, next) {


  db.cook_infos.find(
        {
            _id: mongojs.ObjectId(req.body.cook_id)

        }
        , function (err, cook) {

            if (err || cook == "") {

                console.log(err);
                res.status(404);
                res.send('cook not find');
            } else {

                console.log('PROFILE DATA');
                console.log(cook[0].isApproved);
                res.status(200).send(cook[0].isApproved);

            }
        });

}


