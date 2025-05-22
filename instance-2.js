
    const robot = require('./robot.js');
    (async () => {
        for (let i = 56; i < 112; i++) {
            await robot.fillForm(i);
        }
    })();
    