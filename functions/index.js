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
    try {
        const userId = context.senderId;
        const text = context.text?.trim().toLowerCase();
        if (!text) return;

        console.log('Получено сообщение:', text, 'от пользователя:', userId);

        // Получаем текущее состояние пользователя или устанавливаем начальное
        let userState = userStates.get(userId) || [];

        const mainMenuKeyboard = Keyboard.keyboard([
            [Keyboard.textButton({ label: 'Каталог и бронирование', color: Keyboard.POSITIVE_COLOR })],
            [Keyboard.textButton({ label: 'Даты и цены', color: Keyboard.PRIMARY_COLOR })],
            [Keyboard.textButton({ label: 'Частые вопросы', color: Keyboard.NEGATIVE_COLOR })],
        ]).oneTime();

        switch (text) {
            case 'привет':
            case 'старт':
            case 'начало':
            case 'hi':
                userState = []; // Сбрасываем историю при старте
                userStates.set(userId, userState);
                await context.send({
                    message: "Привет, дорогой путешественник!...",
                    keyboard: mainMenuKeyboard,
                });
                break;

            case 'каталог и бронирование':
                userState.push('main'); // Запоминаем, что пришли из главного меню
                userStates.set(userId, userState);
                await context.send({
                    message: "Ознакомьтесь с нашим каталогом туров...",
                    keyboard: Keyboard.keyboard([
                        [Keyboard.textButton({ label: 'Экскурсии на 1 день', color: Keyboard.POSITIVE_COLOR })],
                        [Keyboard.textButton({ label: 'Многодневные туры', color: Keyboard.POSITIVE_COLOR })],
                        [Keyboard.textButton({ label: 'Назад', color: Keyboard.PRIMARY_COLOR })],
                    ]).oneTime(),
                });
                break;

            case 'экскурсии на 1 день':
                userState.push('catalog'); // Запоминаем, что пришли из каталога
                userStates.set(userId, userState);
                await context.send({
                    message: "Выберите вашу экскурсию!...",
                    keyboard: Keyboard.keyboard([
                        [Keyboard.urlButton({ label: 'Знакомство с Дагестаном', url: '...', color: Keyboard.POSITIVE_COLOR })],
                        // ... другие URL-кнопки
                        [Keyboard.textButton({ label: 'Назад', color: Keyboard.NEGATIVE_COLOR })],
                    ]).oneTime(),
                });
                break;

            case 'назад':
                if (userState.length > 0) {
                    const previousState = userState.pop(); // Получаем и удаляем последний элемент
                    userStates.set(userId, userState);

                    switch (previousState) {
                        case 'main':
                            await context.send({ message: "Чем могу помочь?", keyboard: mainMenuKeyboard });
                            break;
                        case 'catalog':
                            await context.send({ message: "Ознакомьтесь с нашим каталогом туров...", keyboard: Keyboard.keyboard([
                                [Keyboard.textButton({ label: 'Экскурсии на 1 день', color: Keyboard.POSITIVE_COLOR })],
                                [Keyboard.textButton({ label: 'Многодневные туры', color: Keyboard.POSITIVE_COLOR })],
                                [Keyboard.textButton({ label: 'Назад', color: Keyboard.PRIMARY_COLOR })],
                            ]).oneTime() });
                            break;
                        // Добавьте обработку других состояний "назад"
                        default:
                            await context.send({ message: "Чем могу помочь?", keyboard: mainMenuKeyboard }); // Возврат в главное меню по умолчанию
                    }
                } else {
                    await context.send({ message: "Вы в главном меню.", keyboard: mainMenuKeyboard });
                }
                break;

            // ... (обработка других команд)

            default:
                await context.send('Я не понимаю ваш запрос. Пожалуйста, используйте кнопки меню.');
        }
    } catch (error) {
        console.error("Error handling message:", error);
    }
});