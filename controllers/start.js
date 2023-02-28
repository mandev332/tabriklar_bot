import { config } from "dotenv";
config();
import fs from "fs";
import path from "path";
import TelegramBot from "node-telegram-bot-api";

import {
  kim,
  tarif,
  munosabat,
  shahar,
  tumshah,
  kimdan,
  shart,
} from "../buttons/inline.js";

const bot = new TelegramBot(process.env.API_KEY, {
  polling: true,
});

const admin = process.env.ADMIN;

export let happies = {};

export const start = async (msg) => {
  try {
    if (msg.from.is_bot) return;

    const id = msg.from.id;
    if (id == admin) {
      await bot.sendSticker(
        admin,
        "https://tlgrm.eu/_/stickers/380/9fb/3809fbe6-317b-3085-99e6-09e74c1044b0/2.webp",
        {
          reply_markup: {
            keyboard: tarif,
            resize_keyboard: true,
          },
        }
      );
    } else {
      happies[id] = {};
      happies[id]["page"] = 1;
      await bot.sendSticker(
        id,
        "https://tlgrm.eu/_/stickers/380/9fb/3809fbe6-317b-3085-99e6-09e74c1044b0/11.webp"
      );
      await bot.sendMessage(
        id,
        "Assalomu alaykum!\n" +
          msg.from.first_name +
          "\nYAQINLARGA TABRIKLAR🎂\nkanalining botiga murojat qildingiz!",
        {
          reply_markup: {
            keyboard: kim,
            resize_keyboard: true,
          },
        }
      );
      happies[id]["tabriklovchi"] =
        msg.from.first_name + "  @" + msg.from.username;
      await bot.sendMessage(
        id,
        "\nKimni tabriklashimizni xohlaysiz?\nBo'limdan topilmasa so'z bilan yozing!"
      );
    }
  } catch (error) {}
};

