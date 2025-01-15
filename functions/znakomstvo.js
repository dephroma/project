require('dotenv').config();

const { VK, Keyboard } = require('vk-io');

const vk = new VK({
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

vk.updates.on('message_new', async (context) => {
    const text = context.text.trim().toLowerCase();
    console.log('Получено сообщение:', text);


    if (['гуга', 'блэд', 'bye'].includes(text)) {
        await context.send({
            message: "Поздравляем вас с выбором экскурсии! 🚀\n\n" +
                     "Чтобы продолжить процесс бронирования или получить дополнительную информацию, вы можете воспользоваться кнопками ниже.\n\n" +
                     "Если у вас есть вопросы, не стесняйтесь обращаться к нам. Мы рады помочь! 😉",
            keyboard: Keyboard.keyboard([
                [Keyboard.textButton({ label: '\u{1f4b5} Условия оплаты и бронирование', color: Keyboard.POSITIVE_COLOR })],
                [Keyboard.textButton({ label: '\u{1f4cc} Информация об экскурсии', color: Keyboard.PRIMARY_COLOR })],
                [Keyboard.textButton({ label: '\u{1f5d3} Даты экскурсий', color: Keyboard.NEGATIVE_COLOR })],
            ]).oneTime(),
        });
    } 
    
    else if (text === '\u{1f5d3} даты экскурсий') {
        await context.send({
            message: "🗓️ Даты экскурсий.\n\n" +
                     "Расписание здесь👇\n" +
                     "Здесь будет ссылка на актуальные даты поездок.\n\n" +
                     "Если ссылки нет, напишите желаемую дату тура при бронировании.\n\n" +
                     "Группы из 4+ человек могут выбрать любую удобную дату и путешествовать своей компанией.",
            keyboard: Keyboard.keyboard([
                [Keyboard.textButton({ label: '\u{1f4cc} Информация об экскурсии', color: Keyboard.PRIMARY_COLOR })],
                [Keyboard.textButton({ label: '\u{1f4b5} Забронировать', color: Keyboard.POSITIVE_COLOR })],
                [Keyboard.textButton({ label: '\u{21a9} Назад', color: Keyboard.SECONDARY_COLOR })],
            ]).oneTime(),
        });
    } 
    
    else if (text === '\u{1f4b5} забронировать') {
        await context.send({
            message: "Спасибо, ваша заявка на бронь успешно принята! 🤝\n\n" +
                     "Скоро с вами свяжется наш менеджер для уточнения деталей. Для ускорения обработки напишите:\n\n" +
                     "1. Желаемую дату тура\n" +
                     "2. Количество человек (и детей, если есть)\n\n" +
                     "Советуем ознакомиться с разделом \"❓ Частые вопросы\". Желаем незабываемых впечатлений в вашем путешествии! 🦅",
            keyboard: Keyboard.keyboard([
                [Keyboard.textButton({ label: '\u{21a9} Назад', color: Keyboard.SECONDARY_COLOR })],
                [Keyboard.textButton({ label: '\u{1f4c5} Меню', color: Keyboard.PRIMARY_COLOR })],
                [Keyboard.textButton({ label: '\u{1f4ac} Частые вопросы FAQ', color: Keyboard.NEGATIVE_COLOR })],
            ]).oneTime(),
        });
    }

    else if (text === '\u{1f4b5} условия оплаты и бронирование') {
        await context.send({
            message: "Благодарим вас за интерес к нашим туристическим услугам!🫶\n\n" +
                     "Для обеспечения надежности вашей брони и подготовки вашего путешествия, мы вводим систему предоплаты в размере 10% от общей стоимости экскурсии.\n\n" +
                     "Эта предоплата необходима для того, чтобы гарантировать ваше участие в выбранной программе и избежать случаев, когда клиент решает отказаться от поездки уже после того, как были забронированы машины, гостиницы, места в ресторане, а также приобретены билеты на мероприятия. Путешествия требуют планирования, и ваша предоплата поможет нам организовать все нужные аспекты вашего отдыха.\n\n" +
                     "Спасибо за понимание, с нетерпением ждем возможности создать вам незабываемые впечатления!",
                    });
    
                    await new Promise(resolve => setTimeout(resolve, 1000));
    
        await context.send({
            message: "Мы готовы предоставить вам скидку 10%, если ваша группа состоит из 4 человек и более.\n\n" +
                     "Обратите внимание - если вы планируете поездку вдвоём или в одиночку, и нужная группа не наберётся (например, не сезон) - стоимость может измениться, либо вам предложат выбрать другой день. Цена всегда закрепляется заранее, до поездки.\n\n" +
                     "Если у вас есть друзья или знакомые, которые тоже любят путешествия, подумайте о том, чтобы отправиться в поездку вместе. Наша команда всегда готова помочь вам организовать идеальный отдых в хорошей компании!\n\n" +
                     "Так же можем организовать эту поездку в виде частной экскурсии (малая группа), условия обсуждаются индивидуально.",
            keyboard: Keyboard.keyboard([
                [Keyboard.textButton({ label: '\u{1f4b5} Забронировать', color: Keyboard.POSITIVE_COLOR })],
                [Keyboard.textButton({ label: '\u{21a9} Назад', color: Keyboard.SECONDARY_COLOR })],
            ]).oneTime(),
        });
    }


    else if (text === '\u{21a9} назад') {
        await context.send({
            message: "Привет, дорогой путешественник!\n👋 Я — ваш виртуальный гид.\n Чем могу помочь?",
            keyboard: Keyboard.keyboard([
                [Keyboard.textButton({ label: '\u{1f4cc} Информация об экскурсии', color: Keyboard.PRIMARY_COLOR })],
                [Keyboard.textButton({ label: '\u{1f4b5} Забронировать', color: Keyboard.POSITIVE_COLOR })],
                [Keyboard.textButton({ label: '\u{21a9} Назад', color: Keyboard.SECONDARY_COLOR })],
            ]).oneTime(),
        });
    } 



    else {
        await context.send({
            message: "Я не понимаю ваш запрос. Пожалуйста, используйте кнопки меню или напишите ваш вопрос, и мы ответим вам в ближайшее время."
        });
    }
    
});
