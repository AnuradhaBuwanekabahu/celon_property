import crypto from "crypto";


const MERCHANT_ID = process.env.PAYHERE_MERCHANT_ID;

const MERCHANT_SECRET = process.env.PAYHERE_MERCHANT_SECRET;



export const generatePayhereHash = (
    orderId,
    amount,
    currency="LKR"
)=>{

    const formattedAmount = Number(amount).toFixed(2);


    const hashedSecret = crypto
        .createHash("md5")
        .update(MERCHANT_SECRET)
        .digest("hex")
        .toUpperCase();



    const hashString =
        MERCHANT_ID +
        orderId +
        formattedAmount +
        currency +
        hashedSecret;



    return crypto
        .createHash("md5")
        .update(hashString)
        .digest("hex")
        .toUpperCase();

};





export const verifyPayhereSignature = (
    merchantId,
    orderId,
    amount,
    currency,
    statusCode,
    receivedMd5sig
)=>{


    const hashedSecret = crypto
        .createHash("md5")
        .update(MERCHANT_SECRET)
        .digest("hex")
        .toUpperCase();



    const localHash = crypto
        .createHash("md5")
        .update(
            merchantId +
            orderId +
            amount +
            currency +
            statusCode +
            hashedSecret
        )
        .digest("hex")
        .toUpperCase();



    return localHash === receivedMd5sig;

};