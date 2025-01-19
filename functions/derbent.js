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


    if (['Дербент'].includes(text)) {
        await context.send({
            message: "Поздравляем вас с выбором экскурсии! 🚀\n\n" +
                     "Чтобы продолжить процесс бронирования или получить дополнительную информацию, воспользуйтесь кнопками ниже.\n\n" +
                     "Если возникнут вопросы, всегда рады помочь! 😉",
            keyboard: Keyboard.keyboard([
                [Keyboard.textButton({ label: '\u{1f4b5} Условия оплаты и бронирование', color: Keyboard.POSITIVE_COLOR })],
                [Keyboard.textButton({ label: '\u{1f4cc} Информация об экскурсии', color: Keyboard.PRIMARY_COLOR })],
                [Keyboard.textButton({ label: '\u{1f5d3} Даты экскурсий', color: Keyboard.NEGATIVE_COLOR })],
            ]).oneTime()
        });
        return responseText;
    }
    
    // Даты экскурсий
    else if (text === '\u{1f5d3} даты экскурсий') {
        await context.send({
            message: "🗓️ Даты экскурсий.\n\n" +
                     "Посмотрите актуальное расписание здесь👇\n" +
                     "Ссылка на актуальные даты туров будет доступна здесь.\n\n" +
                     "Если ссылки нет, просто напишите желаемую дату тура при бронировании.\n\n" +
                     "Группы из 4+ человек могут выбрать любую удобную дату для путешествия.",
            keyboard: Keyboard.keyboard([
                [Keyboard.textButton({ label: '\u{1f4cc} Информация об экскурсии', color: Keyboard.PRIMARY_COLOR })],
                [Keyboard.textButton({ label: '\u{1f4b5} Забронировать', color: Keyboard.POSITIVE_COLOR })],
                [Keyboard.textButton({ label: '\u{21a9} Назад', color: Keyboard.SECONDARY_COLOR })],
            ]).oneTime()
        });
        return responseText;
    }
    
    // Бронирование
    else if (text === '\u{1f4b5} забронировать') {
        await context.send({
            message: "Спасибо за заявку на бронь! 🤝\n\n" +
                     "Наш менеджер скоро свяжется с вами для уточнения деталей.\n\n" +
                     "Для ускорения процесса уточните:\n\n" +
                     "1. Желаемую дату тура\n" +
                     "2. Количество человек (и детей, если есть)\n\n" +
                     "Рекомендуем ознакомиться с разделом \"❓ Частые вопросы\". Пусть ваше путешествие будет незабываемым! 🦅",
            keyboard: Keyboard.keyboard([
                [Keyboard.textButton({ label: '\u{21a9} Назад', color: Keyboard.SECONDARY_COLOR })],
                [Keyboard.textButton({ label: '\u{1f4c5} Меню', color: Keyboard.PRIMARY_COLOR })],
                [Keyboard.textButton({ label: '\u{1f4ac} Часто задаваемые вопросы', color: Keyboard.NEGATIVE_COLOR })],
            ]).oneTime()
        });
        return responseText;
    }
    
    // Условия оплаты и бронирование
    else if (text === '\u{1f4b5} условия оплаты и бронирование') {
        await context.send({
            message: "Спасибо за интерес к нашим услугам! 🫶\n\n" +
                     "Для надежности брони и подготовки тура мы применяем систему предоплаты 10% от общей стоимости.\n\n" +
                     "Эта предоплата необходима для обеспечения вашего участия и предотвращения отказа после бронирования. Путешествие требует подготовки, и ваша предоплата помогает нам организовать все аспекты.\n\n" +
                     "Благодарим за понимание, мы ждем вас с нетерпением!",
            keyboard: Keyboard.keyboard([
                [Keyboard.textButton({ label: '\u{1f4b5} Забронировать', color: Keyboard.POSITIVE_COLOR })],
                [Keyboard.textButton({ label: '\u{21a9} Назад', color: Keyboard.SECONDARY_COLOR })],
            ]).oneTime()
        });
    
        await new Promise(resolve => setTimeout(resolve, 1000));
    
        await context.send({
            message: "Мы предлагаем скидку 10%, если ваша группа состоит из 4 и более человек.\n\n" +
                     "Имейте в виду, что если группа не наберется (например, в несезон), стоимость может измениться, или вам предложат выбрать другой день. Цена всегда фиксируется заранее, до поездки.\n\n" +
                     "Если у вас есть друзья или знакомые, которые тоже хотят путешествовать, подумайте о совместной поездке! Мы всегда готовы помочь организовать незабываемое путешествие.\n\n" +
                     "Также можно организовать частную экскурсию для небольшой группы, условия обсуждаются индивидуально.",
            keyboard: Keyboard.keyboard([
                [Keyboard.textButton({ label: '\u{1f4b5} Забронировать', color: Keyboard.POSITIVE_COLOR })],
                [Keyboard.textButton({ label: '\u{21a9} Назад', color: Keyboard.SECONDARY_COLOR })],
            ]).oneTime()
        });
        return responseText;
    }
    
    // Часто задаваемые вопросы FAQ
    else if (text === '\u{1f4ac} часто задаваемые вопросы') {
        await context.send({
            message: "📝 Часто задаваемые вопросы:\n\n" +
                     "1. Где найти полную программу тура?\n" +
                     "Зайдите в раздел «Статьи» для полного описания туров.\n\n" +
                     "2. Можно ли брать детей?\n" +
                     "Дети до 3-х лет едут бесплатно, но на каждого ребенка должен быть 1 взрослый.\n\n" +
                     "3. Когда оплачивается тур?\n" +
                     "4. Что входит в стоимость тура?\n" +
                     "5. Оплачиваете ли вы перелет?\n" +
                     "6. Входит ли катание на катере?\n" +
                     "7. Как и когда кормят?\n" +
                     "8. Сколько человек в группе?\n" +
                     "9. Что взять с собой?\n" +
                     "10. Как одеваться в Дагестане?\n" +
                     "11. Где посмотреть отзывы?\n" +
                     "12. Какой мобильный сигнал в поездке?\n" +
                     "13. Что с техподдержкой?\n" +
                     "14. Нужна ли страховка?\n" +
                     "15. Где можно оставить жалобу?\n" +
                     "16. Какие документы нужны для поездки?\n" +
                     "17. Можно ли брать домашних животных?\n" +
                     "18. Какая погода в Дагестане?",
            keyboard: Keyboard.keyboard([
                [Keyboard.textButton({ label: '\u{21a9} Назад', color: Keyboard.SECONDARY_COLOR })],
            ]).oneTime()
        });
        return responseText;
    }
    
    // Информация об экскурсии
    else if (text === '\u{1f4cc} информация об экскурсии') {
        await context.send({
            message: "Вся информация по экскурсии представлена в специальной статье. Здесь вы найдете детали маршрута, программу и важные нюансы.\n\n" +
                     "Пожалуйста, ознакомьтесь с материалами. Если появятся вопросы, мы всегда на связи!",
            keyboard: Keyboard.keyboard([
                [Keyboard.urlButton({
                    label: '👉 Программа экскурсии📃',
                    url: 'https://vk.com/market/product/drevniy-derbent-ves-derbent-fontany-lun-28295020-9863669',
                })],
                [Keyboard.textButton({ label: '\u{1f4b5} Условия оплаты и бронирование', color: Keyboard.POSITIVE_COLOR })],
                [Keyboard.textButton({ label: '\u{21a9} Назад', color: Keyboard.SECONDARY_COLOR })],
            ]).oneTime()
        });
        return responseText;
    }

    //Логика кнопки НАЗАД
    else if (text === '\u{21a9} назад') {
        await context.send({
            message: "Поздравляем вас с выбором экскурсии! 🚀\n\n" +
                     "Чтобы продолжить процесс бронирования или получить дополнительную информацию, воспользуйтесь кнопками ниже.\n\n" +
                     "Если возникнут вопросы, всегда рады помочь! 😉",
            keyboard: Keyboard.keyboard([
                [Keyboard.textButton({ label: '\u{1f4b5} Условия оплаты и бронирование', color: Keyboard.POSITIVE_COLOR })],
                [Keyboard.textButton({ label: '\u{1f4cc} Информация об экскурсии', color: Keyboard.PRIMARY_COLOR })],
                [Keyboard.textButton({ label: '\u{1f5d3} Даты экскурсий', color: Keyboard.NEGATIVE_COLOR })],
            ]).oneTime()
        });
        return responseText;
    }
    
    // Если не распознали текст
    else {
        await context.send({
            message: "Вы не завершили процесс бронирования или ввели неизвестную команду.🤖\n Выберите необходимый пункт меню через кнопки ниже или дождитесь ответа администратора!👩‍💼\n\n" +
                     "Чтобы продолжить процесс бронирования или получить дополнительную информацию, воспользуйтесь кнопками ниже.\n\n" +
                     "Если возникнут вопросы, всегда рады помочь! 😉",
            keyboard: Keyboard.keyboard([
                [Keyboard.textButton({ label: '\u{1f4b5} Условия оплаты и бронирование', color: Keyboard.POSITIVE_COLOR })],
                [Keyboard.textButton({ label: '\u{1f4cc} Информация об экскурсии', color: Keyboard.PRIMARY_COLOR })],
                [Keyboard.textButton({ label: '\u{1f5d3} Даты экскурсий', color: Keyboard.NEGATIVE_COLOR })],
            ]).oneTime()
        });
        return responseText;
    }
    
});
