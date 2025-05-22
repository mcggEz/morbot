
    const robot = require('./robot.js');
    (async () => {
        for (let i = 0; i < 280; i++) {
            await robot.fillForm(i);
        }
    })();
    