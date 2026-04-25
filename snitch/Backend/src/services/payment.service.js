import Razorpay from "razorpay";
import { Config } from "../config/config.js";


const razorpay = new Razorpay({
    key_id: Config.RAZORPAY_KEY_ID,
    key_secret: Config.RAZORPAY_KEY_SECRET
})



export const createOrder = async ({ amount, currency = "INR" }) => {
    const options = {
        amount: amount * 100, // amount in the smallest currency unit
        currency,
    }
    // 1 INR = 100 paise so we multiply by 100 to convert to paise before sending it to Razorpay. Razorpay expects the amount to be in the smallest currency unit, which is paise for INR.


    const order = await razorpay.orders.create(options);
    return order;
}