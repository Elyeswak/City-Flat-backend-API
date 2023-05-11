import fetch from "node-fetch";
import dotenv from "dotenv";
import paypal from "paypal-rest-sdk";

const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET } = process.env;

//paypal config
paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id: PAYPAL_CLIENT_ID,
  client_secret: PAYPAL_APP_SECRET,
});

export async function Paypalexecute(amount, req, res) {
  var execute_payment_json = {
    payer_id: req.query.PayerID,
    transactions: [
      {
        amount: {
          currency: "eur",
          total: amount,
        },
      },
    ],
  };

  var paymentId = req.query.paymentId;

  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    function (error, payment) {
      if (error) {
        console.log(error.response);
        throw error;
      } else {
        res.status(200).json({ message: "success payment !" });

        console.log(JSON.stringify(payment));
      }
    }
  );
}

export async function PaypalPay(amount, req, res) {
  var create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://127.0.0.1:9090/paypal/success",
      cancel_url: "http://127.0.0.1:9090/paypal/cancel",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: "item",
              sku: "item",
              price: amount,
              currency: "eur",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "eur",
          total: amount,
        },
        description: "This is the payment description.",
      },
    ],
  };

  paypal.payment.create(create_payment_json, (error, payment) => {
    if (error) {
      throw error;
    } else {
      console.log("Create Payment Response");
      console.log(payment);
      for (var index = 0; index < payment.links.length; index++) {
        //Redirect user to this endpoint for redirect url
        if (payment.links[index].rel === "approval_url") {
          res.redirect(payment.links[index].href);
          console.log("Redirected to approval_url successfully");
        }
      }
    }
  });
}
//paypal-wa-mou-daijobu