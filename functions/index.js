require('dotenv').config();         //Полностью рабочий файл

const { VK } = require('vk-io');

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

    if (['привет', 'старт', 'начало', 'hi'].includes(text)) {
        await context.send({
            message: "Привет, дорогой путешественник!👋\n\nЯ — ваш виртуальный гид. Помогу вам выбрать идеальный тур, отвечу на вопросы и оформлю заявку.\n\nЧем могу помочь?\n\nВыберите опцию в меню ниже. Или напишите ваш вопрос прямо сюда, и я отвечу! 😊",
            keyboard: Keyboard.keyboard([
                [Keyboard.textButton({ label: '\u{1f4da} Каталог и бронирование', color: Keyboard.POSITIVE_COLOR })],
                [Keyboard.textButton({ label: '\u{1f5d3} Даты и цены', color: Keyboard.PRIMARY_COLOR })],
                [Keyboard.textButton({ label: '\u{1f4ac} Частые вопросы', color: Keyboard.NEGATIVE_COLOR })],
            ]).oneTime(),
        });
    } 
    
    else if (text === '\u{1f4da} каталог и бронирование') {
        await context.send({
            message: "Ознакомьтесь с нашим каталогом туров. У нас есть:\n\n🌟 Экскурсии на 1 день — отличная возможность подарить себе яркие впечатления и познакомиться с республикой за один день.\n✨ Многодневные туры — для тех, кто хочет отдохнуть душой, насладиться природой и открыть для себя весь колорит региона.\n\nВыберите подходящий маршрут и нажмите «Забронировать» на карточке товара. После этого я помогу оформить заявку!",
            keyboard: Keyboard.keyboard([
                [Keyboard.textButton({ label: '\u{1f31f} Экскурсии на 1 день', color: Keyboard.POSITIVE_COLOR })],
                [Keyboard.textButton({ label: '\u{2728} Многодневные туры', color: Keyboard.POSITIVE_COLOR })],
                [Keyboard.textButton({ label: '\u{21a9} Назад', color: Keyboard.PRIMARY_COLOR })],
            ]).oneTime(),
        });
    } 
    
    else if (text === '\u{1f31f} экскурсии на 1 день') {
        await context.send({
            message: "Выберите вашу экскурсию! 🌟\n\nМы подготовили для вас маршруты, которые позволят за один день увидеть самое лучшее, что может предложить Дагестан.\n\nОткройте подходящую экскурсию, чтобы узнать подробности, далее нажмите кнопку бронирования (бронировать/написать/связаться).\n\n👇 Вот наш каталог экскурсий:", 
            keyboard: Keyboard.keyboard([
                [Keyboard.urlButton({ label: '\u{1f449} Знакомство с Дагестаном \u{2728}', url: 'https://vk.com/market/product/znakomstvo-s-dagestanom-gory-barkhan-kanion-28295020-9825928' })],
                [Keyboard.urlButton({ label: '\u{1f449} Древний Дербент \u{2728}', url: 'https://vk.com/market/product/drevniy-derbent-ves-derbent-fontany-lun-28295020-9863669' })],
                [Keyboard.urlButton({ label: '\u{1f449} 5 жемчужин Дагестана \u{2728}', url: 'https://vk.com/market/product/5-zhemchuzhin-dagestana-aul-prizrak-podzemny-vodopad-karstovy-proval-terrasy-28295020-9863569' })],
                [Keyboard.textButton({ label: '\u{21a9} Назад', color: Keyboard.PRIMARY_COLOR })],
            ]).oneTime(),
        });
    } 
    
    else if (text === '\u{2728} многодневные туры') {
        await context.send({
            message: "Выберите ваш тур! ✨\n\nМы подготовили маршруты, которые позволят вам полностью погрузиться в красоту и культуру Дагестана. Откройте подходящий тур, чтобы узнать подробности и нажмите кнопку бронирования (бронировать/написать/связаться). Хотите тур на другое количество дней? Напишите нам!\n\n👇 Ниже вы найдёте наш каталог многодневных туров:",
            keyboard: Keyboard.keyboard([
                [Keyboard.urlButton({ label: '\u{1f449} Край мечты - 3 дня \u{2728}', url: 'https://vk.com/market/product/kray-mechty-3-dnya-vse-vklyucheno-28295020-9825947' })],
                [Keyboard.urlButton({ label: '\u{1f449} Весь Дагестан - 5 дней \u{2728}', url: 'https://vk.com/market/product/ves-dagestan-5-dney-vse-vklyucheno-28295020-4189351' })],
                [Keyboard.urlButton({ label: '\u{1f449} Дагестанский вояж - 7 дней \u{2728}', url: 'https://vk.com/market/product/quotdagestanskiy-voyazhquot-7-dney-vse-vklyucheno-28295020-9906226' })],
                [Keyboard.textButton({ label: '\u{21a9} Назад', color: Keyboard.PRIMARY_COLOR })],
            ]).oneTime(),
        });
    } 
    
    else if (text === '\u{1f5d3} даты и цены') {
        console.log('Обработка кнопки "Даты и цены"');
        await context.send({
            message: "🏷️Цены.\n\nМы готовы предоставить вам скидку 10%, если ваша группа состоит из 4 человек и более. Предложение распространяется как на однодневные экскурсии, так и на многодневные туры.\n\nОбратите внимание - если вы планируете поездку вдвоём (на экскурсию) или в одиночку (в тур), и нужная группа не наберётся (например, не сезон) - стоимость может измениться, либо вам предложат выбрать другой день. Цена всегда закрепляется заранее, до поездки.",
        });

        await new Promise((resolve) => setTimeout(resolve, 2000));

        await context.send({
            message: "🗓️Даты туров.\n\nРасписание здесь👇\n"+
            "https://vk.com/dageagletour?z=photo-28295020_457239707%2Falbum-28295020_00"+ 
            "\nЗдесь будет ссылка на актуальные даты поездок.\n\nЕсли ссылки в этом месяце нет, напишите желаемую дату тура при бронировании.\n\nЕсли ваша группа состоит из 4 человек или больше, вы сможете выбрать любую удобную дату тура и путешествовать только своей компанией. Ждём вас в захватывающем путешествии!\n\nЕсли у вас есть друзья или знакомые, которые тоже любят путешествия, подумайте о том, чтобы отправиться в поездку вместе. Наша команда всегда готова помочь вам организовать идеальный отдых в хорошей компании!\n\nТакже организовываем индивидуальные туры (1-2 человека), условия обговариваются отдельно.",
            keyboard: Keyboard.keyboard([
                [Keyboard.textButton({ label: '\u{21a9} Назад', color: Keyboard.PRIMARY_COLOR })],
            ]).oneTime(),
        });
    } 

    else if (text === '\u{1f4ac} частые вопросы') {
        await context.send({
            message: "\u{1f4ac} Часто задаваемые вопросы:\n\n" +
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
            keyboard: Keyboard.keyboard([
                [Keyboard.textButton({ label: '\u{21a9} Назад', color: Keyboard.PRIMARY_COLOR })],
            ]).oneTime(),
        });
    }
    
    else if (text === '\u{21a9} назад') {
        await context.send({
            message: "Привет, дорогой путешественник!\n👋 Я — ваш виртуальный гид.\n Чем могу помочь?",
            keyboard: Keyboard.keyboard([
                [Keyboard.textButton({ label: '\u{1f4da} Каталог и бронирование', color: Keyboard.POSITIVE_COLOR })],
                [Keyboard.textButton({ label: '\u{1f5d3} Даты и цены', color: Keyboard.PRIMARY_COLOR })],
                [Keyboard.textButton({ label: '\u{1f4ac} Частые вопросы', color: Keyboard.NEGATIVE_COLOR })],
            ]).oneTime(),
        });
    } 

    else if (context.text.toLowerCase() === 'карусель') {
        // Первый элемент
        await context.send({
            attachment: 'https://vk.com/photo-28295020_457239221', // Замените на ваш photo_id
            message: "🌟 Первый элемент:\nОписание первого элемент.",
            keyboard: Keyboard.keyboard([
                [Keyboard.urlButton({ label: 'Подробнее', url: 'https://example.com' })],
                [Keyboard.textButton({ label: '\u{21a9} Назад', color: Keyboard.PRIMARY_COLOR })],
            ]).oneTime(),
        });
    
        await new Promise((resolve) => setTimeout(resolve, 1500)); // Пауза для имитации последовательности
    
        // Второй элемент
        await context.send({
            attachment: 'photo-28295020_457239323', // Замените на ваш photo_id
            message: "✨ Второй элемент:\nОписание второго элемента.",
            keyboard: Keyboard.keyboard([
                [Keyboard.urlButton({ label: 'Перейти', url: 'https://another-example.com' })],
                [Keyboard.textButton({ label: '\u{21a9} Назад', color: Keyboard.PRIMARY_COLOR })],
            ]).oneTime(),
        });
    }
    

    else {
        await context.send('Я не понимаю ваш запрос. Пожалуйста, используйте кнопки меню или дождитесь ответа администратора.');
    }
});

