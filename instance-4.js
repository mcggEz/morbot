
    const robot = require('./robot.js');
    (async () => {
        for (let i = 168; i < 224; i++) {
            await robot.fillForm(i);
        }
    })();
    