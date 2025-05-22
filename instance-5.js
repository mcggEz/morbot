
    const robot = require('./robot.js');
    (async () => {
        for (let i = 224; i < 280; i++) {
            await robot.fillForm(i);
        }
    })();
    