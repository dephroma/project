require('dotenv').config();

const { VK, Keyboard } = require('vk-io');

const vk = new VK({
    token: process.env.VK_TOKEN,
    webhookSecret: process.env.VK_SECRET,
});

exports.handler = async (event, context) => {
    // ... (код обработки webhook остается без изменений)
};

vk.updates.on('message_new', async (context) => {
    const text = context.text.trim().toLowerCase(); // Безопасное получение текста и приведение к нижнему регистру
    console.log('Получено сообщение:', text);

    if (['привет', 'старт', 'начало', 'hi'].includes(text.toLowerCase())) { // Сравнение в нижнем регистре
        await context.send({
            message: "Привет, дорогой путешественник!\n\nЯ — ваш виртуальный гид. Помогу вам выбрать идеальный тур, отвечу на вопросы и оформлю заявку.\n\nЧем могу помочь?\n\nВыберите опцию в меню ниже. Или напишите ваш вопрос прямо сюда, и я отвечу!",
            keyboard: Keyboard.keyboard([
                [Keyboard.textButton({ label: 'Каталог и бронирование', color: Keyboard.POSITIVE_COLOR })], // Убрал юникод, так проще сравнивать
                [Keyboard.textButton({ label: 'Даты и цены', color: Keyboard.PRIMARY_COLOR })],
                [Keyboard.textButton({ label: 'Частые вопросы', color: Keyboard.NEGATIVE_COLOR })],
            ]).oneTime(),
        });
    } else if (text === 'каталог и бронирование') { // Сравнение в нижнем регистре
        await context.send({
            message: "Ознакомьтесь с нашим каталогом туров. У нас есть:\n\n Экскурсии на 1 день — отличная возможность подарить себе яркие впечатления и познакомиться с республикой за один день.\n✨ Многодневные туры — для тех, кто хочет отдохнуть душой, насладиться природой и открыть для себя весь колорит региона.\n\nВыберите подходящий маршрут и нажмите «Забронировать» на карточке товара. После этого я помогу оформить заявку!",
            keyboard: Keyboard.keyboard([
                [Keyboard.textButton({ label: 'Экскурсии на 1 день', color: Keyboard.POSITIVE_COLOR })],
                [Keyboard.textButton({ label: 'Многодневные туры', color: Keyboard.POSITIVE_COLOR })],
                [Keyboard.textButton({ label: 'Назад', color: Keyboard.PRIMARY_COLOR })],
            ]).oneTime(),
        });
    } else if (text === 'экскурсии на 1 день') { // Сравнение в нижнем регистре
        await context.send({
            message: `Выберите вашу экскурсию! \n\nМы подготовили для вас маршруты, которые позволят за один день увидеть самое лучшее, что может предложить Дагестан.\n\nОткройте подходящую экскурсию, чтобы узнать подробности, далее нажмите кнопку бронирования (бронировать/написать/связаться).\n\n Вот наш каталог экскурсий:`,
            keyboard: Keyboard.keyboard([
                [Keyboard.urlButton({ label: 'Знакомство с Дагестаном', url: 'https://vk.com/market/product/znakomstvo-s-dagestanom-gory-barkhan-kanion-28295020-9825928' })], // URL-кнопка
                [Keyboard.urlButton({ label: 'Древний Дербент', url: 'https://vk.com/market/product/drevniy-derbent-ves-derbent-fontany-lun-28295020-9863669' })], // URL-кнопка
                [Keyboard.urlButton({ label: '5 жемчужин Дагестана', url: 'https://vk.com/market/product/5-zhemchuzhin-dagestana-aul-prizrak-podzemny-vodopad-karstovy-proval-terrasy-28295020-9863569' })], // URL-кнопка
                [Keyboard.textButton({ label: 'Назад', color: Keyboard.PRIMARY_COLOR })],
            ]).oneTime(),
        });
    } else if (text === 'назад') { // Сравнение в нижнем регистре
        // ... (код обработки кнопки "Назад" остается без изменений)
    } else if (text === 'даты и цены') { // Сравнение в нижнем регистре
        // ... (код обработки кнопки "Даты и цены" остается без изменений)
    } else if (text === 'частые вопросы') { // Сравнение в нижнем регистре
        // ... (код обработки кнопки "Частые вопросы" остается без изменений)
    } else { // Обработка других сообщений
        await context.send('Я не понимаю ваш запрос. Пожалуйста, используйте кнопки меню.');
    }
});