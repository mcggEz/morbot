
    const robot = require('./robot.js');
    (async () => {
        for (let i = 112; i < 168; i++) {
            await robot.fillForm(i);
        }
    })();
    