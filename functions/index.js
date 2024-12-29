require('dotenv').config();
const { VK, Keyboard } = require('vk-io');

// Вставь сюда свой токен группы
const vk = new VK({
    token: 'YOUR_VK_GROUP_TOKEN'
});

// Запуск бота
vk.updates.start().catch(console.error);

// Обработка ключевых слов "Привет", "Старт", "Начало"
vk.updates.on('message_new', async (context) => {
    const text = context.text.toLowerCase();

    if (['привет', 'старт', 'начало'].includes(text)) {
        await context.send({
            message: "Привет, дорогой путешественник! 👋\n\nЯ — ваш виртуальный гид. Помогу вам выбрать идеальный тур, отвечу на вопросы и оформлю заявку.\n\nЧем могу помочь?\n\nВыберите опцию в меню ниже.\nИли напишите ваш вопрос прямо сюда, и я отвечу! 😊",
            keyboard: Keyboard.keyboard([
                [
                    Keyboard.textButton({
                        label: '📜 Каталог и бронирование',
                        color: Keyboard.POSITIVE_COLOR
                    })
                ],
                [
                    Keyboard.textButton({
                        label: '🗓️ Даты и цены',
                        color: Keyboard.PRIMARY_COLOR
                    })
                ],
                [
                    Keyboard.textButton({
                        label: '💬 Частые вопросы',
                        color: Keyboard.NEGATIVE_COLOR
                    })
                ]
            ]).oneTime()
        });
    }
});

// Обработка нажатий на кнопки
vk.updates.on('message_new', async (context) => {
    const text = context.text;

    switch (text) {
        case '📜 Каталог и бронирование':
            await context.send("📜 Вот наш каталог и опции бронирования: <ссылка или информация>");
            break;
        case '🗓️ Даты и цены':
            await context.send("🗓️ Здесь вы найдёте актуальные даты и цены: <ссылка или информация>");
            break;
        case '💬 Частые вопросы':
            await context.send("💬 Вот ответы на частые вопросы: <ссылка или информация>");
            break;
        default:
            if (!['привет', 'старт', 'начало'].includes(text.toLowerCase())) {
                await context.send("Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время. 😊");
            }
    }
});

