require('dotenv').config();

const { VK, Keyboard } = require('vk-io');

const vk = new VK({
    token: process.env.VK_TOKEN,
    webhookSecret: process.env.VK_SECRET,
});

const userState = new Map(); // Хранилище состояния пользователей

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
    const userId = context.senderId;
    const text = context.text.trim().toLowerCase();
    console.log('Получено сообщение:', text);

    // Инициализация состояния пользователя
    if (!userState.has(userId)) {
        userState.set(userId, { current: null, previous: null });
    }

    const user = userState.get(userId);

    const navigateTo = (current, message, keyboard) => {
        user.previous = user.current;
        user.current = current;
        return context.send({ message, keyboard });
    };

    // Главный блок
    if (['гуга', 'блэд', 'bye'].includes(text) || user.current === null) {
        return navigateTo('main',
            "Поздравляем вас с выбором экскурсии! 🚀\n\n" +
            "Чтобы продолжить процесс бронирования или получить дополнительную информацию, вы можете воспользоваться кнопками ниже.\n\n" +
            "Если у вас есть вопросы, не стесняйтесь обращаться к нам. Мы рады помочь! 😉",
            Keyboard.keyboard([
                [Keyboard.textButton({ label: '\u{1f4b5} Условия оплаты и бронирование', color: Keyboard.POSITIVE_COLOR })],
                [Keyboard.textButton({ label: '\u{1f4cc} Информация об экскурсии', color: Keyboard.PRIMARY_COLOR })],
                [Keyboard.textButton({ label: '\u{1f5d3} Даты экскурсий', color: Keyboard.NEGATIVE_COLOR })],
            ]).oneTime()
        );
    }

    // Даты экскурсий
    if (text === '\u{1f5d3} даты экскурсий') {
        return navigateTo('dates',
            "🗓️ Даты экскурсий.\n\n" +
            "Расписание здесь👇\n" +
            "Здесь будет ссылка на актуальные даты поездок.\n\n" +
            "Если ссылки нет, напишите желаемую дату тура при бронировании.\n\n" +
            "Группы из 4+ человек могут выбрать любую удобную дату и путешествовать своей компанией.",
            Keyboard.keyboard([
                [Keyboard.textButton({ label: '\u{1f4cc} Информация об экскурсии', color: Keyboard.PRIMARY_COLOR })],
                [Keyboard.textButton({ label: '\u{1f4b5} Забронировать', color: Keyboard.POSITIVE_COLOR })],
                [Keyboard.textButton({ label: '\u{21a9} Назад', color: Keyboard.SECONDARY_COLOR })],
            ]).oneTime()
        );
    }

    // Бронирование
    if (text === '\u{1f4b5} забронировать') {
        return navigateTo('booking',
            "Спасибо, ваша заявка на бронь успешно принята! 🤝\n\n" +
            "Скоро с вами свяжется наш менеджер для уточнения деталей. Для ускорения обработки напишите:\n\n" +
            "1. Желаемую дату тура\n" +
            "2. Количество человек (и детей, если есть)\n\n" +
            "Советуем ознакомиться с разделом \"❓ Частые вопросы\". Желаем незабываемых впечатлений в вашем путешествии! 🦅",
            Keyboard.keyboard([
                [Keyboard.textButton({ label: '\u{21a9} Назад', color: Keyboard.SECONDARY_COLOR })],
                [Keyboard.textButton({ label: '\u{1f4c5} Меню', color: Keyboard.PRIMARY_COLOR })],
                [Keyboard.textButton({ label: '\u{1f4ac} Частые вопросы FAQ', color: Keyboard.NEGATIVE_COLOR })],
            ]).oneTime()
        );
    }

    // Условия оплаты и бронирование
    if (text === '\u{1f4b5} условия оплаты и бронирование') {
        await navigateTo('payment',
            "Благодарим вас за интерес к нашим туристическим услугам!🫶\n\n" +
            "Для обеспечения надежности вашей брони и подготовки вашего путешествия, мы вводим систему предоплаты в размере 10% от общей стоимости экскурсии.\n\n" +
            "Эта предоплата необходима для того, чтобы гарантировать ваше участие в выбранной программе и избежать случаев, когда клиент решает отказаться от поездки уже после того, как были забронированы машины, гостиницы, места в ресторане, а также приобретены билеты на мероприятия. Путешествия требуют планирования, и ваша предоплата поможет нам организовать все нужные аспекты вашего отдыха.\n\n" +
            "Спасибо за понимание, с нетерпением ждем возможности создать вам незабываемые впечатления!",
            Keyboard.keyboard([
                [Keyboard.textButton({ label: '\u{1f4b5} Забронировать', color: Keyboard.POSITIVE_COLOR })],
                [Keyboard.textButton({ label: '\u{21a9} Назад', color: Keyboard.SECONDARY_COLOR })],
            ]).oneTime()
        );

        await new Promise(resolve => setTimeout(resolve, 1000));

        return context.send({
            message: "Мы готовы предоставить вам скидку 10%, если ваша группа состоит из 4 человек и более.\n\n" +
                "Обратите внимание - если вы планируете поездку вдвоём или в одиночку, и нужная группа не наберётся (например, не сезон) - стоимость может измениться, либо вам предложат выбрать другой день. Цена всегда закрепляется заранее, до поездки.\n\n" +
                "Если у вас есть друзья или знакомые, которые тоже любят путешествия, подумайте о том, чтобы отправиться в поездку вместе. Наша команда всегда готова помочь вам организовать идеальный отдых в хорошей компании!\n\n" +
                "Так же можем организовать эту поездку в виде частной экскурсии (малая группа), условия обсуждаются индивидуально.",
            keyboard: Keyboard.keyboard([
                [Keyboard.textButton({ label: '\u{1f4b5} Забронировать', color: Keyboard.POSITIVE_COLOR })],
                [Keyboard.textButton({ label: '\u{21a9} Назад', color: Keyboard.SECONDARY_COLOR })],
            ]).oneTime()
        });
    }

    //Частые вопросы FAQ
    if (text === '\u{1f4ac} частые вопросы') {
        return navigateTo('faq'+"\u{1f4ac} Часто задаваемые вопросы:\n\n" +
                "1. Где найти полную программу тура?\n" +
                "Зайдите в раздел «Статьи», там вы найдёте полные программы всех туров.\n\n" +
                "2. Можно ли брать детей?\n" +
                "Да, дети до 3х лет едут бесплатно,но на каждого такого ребёнка должен приходиться 1 взрослый.\n\n" +
                "3. Когда оплачивается тур?\n" +
                "4. Что входит в стоимость?\n" +
                "5. Оплачиваете ли вы перелёт?\n" +
                "6. В цену входит катание на катере?\n" +
                "7. Как и когда кормят?\n" +
                "8. Сколько человек будет в группе?\n" +
                "9. Что брать с собой в поездку?\n" +
                "10. Как одеваться в Дагестане?\n" +
                "11. Где можно посмотреть отзывы?\n" +  
                "12. Как ловит связь?\n" +
                "13. Расскажите о вашей команде?\n" +
                "14. Какие условия проживания?\n" +
                "15. На каких машинах ездите?\n" +
                "16. Есть зарядки и вай-фай?\n" +
                "17. У вас есть тех поддержка?\n" +
                "18. Нужна ли страховка?\n" +
                "19. Официально ли работает ваша фирма?\n" +
                "20. Кому направлять жалобы?\n" +
                "21. Какие документы брать с собой?\n" +
                "22. Можно ли брать домашних животных?\n" +
                "23. Какая погода в Дагестане?",
           
            Keyboard.keyboard([
                [Keyboard.textButton({ label: '\u{21a9} Назад', color: Keyboard.SECONDARY_COLOR })],

            ]).oneTime()
        );
    }


    //Информация об экскурсии
    if (text === '\u{1f4cc} информация об экскурсии') {
        return navigateTo('info',
            "Вся необходимая информация по вашей экскурсии содержится в статье, которую мы подготовили специально для вас. В ней вы найдете подробности о маршруте, условиях, программе и других важных аспектах.\n\n" +
            "Пожалуйста, ознакомьтесь с материалами. Если у вас возникнут вопросы или потребуется дополнительная информация, не стесняйтесь обращаться к нам. Мы всегда готовы помочь!",
            Keyboard.keyboard([
                [Keyboard.textButton({ label: ({
                    label: '👉Программа экскурсии📃',
                    url: 'https://vk.com/@dageagletour-programma-tura-drevnii-derbent',
                    color: Keyboard.PRIMARY_COLOR
                }) })],
                [Keyboard.textButton({ label: '\u{1f4b5} Условия оплаты и бронирование', color: Keyboard.POSITIVE_COLOR })],
                [Keyboard.textButton({ label: '\u{21a9} Назад', color: Keyboard.SECONDARY_COLOR })],
            ]).oneTime()
        );
    }


    // Кнопка "Назад"
    if (text === '\u{21a9} назад') {
        if (user.previous) {
            user.current = user.previous;
            user.previous = null; // После возврата сбрасываем "предыдущий" блок
        }

        const backMessages = {
            main: "Поздравляем вас с выбором экскурсии! 🚀\n\n" +
            "Чтобы продолжить процесс бронирования или получить дополнительную информацию, вы можете воспользоваться кнопками ниже.\n\n" +
            "Если у вас есть вопросы, не стесняйтесь обращаться к нам. Мы рады помочь! 😉",
            dates: "🗓️ Даты экскурсий.\n\n" +
            "Расписание здесь👇\n" +
            "Здесь будет ссылка на актуальные даты поездок.\n\n" +
            "Если ссылки нет, напишите желаемую дату тура при бронировании.\n\n" +
            "Группы из 4+ человек могут выбрать любую удобную дату и путешествовать своей компанией.",
            booking: "Спасибо, ваша заявка на бронь успешно принята! 🤝\n\n" +
            "Скоро с вами свяжется наш менеджер для уточнения деталей. Для ускорения обработки напишите:\n\n" +
            "1. Желаемую дату тура\n" +
            "2. Количество человек (и детей, если есть)\n\n" +
            "Советуем ознакомиться с разделом \"❓ Частые вопросы\". Желаем незабываемых впечатлений в вашем путешествии! 🦅",
            payment:"Благодарим вас за интерес к нашим туристическим услугам!🫶\n\n" +
            "Для обеспечения надежности вашей брони и подготовки вашего путешествия, мы вводим систему предоплаты в размере 10% от общей стоимости экскурсии.\n\n" +
            "Эта предоплата необходима для того, чтобы гарантировать ваше участие в выбранной программе и избежать случаев, когда клиент решает отказаться от поездки уже после того, как были забронированы машины, гостиницы, места в ресторане, а также приобретены билеты на мероприятия. Путешествия требуют планирования, и ваша предоплата поможет нам организовать все нужные аспекты вашего отдыха.\n\n" +
            "Спасибо за понимание, с нетерпением ждем возможности создать вам незабываемые впечатления!",
            info:"Вся необходимая информация по вашей экскурсии содержится в статье, которую мы подготовили специально для вас. В ней вы найдете подробности о маршруте, условиях, программе и других важных аспектах.\n\n" +
            "Пожалуйста, ознакомьтесь с материалами. Если у вас возникнут вопросы или потребуется дополнительная информация, не стесняйтесь обращаться к нам. Мы всегда готовы помочь!",
            faq:"\u{1f4ac} Часто задаваемые вопросы:\n\n" +
                "1. Где найти полную программу тура?\n" +
                "Зайдите в раздел «Статьи», там вы найдёте полные программы всех туров.\n\n" +
                "2. Можно ли брать детей?\n" +
                "Да, дети до 3х лет едут бесплатно,но на каждого такого ребёнка должен приходиться 1 взрослый.\n\n" +
                "3. Когда оплачивается тур?\n" +
                "4. Что входит в стоимость?\n" +
                "5. Оплачиваете ли вы перелёт?\n" +
                "6. В цену входит катание на катере?\n" +
                "7. Как и когда кормят?\n" +
                "8. Сколько человек будет в группе?\n" +
                "9. Что брать с собой в поездку?\n" +
                "10. Как одеваться в Дагестане?\n" +
                "11. Где можно посмотреть отзывы?\n" +  
                "12. Как ловит связь?\n" +
                "13. Расскажите о вашей команде?\n" +
                "14. Какие условия проживания?\n" +
                "15. На каких машинах ездите?\n" +
                "16. Есть зарядки и вай-фай?\n" +
                "17. У вас есть тех поддержка?\n" +
                "18. Нужна ли страховка?\n" +
                "19. Официально ли работает ваша фирма?\n" +
                "20. Кому направлять жалобы?\n" +
                "21. Какие документы брать с собой?\n" +
                "22. Можно ли брать домашних животных?\n" +
                "23. Какая погода в Дагестане?" 
            };

        const message = backMessages[user.current] || "Главное меню. Выберите подходящий вариант!";
        const keyboardOptions = {
            main: Keyboard.keyboard([
                [Keyboard.textButton({ label: '\u{1f4b5} Условия оплаты и бронирование', color: Keyboard.POSITIVE_COLOR })],
                [Keyboard.textButton({ label: '\u{1f4cc} Информация об экскурсии', color: Keyboard.PRIMARY_COLOR })],
                [Keyboard.textButton({ label: '\u{1f5d3} Даты экскурсий', color: Keyboard.NEGATIVE_COLOR })],
            ]).oneTime(),
            dates: Keyboard.keyboard([
                [Keyboard.textButton({ label: '\u{1f4cc} Информация об экскурсии', color: Keyboard.PRIMARY_COLOR })],
                [Keyboard.textButton({ label: '\u{1f4b5} Забронировать', color: Keyboard.POSITIVE_COLOR })],
                [Keyboard.textButton({ label: '\u{21a9} Назад', color: Keyboard.SECONDARY_COLOR })],
            ]).oneTime(),
            booking: Keyboard.keyboard([
                [Keyboard.textButton({ label: '\u{21a9} Назад', color: Keyboard.SECONDARY_COLOR })],
                [Keyboard.textButton({ label: '\u{1f4c5} Меню', color: Keyboard.PRIMARY_COLOR })],
                [Keyboard.textButton({ label: '\u{1f4ac} Частые вопросы FAQ', color: Keyboard.NEGATIVE_COLOR })],
            ]).oneTime(),
            payment: Keyboard.keyboard([
                [Keyboard.textButton({ label: '\u{1f4b5} Забронировать', color: Keyboard.POSITIVE_COLOR })],
                [Keyboard.textButton({ label: '\u{21a9} Назад', color: Keyboard.SECONDARY_COLOR })],
            ]).oneTime(),
            info: Keyboard.keyboard([
                [Keyboard.textButton({ label: ({
                    label: '👉Программа экскурсии📃',
                    url: 'https://vk.com/@dageagletour-programma-tura-drevnii-derbent',
                    color: Keyboard.PRIMARY_COLOR
                }) })],
                [Keyboard.textButton({ label: '\u{1f4b5} Забронировать', color: Keyboard.POSITIVE_COLOR })],
                [Keyboard.textButton({ label: '\u{21a9} Назад', color: Keyboard.SECONDARY_COLOR })],
            ]).oneTime(),
            faq: Keyboard.keyboard([
                [Keyboard.textButton({ label: '\u{21a9} Назад', color: Keyboard.SECONDARY_COLOR })],
            ]).oneTime()
        };

        return context.send({
            message,
            keyboard: keyboardOptions[user.current] || Keyboard.keyboard([]).oneTime()
        });
    }

    // Если не распознали текст
    return context.send({
        message: "Спасибо, информация учтена. Вы вернулись в меню, если вы не закончили бронирование, выберите вариант ответа по кнопкам ниже или дождитесь ответа администратора.",
        keyboard: Keyboard.keyboard([
            [Keyboard.textButton({ label: '\u{1f4b5} Условия оплаты и бронирование', color: Keyboard.POSITIVE_COLOR })],
            [Keyboard.textButton({ label: '\u{1f4cc} Информация об экскурсии', color: Keyboard.PRIMARY_COLOR })],
            [Keyboard.textButton({ label: '\u{1f5d3} Даты экскурсий', color: Keyboard.NEGATIVE_COLOR })],
        ]).oneTime()
    });
});
