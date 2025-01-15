const { Keyboard } = require('vk-io');

// Функция для обработки специальных сообщений
async function handleSpecialMessages(context, text) {
    if (['биба', 'хуй', 'горох', 'bye'].includes(text)) {
        await context.send({
            message: "Привет, дорогой 👋👋👋BIBAAAAAAAAAAAAAAAAA!👋👋👋\n\nЯ — ваш виртуальный гид. Помогу вам выбрать идеальный тур, отвечу на вопросы и оформлю заявку.\n\nЧем могу помочь?\n\nВыберите опцию в меню ниже. Или напишите ваш вопрос прямо сюда, и я отвечу! 😊",
            keyboard: Keyboard.keyboard([
                [Keyboard.textButton({ label: '\u{1f4da} Каталог и бронирование', color: Keyboard.POSITIVE_COLOR })],
                [Keyboard.textButton({ label: '\u{1f5d3} Даты и цены', color: Keyboard.PRIMARY_COLOR })],
                [Keyboard.textButton({ label: '\u{1f4ac} Частые вопросы', color: Keyboard.NEGATIVE_COLOR })],
            ]).oneTime(),
        });
        return true; // Возвращаем true, чтобы показать, что обработка была выполнена
    }
    return false; // Если сообщение не обработано
}

module.exports = { handleSpecialMessages };


