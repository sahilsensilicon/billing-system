const nodemailer = require("nodemailer");
const easyinvoice = require("easyinvoice");
const express = require("express");
const router = express.Router();
const Bills = require("../model/billing")
const url = require('url'); 



router.get('/',(req,res)=>{
    res.render('index');
})

router.get('/print',(req,res)=> { 
   
   let billing = req.query;
   console.log(billing);
   res.render("print",{billing:req.query});
})

/*router.post('/submit', (req,res)=>{
 
    Bills(req.body).save();
    res.redirect(url.format({
       pathname:"/print",
       query:req.body,
     }))
});*/
router.post('/submit', async (req, res) => {

    try {

        // Save data
        await Bills(req.body).save();

        // Invoice Data
        const data = {
            currency: "USD",
            taxNotation: "vat",

            sender: {
                company: "Sample Corp",
                address: "Sample Street 123",
                zip: "1234 AB",
                city: "Sampletown",
            },

            client: {
                company: req.body.Name,
                zip: req.body.Email,
                country: req.body.PhnNo,
            },

            invoiceNumber: "2026-0001",
            invoiceDate: new Date().toLocaleDateString(),

            products: [
                {
                    quantity: "1",
                    description: req.body.ItemDesc,
                    tax: 10,
                    price: req.body.Amount
                }
            ],

            bottomNotice: "Thank you for Buying!! :)",
        };

        // Generate Invoice PDF
        const result = await easyinvoice.createInvoice(data);

        // Mail Transport
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Send Email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: req.body.Email,
            subject: 'Invoice Copy',

            text: 'Please find attached invoice.',

            attachments: [
                {
                    filename: 'invoice.pdf',
                    content: Buffer.from(result.pdf, 'base64'),
                    encoding: 'base64'
                }
            ]
        });

        console.log("Invoice email sent!");

        // Existing download flow continues
        res.redirect(url.format({
            pathname: "/print",
            query: req.body,
        }));

    } catch (error) {

        console.log(error);
        res.send("Error");

    }

});

module.exports = router;