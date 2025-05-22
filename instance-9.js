
    const robot = require('./robot.js');
    (async () => {
        for (let i = 224; i < 252; i++) {
            await robot.fillForm(i);
        }
    })();
    