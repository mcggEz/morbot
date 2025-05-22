
    const robot = require('./robot.js');
    (async () => {
        for (let i = 140; i < 168; i++) {
            await robot.fillForm(i);
        }
    })();
    