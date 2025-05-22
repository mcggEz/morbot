const { spawn } = require('child_process');

// Configuration for multiple instances
const numberOfInstances = 1;
const totalSubmissions = 280;
const submissionsPerInstance = Math.ceil(totalSubmissions / numberOfInstances);

function runInstance(startIndex, endIndex, instanceNumber) {
    console.log(`Starting instance ${instanceNumber} (submissions ${startIndex} to ${endIndex})`);
    
    // Create a modified version of robot.js for this instance
    const instanceScript = `
    const robot = require('./robot.js');
    (async () => {
        for (let i = ${startIndex}; i < ${endIndex}; i++) {
            await robot.fillForm(i);
        }
    })();
    `;
    
    // Write the instance script to a temporary file
    require('fs').writeFileSync(`instance-${instanceNumber}.js`, instanceScript);
    
    // Run the instance
    const process = spawn('node', [`instance-${instanceNumber}.js`]);
    
    process.stdout.on('data', (data) => {
        console.log(`Instance ${instanceNumber}: ${data}`);
    });
    
    process.stderr.on('data', (data) => {
        console.error(`Instance ${instanceNumber} Error: ${data}`);
    });
    
    process.on('close', (code) => {
        console.log(`Instance ${instanceNumber} finished with code ${code}`);
        // Clean up the temporary file
        require('fs').unlinkSync(`instance-${instanceNumber}.js`);
    });
}

// Start all instances
for (let i = 0; i < numberOfInstances; i++) {
    const startIndex = i * submissionsPerInstance;
    const endIndex = Math.min((i + 1) * submissionsPerInstance, totalSubmissions);
    runInstance(startIndex, endIndex, i + 1);
} 