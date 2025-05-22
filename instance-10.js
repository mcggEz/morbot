
    const robot = require('./robot.js');
    (async () => {
        for (let i = 252; i < 280; i++) {
            await robot.fillForm(i);
        }
    })();
    