require('dotenv').config();
const { VK, Keyboard } = require('vk-io');

const vk = new VK({
    token: process.env.VK_TOKEN,
    webhookSecret: process.env.VK_SECRET,
});

const userStates = {};  // Хранение истории состояний пользователей

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
    const userId = context.senderId;
    const text = context.text.trim().toLowerCase(); // Безопасное получение текста и приведение к нижнему регистру
    console.log('Получено сообщение:', text);

    // Если у пользователя еще нет состояния, создаем его
    if (!userStates[userId]) {
        userStates[userId] = { stack: ['start'] };  // Стартовое состояние, начало пути
    }

    // Логика для кнопки "Назад"
    const handleBackButton = async () => {
        const userState = userStates[userId];
        const currentState = userState.stack.pop();  // Берем последний элемент из стека

        // Если стек пуст, то это начальная страница
        if (userState.stack.length === 0) {
            userState.stack.push('start');  // Для защиты от пустого стека
        }

        // Проверка состояния и вывод соответствующего сообщения
        if (currentState === 'start') {
            return context.send({
                message: "Привет, дорогой путешественник! Чем могу помочь?",
                keyboard: Keyboard.keyboard([
                    [Keyboard.textButton({ label: 'Каталог и бронирование', color: Keyboard.POSITIVE_COLOR })],
                    [Keyboard.textButton({ label: 'Даты и цены', color: Keyboard.PRIMARY_COLOR })],
                    [Keyboard.textButton({ label: 'Частые вопросы', color: Keyboard.NEGATIVE_COLOR })],
                ]).oneTime(),
            });
        }

        if (currentState === 'catalog') {
            return context.send({
                message: "Ознакомьтесь с нашим каталогом туров. У нас есть:\n\n Экскурсии на 1 день и Многодневные туры.",
                keyboard: Keyboard.keyboard([
                    [Keyboard.textButton({ label: 'Экскурсии на 1 день', color: Keyboard.POSITIVE_COLOR })],
                    [Keyboard.textButton({ label: 'Многодневные туры', color: Keyboard.POSITIVE_COLOR })],
                    [Keyboard.textButton({ label: 'Назад', color: Keyboard.PRIMARY_COLOR })],
                ]).oneTime(),
            });
        }

        if (currentState === 'excursions') {
            return context.send({
                message: "Выберите вашу экскурсию! \n\nМы подготовили для вас маршруты для знакомства с Дагестаном за один день.",
                keyboard: Keyboard.keyboard([
                    [Keyboard.urlButton({ label: 'Знакомство с Дагестаном', color: Keyboard.POSITIVE_COLOR, url: 'https://vk.com/market/product/znakomstvo-s-dagestanom-gory-barkhan-kanion-28295020-9825928' })],
                    [Keyboard.urlButton({ label: 'Древний Дербент', color: Keyboard.PRIMARY_COLOR, url: 'https://vk.com/market/product/drevniy-derbent-ves-derbent-fontany-lun-28295020-9863669' })],
                    [Keyboard.urlButton({ label: '5 жемчужин Дагестана', color: Keyboard.POSITIVE_COLOR, url: 'https://vk.com/market/product/5-zhemchuzhin-dagestana-aul-prizrak-podzemny-vodopad-karstovy-proval-terrasy-28295020-9863569' })],
                    [Keyboard.textButton({ label: 'Назад', color: Keyboard.NEGATIVE_COLOR })],
                ]).oneTime(),
            });
        }

        if (currentState === 'multiday') {
            return context.send({
                message: "Выберите ваш многодневный тур! ✨\n\nМы подготовили маршруты для тех, кто хочет отдохнуть на несколько дней и погрузиться в культуру Дагестана.",
                keyboard: Keyboard.keyboard([
                    [Keyboard.urlButton({ label: 'Край мечты (3 дня)', color: Keyboard.POSITIVE_COLOR, url: 'https://vk.com/market/product/kray-mechty-3-dnya-vse-vklyucheno-28295020-9825947' })],
                    [Keyboard.urlButton({ label: 'Весь Дагестан (5 дней)', color: Keyboard.PRIMARY_COLOR, url: 'https://vk.com/market/product/ves-dagestan-5-dney-vse-vklyucheno-28295020-4189351' })],
                    [Keyboard.urlButton({ label: 'Дагестанский Вояж (7 дней)', color: Keyboard.POSITIVE_COLOR, url: 'https://vk.com/market/product/quotdagestanskiy-voyazhquot-7-dney-vse-vklyucheno-28295020-9906226' })],
                    [Keyboard.textButton({ label: 'Назад', color: Keyboard.NEGATIVE_COLOR })],
                ]).oneTime(),
            });
        }
    };

    if (text === 'назад') {
        await handleBackButton();
        return;
    }

    // Логика для обработки команд
    if (['привет', 'старт', 'начало', 'hi'].includes(text)) {
        userStates[userId].stack = ['start'];  // Сброс стека на стартовое состояние
        await context.send({
            message: "Привет, дорогой путешественник!\n\nЯ — ваш виртуальный гид. Помогу вам выбрать идеальный тур, отвечу на вопросы и оформлю заявку.\n\nЧем могу помочь?",
            keyboard: Keyboard.keyboard([
                [Keyboard.textButton({ label: 'Каталог и бронирование', color: Keyboard.POSITIVE_COLOR })],
                [Keyboard.textButton({ label: 'Даты и цены', color: Keyboard.PRIMARY_COLOR })],
                [Keyboard.textButton({ label: 'Частые вопросы', color: Keyboard.NEGATIVE_COLOR })],
            ]).oneTime(),
        });
    } 
    
    else if (text === 'каталог и бронирование') {
        userStates[userId].stack.push('catalog');
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
        userStates[userId].stack.push('excursions');
        await context.send({
            message: "Выберите вашу экскурсию! \n\nМы подготовили для вас маршруты для знакомства с Дагестаном за один день.",
            keyboard: Keyboard.keyboard([
                [Keyboard.urlButton({ label: 'Знакомство с Дагестаном', color: Keyboard.POSITIVE_COLOR, url: 'https://vk.com/market/product/znakomstvo-s-dagestanom-gory-barkhan-kanion-28295020-9825928' })],
                [Keyboard.urlButton({ label: 'Древний Дербент', color: Keyboard.PRIMARY_COLOR, url: 'https://vk.com/market/product/drevniy-derbent-ves-derbent-fontany-lun-28295020-9863669' })],
                [Keyboard.urlButton({ label: '5 жемчужин Дагестана', color: Keyboard.POSITIVE_COLOR, url: 'https://vk.com/market/product/5-zhemchuzhin-dagestana-aul-prizrak-podzemny-vodopad-karstovy-proval-terrasy-28295020-9863569' })],
                [Keyboard.textButton({ label: 'Назад', color: Keyboard.NEGATIVE_COLOR })],
            ]).oneTime(),
        });
    } 
    
    else if (text === 'многодневные туры') {
        userStates[userId].stack.push('multiday');
        await context.send({
            message: "Выберите ваш многодневный тур! ✨\n\nМы подготовили маршруты для тех, кто хочет отдохнуть на несколько дней и погрузиться в культуру Дагестана.",
            keyboard: Keyboard.keyboard([
                [Keyboard.urlButton({ label: 'Край мечты (3 дня)', color: Keyboard.POSITIVE_COLOR, url: 'https://vk.com/market/product/kray-mechty-3-dnya-vse-vklyucheno-28295020-9825947' })],
                [Keyboard.urlButton({ label: 'Весь Дагестан (5 дней)', color: Keyboard.PRIMARY_COLOR, url: 'https://vk.com/market/product/ves-dagestan-5-dney-vse-vklyucheno-28295020-4189351' })],
                [Keyboard.urlButton({ label: 'Дагестанский Вояж (7 дней)', color: Keyboard.POSITIVE_COLOR, url: 'https://vk.com/market/product/quotdagestanskiy-voyazhquot-7-dney-vse-vklyucheno-28295020-9906226' })],
                [Keyboard.textButton({ label: 'Назад', color: Keyboard.NEGATIVE_COLOR })],
            ]).oneTime(),
        });
    } 
    
    else { // Обработка других сообщений
        await context.send('Я не понимаю ваш запрос. Пожалуйста, используйте кнопки меню.');
    }
});
