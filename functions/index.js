require('dotenv').config();

const { VK, Keyboard } = require('vk-io');

const vk = new VK({
    token: process.env.VK_TOKEN,
    webhookSecret: process.env.VK_SECRET,
});

let userStates = {};  // Объект для хранения состояния пользователей

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

    // Инициализируем состояние пользователя, если его нет
    if (!userStates[context.senderId]) {
        userStates[context.senderId] = {
            lastMenu: 'main',  // Основное меню по умолчанию
        };
    }

    const state = userStates[context.senderId];  // Состояние пользователя

    if (['привет', 'старт', 'начало', 'hi'].includes(text)) {
        state.lastMenu = 'main';  // Если старт, то сбрасываем на главное меню
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
        state.lastMenu = 'catalog';  // Сохраняем текущее состояние
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
        state.lastMenu = 'one_day_excur';  // Сохраняем текущее состояние
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
        state.lastMenu = 'multi_day_excur';  // Сохраняем текущее состояние
        await context.send({
            message: "Выберите ваш тур! ✨\n\nМы подготовили маршруты, которые позволят вам полностью погрузиться в красоту и культуру Дагестана.\nОткройте подходящий тур, чтобы узнать подробности и нажмите кнопку бронирования (бронировать/написать/связаться). Хотите тур на другое количество дней? Напишите нам!\n\n👇 Ниже вы найдёте наш каталог многодневных туров:",
            keyboard: Keyboard.keyboard([
                [Keyboard.urlButton({ label: 'Край мечты — 3 дня', url: 'https://vk.com/market/product/kray-mechty-3-dnya-vse-vklyucheno-28295020-9825947' })],
                [Keyboard.urlButton({ label: 'Весь Дагестан — 5 дней', url: 'https://vk.com/market/product/ves-dagestan-5-dney-vse-vklyucheno-28295020-4189351' })],
                [Keyboard.urlButton({ label: 'Дагестанский вояж — 7 дней', url: 'https://vk.com/market/product/quotdagestanskiy-voyazhquot-7-dney-vse-vklyucheno-28295020-9906226' })],
                [Keyboard.textButton({ label: 'Назад', color: Keyboard.NEGATIVE_COLOR })],
            ]).oneTime(),
        });
    }

    else if (text === 'назад') {
        // Переход в предыдущее меню
        if (state.lastMenu === 'main') {
            await context.send({
                message: "Привет, дорогой путешественник!👋 Я — ваш виртуальный гид. Чем могу помочь?",
                keyboard: Keyboard.keyboard([
                    [Keyboard.textButton({ label: 'Каталог и бронирование', color: Keyboard.POSITIVE_COLOR })],
                    [Keyboard.textButton({ label: 'Даты и цены', color: Keyboard.PRIMARY_COLOR })],
                    [Keyboard.textButton({ label: 'Частые вопросы', color: Keyboard.NEGATIVE_COLOR })],
                ]).oneTime(),
            });
        } else if (state.lastMenu === 'catalog') {
            await context.send({
                message: "Ознакомьтесь с нашим каталогом туров. У нас есть:\n\n Экскурсии на 1 день — отличная возможность подарить себе яркие впечатления и познакомиться с республикой за один день.\n✨ Многодневные туры — для тех, кто хочет отдохнуть душой, насладиться природой и открыть для себя весь колорит региона.\n\nВыберите подходящий маршрут и нажмите «Забронировать» на карточке товара. После этого я помогу оформить заявку!",
                keyboard: Keyboard.keyboard([
                    [Keyboard.textButton({ label: 'Экскурсии на 1 день', color: Keyboard.POSITIVE_COLOR })],
                    [Keyboard.textButton({ label: 'Многодневные туры', color: Keyboard.POSITIVE_COLOR })],
                    [Keyboard.textButton({ label: 'Назад', color: Keyboard.PRIMARY_COLOR })],
                ]).oneTime(),
            });
        } else if (state.lastMenu === 'one_day_excur') {
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
    }
});
