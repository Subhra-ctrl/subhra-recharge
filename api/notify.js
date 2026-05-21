import dotenv from "dotenv";
dotenv.config();
console.log(process.env.TELEGRAM_BOT_TOKEN);
console.log(process.env.TELEGRAM_CHAT_ID);

import axios from "axios";

export default async function handler(req, res) {

    if (req.method !== "POST") {

        return res.status(405).json({
            message: "Method Not Allowed"
        });

    }

    try {

        const {
            mobile,
            operator,
            amount
        } = req.body;

        const message = `
🔔 NEW RECHARGE REQUEST

📱 Mobile Number:
${mobile}

📡 Operator:
${operator}

💰 Amount:
₹${amount}

-------------------------

নতুন রিচার্জ রিকোয়েস্ট

মোবাইল নম্বর:
${mobile}

অপারেটর:
${operator}

রিচার্জ পরিমাণ:
₹${amount}
`;

const telegramURL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

        await axios.post(telegramURL, {

            chat_id: process.env.TELEGRAM_CHAT_ID,

            text: message

        });

        return res.status(200).json({

            success: true

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false

        });

    }

}