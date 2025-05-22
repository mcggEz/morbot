
    const robot = require('./robot.js');
    (async () => {
        for (let i = 196; i < 224; i++) {
            await robot.fillForm(i);
        }
    })();
    