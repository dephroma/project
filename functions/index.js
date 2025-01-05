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
    const text = context.text.trim().toLowerCase(); // Безопасное получение текста и приведение к нижнему регистру
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
                [Keyboard.urlButton({ label: 'Знакомство с Дагестаном', color: Keyboard.POSITIVE_COLOR, url: 'https://vk.com/market/product/znakomstvo-s-dagestanom-gory-barkhan-kanion-28295020-9825928' })],
                [Keyboard.urlButton({ label: 'Древний Дербент', color: Keyboard.PRIMARY_COLOR, url: 'https://vk.com/market/product/drevniy-derbent-ves-derbent-fontany-lun-28295020-9863669' })],
                [Keyboard.urlButton({ label: '5 жемчужин Дагестана', color: Keyboard.POSITIVE_COLOR, url: 'https://vk.com/market/product/5-zhemchuzhin-dagestana-aul-prizrak-podzemny-vodopad-karstovy-proval-terrasy-28295020-9863569' })],
                [Keyboard.textButton({ label: 'Назад', color: Keyboard.NEGATIVE_COLOR })],
            ]).oneTime(),
        });
    } 
    
    else if (text === 'многодневные туры') {
        await context.send({
            message: "Выберите ваш тур! ✨\n\nМы подготовили маршруты, которые позволят вам полностью погрузиться в красоту и культуру Дагестана.\nОткройте подходящий тур, чтобы узнать подробности и нажмите кнопку бронирования (бронировать/написать/связаться). Хотите тур на другое количество дней? Напишите нам!\n\n👇 Ниже вы найдёте наш каталог многодневных туров:",
            keyboard: Keyboard.keyboard([
                [Keyboard.urlButton({ label: 'Край мечты (3 дня)', color: Keyboard.POSITIVE_COLOR, url: 'https://vk.com/market/product/kray-mechty-3-dnya-vse-vklyucheno-28295020-9825947' })],
                [Keyboard.urlButton({ label: 'Весь Дагестан (5 дней)', color: Keyboard.PRIMARY_COLOR, url: 'https://vk.com/market/product/ves-dagestan-5-dney-vse-vklyucheno-28295020-4189351' })],
                [Keyboard.urlButton({ label: 'Дагестанский Вояж (7 дней)', color: Keyboard.POSITIVE_COLOR, url: 'https://vk.com/market/product/quotdagestanskiy-voyazhquot-7-dney-vse-vklyucheno-28295020-9906226' })],
                [Keyboard.textButton({ label: 'Назад', color: Keyboard.NEGATIVE_COLOR })],
            ]).oneTime(),
        });
    } 
    
    else if (text === 'даты и цены') {
        await context.send({
            message: "🏷️Цены.\n\nМы готовы предоставить вам скидку 10%, если ваша группа состоит из 4 человек и более. Предложение распространяется как на однодневные экскурсии, так и на многодневные туры.\n\nОбратите внимание - если вы планируете поездку вдвоём (на экскурсию) или в одиночку (в тур), и нужная группа не наберётся (например, не сезон) - стоимость может измениться, либо вам предложат выбрать другой день. Цена всегда закрепляется заранее, до поездки.",
        });

        await new Promise(resolve => setTimeout(resolve, 2000)); // задержка в 2 секунды

        await context.send({
            message: "🗓️Даты туров.\n\nРасписание здесь↓\nЗдесь будет ссылка на актуальные даты поездок.\n\nЕсли ссылки в этом месяце нет, напишите желаемую дату тура при бронировании.\n\nЕсли ваша группа состоит из 4 человек или больше, вы сможете выбрать любую удобную дату тура и путешествовать только своей компанией. Ждём вас в захватывающем путешествии!",
            keyboard: Keyboard.keyboard([
                [Keyboard.textButton({ label: 'Назад', color: Keyboard.PRIMARY_COLOR })],
            ]).oneTime(),
        });
    }

    else if (text === 'частые вопросы') {
        const questions = [
            "Где найти полную программу тура?",
            "Можно ли брать детей?",
            "Когда оплачивается тур?",
            "Что входит в стоимость?",
            "Оплачиваете ли вы перелёт?",
            "В цену входит катание на катере?",
            "Как и когда кормят?",
            "Сколько человек будет в группе?",
            "Что брать с собой в поездку?",
            "Как одеваться в Дагестане?",
            "Где можно посмотреть отзывы?",
            "Как ловит связь?",
            "Расскажите о вашей команде?",
            "Какие условия проживания?",
            "На каких машинах ездите?",
            "Есть зарядки и вай-фай?",
            "У вас есть тех поддержка?",
            "Нужна ли страховка?",
            "Официально ли работает ваша фирма?",
            "Кому направлять жалобы?",
            "Какие документы брать с собой?",
            "Можно ли брать домашних животных?",
            "Какая погода в Дагестане?"
        ];

        const sendQuestionsWithDelay = async () => {
            for (let i = 0; i < questions.length; i++) {
                await context.send({
                    message: questions[i],
                    keyboard: Keyboard.keyboard([
                        [Keyboard.textButton({ label: 'Назад', color: Keyboard.PRIMARY_COLOR })],
                    ]).oneTime(),
                });

                await new Promise(resolve => setTimeout(resolve, 1000)); // задержка в 1 секунду
            }
        };

        await sendQuestionsWithDelay();
    }

    else { // Обработка других сообщений
        await context.send('Я не понимаю ваш запрос. Пожалуйста, используйте кнопки меню.');
    }
});
