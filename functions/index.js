require('dotenv').config();

const { VK, Keyboard, Carousel } = require('node-vk-bot-api');

const bot = new VK({
    token: process.env.VK_TOKEN,
    webhookSecret: process.env.VK_SECRET,

});

exports.handler = async (event, context) => {
    const body = JSON.parse(event.body);
    const { type, group_id, secret } = body;

    if (secret !== process.env.VK_SECRET || group_id !== parseInt(process.env.VK_GROUP_ID, 10)) {
        return {
            statusCode: 403,
            body: 'Forbidden',
        };
    }

    if (type === 'confirmation') {
        return {
            statusCode: 200,
            body: process.env.VK_CONFIRMATION,
        };
    }

    await vk.updates.handleWebhookUpdate(body);

    return {
        statusCode: 200,
        body: 'OK',
    };
};

bot.on((ctx) => {
    const message = ctx.message.text.toLowerCase();
  
    if (message === 'карусель') {
      ctx.reply({
        message: 'Вот наша карусель с турами:',
        template: JSON.stringify({
          type: 'carousel',
          elements: [
            {
              title: 'Тур 1: Горы Дагестана',
              description: 'Невероятные виды на горы и каньоны.',
              photo_id: '-12345678_123456789', // ID изображения из ВК (пример)
              action: {
                type: 'open_link',
                link: 'https://example.com/tour1',
              },
            },
            {
              title: 'Тур 2: Море и солнце',
              description: 'Отдых на побережье Каспия.',
              photo_id: '-12345678_987654321', // ID изображения из ВК (пример)
              action: {
                type: 'open_link',
                link: 'https://example.com/tour2',
              },
            },
            {
              title: 'Тур 3: Культура и традиции',
              description: 'Познакомьтесь с культурой Дагестана.',
              photo_id: '-12345678_654321987', // ID изображения из ВК (пример)
              action: {
                type: 'open_link',
                link: 'https://example.com/tour3',
              },
            },
          ],
        }),
      });
    } else {
      ctx.reply('Привет! Напиши "карусель", чтобы посмотреть туры.');
    }
  });
  
