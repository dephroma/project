require('dotenv').config();

const { VK, Keyboard } = require('vk-io');

const vk = new VK({
    token: process.env.VK_TOKEN,
    webhookSecret: process.env.VK_SECRET,
});

exports.handler = async (event, context) => {
    const body = JSON.parse(event.body);
    const { type, group_id, secret } = body;

    // Проверка секретного ключа и ID группы
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

    // Обработка событий, например, новое сообщение
    await vk.updates.handleWebhookUpdate(body);

    return {
        statusCode: 200,
        body: 'OK',
    };
};

vk.updates.on('message_new', async (context) => {
    const text = context.text.trim().toLowerCase();
    console.log('Получено сообщение:', text);

    if (['привет', 'старт', 'начало', 'hi'].includes(text.toLowerCase())) {
        await context.send({
            message: "Привет, дорогой путешественник!\n\nЯ — ваш виртуальный гид. Помогу вам выбрать идеальный тур, отвечу на вопросы и оформлю заявку.\n\nЧем могу помочь?\n\nВыберите опцию в меню ниже. Или напишите ваш вопрос прямо сюда, и я отвечу!",
            keyboard: Keyboard.keyboard([
                [Keyboard.textButton({ label: 'Каталог и бронирование', color: Keyboard.POSITIVE_COLOR })],
                [Keyboard.textButton({ label: 'Даты и цены', color: Keyboard.PRIMARY_COLOR })],
                [Keyboard.textButton({ label: 'Частые вопросы', color: Keyboard.NEGATIVE_COLOR })],
            ]).oneTime(),
        });
    } 

    else if (text === 'каталог и бронирование') {
        await context.send({
            message: "Ознакомьтесь с нашим каталогом туров. У нас есть:\n\n Экскурсии на 1 день — отличная возможность подарить себе яркие впечатления и познакомиться с республикой за один день.\n✨ Многодневные туры — для тех, кто хочет отдохнуть душой, насладиться природой и открыть для себя весь колорит региона.\n\nВыберите подходящий маршрут и нажмите «Забронировать» на карточке товара. После этого я помогу оформить заявку!",
            keyboard: Keyboard.keyboard([
                [Keyboard.textButton({ label: 'Экскурсии на 1 день', color: Keyboard.POSITIVE_COLOR })],
                [Keyboard.textButton({ label: 'Многодневные туры', color: Keyboard.POSITIVE_COLOR })],
                [Keyboard.textButton({ label: 'Назад', color: Keyboard.PRIMARY_COLOR })],
            ]).oneTime(),
        });
    } 

    else if (text === 'экскурсии на 1 день') {
        await context.send({
            message: "Выберите вашу экскурсию! \n\nМы подготовили для вас маршруты, которые позволят за один день увидеть самое лучшее, что может предложить Дагестан.\n\nОткройте подходящую экскурсию, чтобы узнать подробности, далее нажмите кнопку бронирования (бронировать/написать/связаться).\n\n Вот наш каталог экскурсий:", 
            keyboard: Keyboard.keyboard([
                [Keyboard.urlButton({ label: 'Знакомство с Дагестаном', url: 'https://vk.com/market/product/znakomstvo-s-dagestanom-gory-barkhan-kanion-28295020-9825928' })],
                [Keyboard.urlButton({ label: 'Древний Дербент', url: 'https://vk.com/market/product/drevniy-derbent-ves-derbent-fontany-lun-28295020-9863669' })],
                [Keyboard.urlButton({ label: '5 жемчужин Дагестана', url: 'https://vk.com/market/product/5-zhemchuzhin-dagestana-aul-prizrak-podzemny-vodopad-karstovy-proval-terrasy-28295020-9863569' })],
                [Keyboard.textButton({ label: 'Назад', color: Keyboard.NEGATIVE_COLOR })],
            ]).oneTime(),
        });
    } 

    else if (text === 'многодневные туры') {
        await context.send({
            message: `Выберите ваш тур! ✨

Мы подготовили маршруты, которые позволят вам полностью погрузиться в красоту и культуру Дагестана.
Откройте подходящий тур, чтобы узнать подробности и нажмите кнопку бронирования (бронировать/написать/связаться). Хотите тур на другое количество дней? Напишите нам!

👇 Ниже вы найдёте наш каталог многодневных туров:`,
            keyboard: Keyboard.keyboard([
                [Keyboard.urlButton({ label: 'Край мечты (3 дня)', url: 'https://vk.com/market/product/kray-mechty-3-dnya-vse-vklyucheno-28295020-9825947' })],
                [Keyboard.urlButton({ label: 'Весь Дагестан (5 дней)', url: 'https://vk.com/market/product/ves-dagestan-5-dney-vse-vklyucheno-28295020-4189351' })],
                [Keyboard.urlButton({ label: 'Дагестанский вояж (7 дней)', url: 'https://vk.com/market/product/quotdagestanskiy-voyazhquot-7-dney-vse-vklyucheno-28295020-9906226' })],
                [Keyboard.textButton({ label: 'Назад', color: Keyboard.PRIMARY_COLOR })],
            ]).oneTime(),
        });
    }

    else if (text === 'даты и цены') {
        console.log('Обработка кнопки "Даты и цены"');
        // Первое сообщение с ценами
        await context.send({
            message: "🏷️Цены.\n\nМы готовы предоставить вам скидку 10%, если ваша группа состоит из 4 человек и более. Предложение распространяется как на однодневные экскурсии, так и на многодневные туры.\n\nОбратите внимание - если вы планируете поездку вдвоём (на экскурсию) или в одиночку (в тур), и нужная группа не наберётся (например, не сезон) - стоимость может измениться, либо вам предложат выбрать другой день. Цена всегда закрепляется заранее, до поездки.",
        });
    
        // Задержка перед вторым сообщением
        await new Promise((resolve) => setTimeout(resolve, 2000));
    
        // Второе сообщение с датами туров
        await context.send({
            message: "🗓️Даты туров.\n\nРасписание здесь↓\nЗдесь будет ссылка на актуальные даты поездок.\n\nЕсли ссылки в этом месяце нет, напишите желаемую дату тура при бронировании.\n\nЕсли ваша группа состоит из 4 человек или больше, вы сможете выбрать любую удобную дату тура и путешествовать только своей компанией. Ждём вас в захватывающем путешествии!\n\nЕсли у вас есть друзья или знакомые, которые тоже любят путешествия, подумайте о том, чтобы отправиться в поездку вместе. Наша команда всегда готова помочь вам организовать идеальный отдых в хорошей компании!\n\nТакже организовываем индивидуальные туры (1-2 человека), условия обговариваются отдельно.",
            keyboard: Keyboard.keyboard([
                [
                    Keyboard.textButton({
                        label: 'Назад',
                        color: Keyboard.PRIMARY_COLOR,
                    }),
                ],
            ]).oneTime(),
        });
    }

    else if (text === 'назад') {
        await context.send({
            message: "Привет, дорогой путешественник!👋 Я — ваш виртуальный гид. Чем могу помочь?",
            keyboard: Keyboard.keyboard([
                [Keyboard.textButton({ label: 'Каталог и бронирование', color: Keyboard.POSITIVE_COLOR })],
                [Keyboard.textButton({ label: 'Даты и цены', color: Keyboard.PRIMARY_COLOR })],
                [Keyboard.textButton({ label: 'Частые вопросы', color: Keyboard.NEGATIVE_COLOR })],
            ]).oneTime(),
        });
    } 

    else {
        await context.send('Я не понимаю ваш запрос. Пожалуйста, используйте кнопки меню.');
    }
});
