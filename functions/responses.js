// responses.js
exports.handleText = async (context, text) => {
    if (text === 'да') {
        await context.send({
            message: "🏷️🏷️🏷️🏷️🏷️🏷️🏷️🏷️🏷️🏷️🏷️",
        });
    }

};