export const message = async (msg) => {
  try {
    let kimi = msg.text.charAt(0).toUpperCase() + msg.text.slice(1);
    const chat_id = msg.from.id;
    if (msg.from.is_bot) return;
    if (kimi && happies[chat_id]["page"] == 1) {
      happies[chat_id]["page"] += 1;
      happies[chat_id]["kimi"] = kimi;

      bot.sendMessage(
        chat_id,
        "Uning qanday qutlug' kuni?\nBo'limdan topilmasa so'z bilan yozing!",
        {
          reply_markup: {
            keyboard: munosabat,
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        }
      );
    } else if (kimi && happies[chat_id]["page"] == 2) {
      happies[chat_id]["page"] += 1;
      happies[chat_id]["munosabat"] = kimi;
      let savol = "";

      kimi == "Tavallud kun"
        ? (savol = "Necha yoshga kirdilar?")
        : kimi == "To'y bo'lgan kun"
        ? (savol = "Necha yil bo'ldi?")
        : kimi == "Farzandli bo'lgan"
        ? (savol = "Ismini nima qo'ydi?")
        : null;
      if (savol) bot.sendMessage(chat_id, savol);
      else {
        happies[chat_id]["page"] += 1;
        bot.sendMessage(chat_id, "Qaysi hududda istiqomat qiladilar?", {
          reply_markup: {
            keyboard: shahar,
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        });
      }
    } else if (kimi && happies[chat_id]["page"] == 3) {
      happies[chat_id]["page"] += 1;
      happies[chat_id]["annigi"] = kimi;
      bot.sendMessage(chat_id, "Qaysi hududda istiqomat qiladilar?", {
        reply_markup: {
          keyboard: shahar,
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      });
    } else if (
      (kimi && happies[chat_id]["page"] == 4) ||
      [
        "Andijon",
        "Namangan",
        "Farg'ona",
        "Toshkent",
        "Sirdaryo",
        "Jizzax",
        "Samarqand",
        "Boxoro",
        "Navoiy",
        "Qashqadaryo",
        "Surxondaryo",
        "Xorazim",
        "Qoraqolpog'iston",
      ].includes(kimi)
    ) {
      happies[chat_id]["page"] += 1;
      happies[chat_id]["kimdan"] = [];
      happies[chat_id]["kocha_nomi"] = kimi;
      bot.sendMessage(
        chat_id,
        happies[chat_id].kimi + "ning ismi va familyasi?"
      );
    } else if (kimi && happies[chat_id]["page"] == 5) {
      if (kimi != "⏩") {
        !happies[chat_id]["ismi"]
          ? (happies[chat_id]["ismi"] = kimi)
          : happies[chat_id]["kimdan"].push(kimi);
        await bot.sendMessage(
          chat_id,
          !happies[chat_id]["kimdan"].length
            ? "Tabrik kimlarning nomidan?"
            : "Yana...",
          {
            reply_markup: {
              keyboard: kimdan.map((arr) =>
                arr.filter(
                  (el) =>
                    !happies[chat_id]["kimdan"].includes(el.text) &&
                    happies[chat_id]["kimi"].slice(0, 3) != el.text.slice(0, 3)
                )
              ),
            },
            resize_keyboard: true,
            remove_keyboard: kimi == "⏩" ? true : false,
          }
        );
      } else {
        happies[chat_id]["page"] += 1;
        happies[chat_id]["desc"] = 1;
        bot.sendMessage(
          chat_id,
          happies[chat_id].kimi + " uchun 1 tadan 10 tagacha rasm yuboring!",
          {
            reply_markup: {
              keyboard: [[{ text: "📎" }]],
              resize_keyboard: true,
              remove_keyboard: true,
            },
          }
        );
      }
    }
  } catch (err) {}
};

export const photo = async (msg) => {
  try {
    const chat_id = msg.from.id;
    let yangi = happies[chat_id];
    let Path = await bot.downloadFile(
      msg.photo[msg.photo.length - 1].file_id,
      "./images/"
    );
    let yaqinlar = "";
    yangi["kimdan"].map((e) => (yaqinlar += e + ", "));
    let desc = "";
    if (happies[chat_id]["desc"] != 2) {
      happies[chat_id]["desc"] = 2;
      desc = `
     ${yangi["ismi"]} ${yangi["kimi"]}izni 
${yangi["munosabat"]}i bilan  ${yaqinlar} 
tomonidan 
    
🥳🤩 TABRIKNOMA 🤩🥳

😍Siz ham yaqin🥳 insonizga shunday tabrik😘 qilishni istasangiz murojat qiling
👇👇👇👇👇👇👇
@tabrik_uchun_bot
👆👆👆👆👆👆👆
Tez orada Javob yo'llaymiz HURSANDCHILIK TILAYMIZ❤️🥳🤩
    `;
    }

    await bot.sendPhoto(admin, "./" + Path, {
      caption: desc,
      parse_mode: "HTML",
    });

    fs.unlink(path.join("./" + Path), (err) => {
      if (err) console.log(err.message);
    });
    if (happies[chat_id]["desc"] == 2) {
      happies[chat_id]["desc"] = 0;

      await bot.sendMessage(
        chat_id,
        "Admin bog'lanishi uchun\nTelefon raqmingizni jo'nating",
        {
          reply_markup: {
            keyboard: [
              [
                {
                  text: "Telefon 📞",
                  request_contact: true,
                },
              ],
            ],
            resize_keyboard: true,
            one_time_keyboard: true,
            remove_keyboard: true,
          },
        }
      );
    }
  } catch (error) {}
};

export const contact = async (msg) => {
  try {
    const chat_id = msg.from.id;
    happies[chat_id]["contact"] = msg.contact.phone_number;
    await bot.sendSticker(
      chat_id,
      "https://tlgrm.eu/_/stickers/380/9fb/3809fbe6-317b-3085-99e6-09e74c1044b0/4.webp"
    );
    bot.sendPhoto(chat_id, path.join("./images", "shart.jpg"), {
      caption: "30 ming to'lov qilasizmi?\n50 ta odam qo'shasizmi?",
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: shart,
      },
    });
  } catch (error) {}
};

export const callback = async (msg) => {
  try {
    if (msg.from.is_bot == true) return;
    const chat_id = msg.from.id;

    bot.sendMessage(
      admin,
      `${msg.data} : ${happies[chat_id]["tabriklovchi"]} ${happies[chat_id]["contact"]}`
    );
    bot.sendMessage(chat_id, "Siz bilan Admin bog'lanadi!", {
      reply_markup: {
        keyboard: [[{ text: "/start" }]],
        remove_keyboard: true,
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
    happies[chat_id] = null;
  } catch (error) {
    console.log(error.message);
  }
};
export default bot;
