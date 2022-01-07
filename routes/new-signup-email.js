const express = require('express')
const router = express.Router()
const mailchimp = require("@mailchimp/mailchimp_marketing")

router.post("/", (req,res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const phone = req.body.phone;
    const listId = process.env.LIST_ID;
    //Creating an object with the users data
    const subscribingUser = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone
    };
    console.log(subscribingUser.phone);
    //Uploading the data to the server
    async function run() {
      const response = await mailchimp.lists.addListMember(listId, {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName,
        PHONE: subscribingUser.phone
        }
      });
    //If all goes well logging the contact's id and render success page
        res.render("success-fail/success")
        console.log(`Successfully added contact as an audience member. The contact's id is ${response.id}.`);
    }
    // catch statement on failed posts
        run().catch(e =>  res.render("success-fail/failure"))
  });

  module.exports = router