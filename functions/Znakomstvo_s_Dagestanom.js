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
         // Получаем имя пользователя из context
    const userName = context.senderId ? await getUserName(context.senderId) : 'друг';

    // Приветственное сообщение с кнопками
    if (context.text === 'https://vk.com/market/product/znakomstvo-s-dagestanom-gory-barkhan-kanion-28295020-9825928') {
        await context.send({
            message: `${userName}, поздравляем вас с выбором экскурсии! 🚀\n\n` +
                     'Чтобы продолжить процесс бронирования или получить дополнительную информацию, вы можете воспользоваться кнопками ниже.\n\n' +
                     'Если у вас есть какие-либо вопросы или вы хотите обсудить детали, не стесняйтесь обращаться к нам. Мы рады помочь! 😉',
            keyboard: {
                one_time: false,
                buttons: [
                    [Button.green({ label: 'Условия оплаты и бронирование' })],
                    [Button.blue({ label: 'Информация об экскурсии' }), Button.red({ label: '📅 Даты экскурсий' })],
                ],
            },
        });
    }

    // Обработка нажатия на кнопку "Даты экскурсий"
    if (context.text === '📅 Даты экскурсий') {
        await context.send({
            message: '🗓️ Даты экскурсий.\n\n' +
                     'Расписание здесь↓\n' +
                     'Здесь будет ссылка на актуальные даты поездок.\n\n' +
                     'Если ссылки в этом месяце нет, напишите желаемую дату тура при бронировании.\n\n' +
                     'Если ваша группа состоит из 4 человек или больше, вы сможете выбрать любую удобную дату тура и путешествовать только своей компанией.',
            keyboard: {
                one_time: false,
                buttons: [
                    [Button.blue({ label: 'Информация об экскурсии' })],
                    [Button.green({ label: 'Забронировать' })],
                    [Button.white({ label: 'Назад' })],
                ],
            },
        });
    }

    // Обработка нажатия на кнопку "Забронировать"
    if (context.text === 'Забронировать') {
        await context.send({
            message: 'Спасибо, ваша заявка на бронь успешно принята!🤝\n\n' +
                     'Скоро с вами свяжется наш менеджер для подтверждения бронирования и уточнения всех деталей. Если у вас есть какие-либо вопросы или вы хотите внести изменения, не стесняйтесь обращаться к нам. Для ускорения обработки запроса, напишите ответом на это сообщение :\n\n' +
                     '1. Желаемую дату тура (либо дату приезда)\n' +
                     '2. Количество человек (пожалуйста, укажите, если с вами едут дети - их количество и возраст)\n\n' +
                     'Это поможет быстрее подобрать оптимальные условия.\n\n' +
                     'Советуем почитать раздел "❓Частые вопросы"\n\n' +
                     'Мы желаем вам незабываемых впечатлений в вашем предстоящем путешествии!\n\n' +
                     'С уважением,\n' +
                     'Дагестанский Орел Тур🦅\n' +
                     '8(999)981-78-89',
            keyboard: {
                one_time: false,
                buttons: [
                    [Button.white({ label: 'Назад' })],
                    [Button.blue({ label: 'Меню' })],
                    [Button.red({ label: 'Частые вопросы FAQ' })],
                ],
            },
        });
    }

    // Другие обработки сообщений (например, "Условия оплаты и бронирование", "Бронировать", и т.д.) добавляются здесь...

});

// Функция для получения имени пользователя по его ID
async function getUserName(userId) {
    const user = await vk.api.users.get({ user_ids: userId });
    return user[0].first_name; // или можно использовать full_name, если нужно полное имя
}

// Запуск бота
vk.updates.start().catch(console.error);

