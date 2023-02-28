import { config } from "dotenv";
config();

import bot, {
  start,
  message,
  callback,
  photo,
  contact,
} from "../controllers/start.js";

bot.on("error", console.error);
const admin = process.env.ADMIN;

bot.onText(/\/start/, start);

bot.on("message", message);

bot.on("photo", photo);

bot.on("callback_query", callback);

bot.on("location", async (msg) => {
  const chat_id = msg.from.id;
  if (productlar.length) {
    chat += 1;
    const { latitude, longitude } = msg.location;
    let locatsiya = await geoFinder(latitude, longitude);
    Adress = locatsiya.results[0].formatted;
    bot.sendMessage(chat_id, "Manzilingiz: " + Adress + " ni tasdiqlang!", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "✅",
              callback_data: "loc_ok",
            },
            {
              text: "❌",
              callback_data: "X",
            },
          ],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
    con = 1;
  } else {
    await bot.sendSticker(
      chat_id,
      "https://tlgrm.eu/_/stickers/380/9fb/3809fbe6-317b-3085-99e6-09e74c1044b0/1.webp"
    );
    bot.sendMessage(chat_id, "Avval mahsulot tanlang!");
  }
});

bot.on("contact", contact);
