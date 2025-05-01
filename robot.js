const puppeteer = require('puppeteer');

// ⚖️ Build a randomized college list (126 CE, 154 CS)
const CE_TARGET = 126;
const CS_TARGET = 154;
const collegeList = [
  ...Array(CE_TARGET).fill("College of Engineering (CE)"),
  ...Array(CS_TARGET).fill("College of Science (CS)")
];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
shuffle(collegeList); // Randomize order

// 🎯 Helper to randomly select from an array
const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function fillForm(index) {
  try {
    console.log(`🔁 Starting submission #${index + 1}`);

    const browser = await puppeteer.launch({
      headless: false,
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      userDataDir: 'C:\\Users\\mcgg\\AppData\\Local\\Google\\Chrome\\User Data',
      args: [
        '--profile-directory=Profile 2',
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    });

    const page = await browser.newPage();
    await page.goto('https://docs.google.com/forms/d/e/1FAIpQLScAR9nz4QENCG9zo-_yb_2LMuZIeteIqeylT084SttSj31UDA/viewform', {
      waitUntil: 'networkidle2',
    });

    // Step 1: Consent & email
    await page.click('div[role="checkbox"]');
    await page.type('input[type="email"].whsOnd.zHQkBf', `fakeuser${index}@email.com`);
    await page.click('div[role="button"]');

    await page.waitForSelector('input[type="text"].whsOnd.zHQkBf', { visible: true });

    // Gender & Age
    await page.click(`div[role="radio"][data-value="${randomPick(["Male", "Female"])}"]`);
    await page.click(`div[role="radio"][data-value="${randomPick(["21 to 24", "17 to 20"])}"]`);

    // College — from our rebalanced list
    const college = collegeList[index];
    await page.click(`div[role="radio"][data-value="${college}"]`);

    // Year Level
    const yearOptions = ["2nd Year", "3rd Year", "4th Year"];
    const yearWeights = [0.13, 0.5, 0.36]; // match your real stats
    const weightedYear = () => {
      const r = Math.random();
      if (r < yearWeights[0]) return yearOptions[0];
      else if (r < yearWeights[0] + yearWeights[1]) return yearOptions[1];
      else return yearOptions[2];
    };
    await page.click(`div[role="radio"][data-value="${weightedYear()}"]`);

    // Facilities used (randomly tick 2–3 checkboxes)
    const facilities = ["Laboratory Rooms", "Comfort Rooms", "Classrooms"];
    const selected = facilities.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 2);
    for (const f of selected) {
      await page.click(`div[role="checkbox"][aria-label="${f}"]`);
    }

    // Awareness, participation, involvement questions
    const awareness = Math.random() < 0.4 ? "Yes" : "No"; // 60% say "No"
    const participation = Math.random() < 0.28 ? "Yes" : "No"; // 72% say "No"
    const involvement = Math.random() < 0.19 ? "Yes" : "No"; // 81% say "No"

    await page.evaluate((awareness, participation, involvement) => {
      const radios = document.querySelectorAll('div[role="radio"]');
      radios.forEach(el => {
        if (el.getAttribute('data-value') === awareness) el.click();
      });
      setTimeout(() => {
        radios.forEach(el => {
          if (el.getAttribute('data-value') === participation) el.click();
        });
        setTimeout(() => {
          radios.forEach(el => {
            if (el.getAttribute('data-value') === involvement) el.click();
          });
        }, 200);
      }, 200);
    }, awareness, participation, involvement);

    // Click "Next"
    await page.evaluate(() => {
      document.querySelectorAll('div[role="button"]').forEach(btn => {
        if (btn.innerText.includes('Next') || btn.innerText.includes('Susunod')) {
          btn.click();
        }
      });
    });

    // 🟨 Function to answer 15 Likert items on a page
    async function answerLikert(page) {
      await page.waitForSelector('div[role="radio"][data-value="1"]', { visible: true });
      const rows = await page.$$('div[role="radiogroup"]');
      for (const row of rows) {
        const value = randomPick(["5", "5", "5", "4", "4", "3"]); // Biased toward 5
        await row.$(`div[role="radio"][data-value="${value}"]`).then(el => el.click());
      }

      // Click "Next" or "Submit"
      await page.evaluate(() => {
        const buttons = document.querySelectorAll('div[role="button"]');
        buttons.forEach(btn => {
          if (btn.innerText.includes('Next') || btn.innerText.includes('Susunod') || btn.innerText.includes('Submit') || btn.innerText.includes('Ipasa')) {
            btn.click();
          }
        });
      });
    }

    // Fill Likert pages
    await answerLikert(page); // Page 1
    await answerLikert(page); // Page 2
    await answerLikert(page); // Page 3

    console.log(`✅ Submission #${index + 1} complete!\n`);
    

  } catch (err) {
    console.error(`❌ Error on submission #${index + 1}:`, err);
  }
}

// 🚀 Run automation for 280 submissions
(async () => {
  for (let i = 0; i < 280; i++) {
    await fillForm(i);
  }
})();
