// responses.js
exports.handleText = async (context, text) => {
    if (text === 'да') {
        await context.send({
            message: "🏷️🏷️🏷️🏷️🏷️🏷️🏷️🏷️🏷️🏷️🏷️",
        });
        return true; // Обработали текст
    }

    return false; // Не обработали текст, передать управление дальше
};