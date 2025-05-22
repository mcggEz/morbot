require('dotenv').config();
const puppeteer = require('puppeteer');

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
shuffle(collegeList);

const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Filipino name components
const firstNames = [
    // ... existing code ...
];

const middleNames = [
    // ... existing code ...
];

const lastNames = [
    // ... existing code ...
];

// Domain variations for more realism
const emailDomains = [
    process.env.EMAIL_DOMAIN || 'gmail.com'
];

// Track used emails to ensure uniqueness
const usedEmails = new Set();

// Function to generate random Filipino name
function generateFilipinoName() {
    const firstName = randomPick(firstNames);
    const middleName = randomPick(middleNames);
    const lastName = randomPick(lastNames);
    return `${firstName} ${middleName} ${lastName}`;
}

// Function to generate realistic Filipino email
function generateFilipinoEmail(index) {
    const firstName = randomPick(firstNames).toLowerCase();
    const lastName = randomPick(lastNames).toLowerCase().replace(/\s+/g, '');
    const middleInitial = randomPick(middleNames)[0].toLowerCase();
    
    // Year components for email
    const birthYearStart = parseInt(process.env.BIRTH_YEAR_START) || 1998;
    const birthYearEnd = parseInt(process.env.BIRTH_YEAR_END) || 2006;
    const birthYear = Math.floor(Math.random() * (birthYearEnd - birthYearStart) + birthYearStart);
    
    // Special characters for email variation
    const specialChars = ['', '.', '_', '-'];
    const randomChar = randomPick(specialChars);
    
    // Email patterns with more professional variations and guaranteed uniqueness
    const patterns = [
        // ... existing patterns ...
    ];
    
    const emailPattern = randomPick(patterns);
    const domain = randomPick(emailDomains);
    return `${emailPattern}@${domain}`;
}

async function fillForm(index) {
  try {
    console.log(`🔁 Starting submission #${index + 1}`);

    const browser = await puppeteer.launch({
      headless: false,
      executablePath: process.env.CHROME_PATH,
      userDataDir: process.env.USER_DATA_DIR,
      args: [
        `--profile-directory=${process.env.PROFILE_DIR}`,
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    });

    const page = await browser.newPage();
    await page.goto(process.env.FORM_URL, {
      waitUntil: 'networkidle2',
    });

    await page.click('div[role="checkbox"]');
    await page.type('input[type="email"].whsOnd.zHQkBf', generateFilipinoEmail(index));
    await page.click('div[role="button"]');
    await page.waitForSelector('input[type="text"].whsOnd.zHQkBf', { visible: true });

    await page.click(`div[role="radio"][data-value="${randomPick(["Male", "Female"])}"]`);
    await page.click(`div[role="radio"][data-value="${randomPick(["21 to 24", "17 to 20"])}"]`);

    const college = collegeList[index];
    await page.click(`div[role="radio"][data-value="${college}"]`);

    const yearOptions = ["2nd Year", "3rd Year", "4th Year"];
    const yearWeights = [0.13, 0.5, 0.36];
    const weightedYear = () => {
      const r = Math.random();
      if (r < yearWeights[0]) return yearOptions[0];
      else if (r < yearWeights[0] + yearWeights[1]) return yearOptions[1];
      else return yearOptions[2];
    };
    await page.click(`div[role="radio"][data-value="${weightedYear()}"]`);

    const facilities = ["Laboratory Rooms", "Comfort Rooms", "Classrooms"];
    const selected = facilities.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 2);
    for (const f of selected) {
      await page.click(`div[role="checkbox"][aria-label="${f}"]`);
    }

    const awareness = Math.random() < 0.4 ? "Yes" : "No";
    const participation = Math.random() < 0.28 ? "Yes" : "No";
    const involvement = Math.random() < 0.19 ? "Yes" : "No";

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

    await page.evaluate(() => {
      document.querySelectorAll('div[role="button"]').forEach(btn => {
        if (btn.innerText.includes('Next') || btn.innerText.includes('Susunod')) {
          btn.click();
        }
      });
    });

    async function answerLikert(page) {
      await page.waitForSelector('div[role="radio"][data-value="1"]', { visible: true });
      const rows = await page.$$('div[role="radiogroup"]');
      for (const row of rows) {
        const value = randomPick(["5", "5", "5", "4", "4", "3"]);
        await row.$(`div[role="radio"][data-value="${value}"]`).then(el => el.click());
      }

      await page.evaluate(() => {
        const buttons = document.querySelectorAll('div[role="button"]');
        buttons.forEach(btn => {
          if (btn.innerText.includes('Next') || btn.innerText.includes('Susunod') || btn.innerText.includes('Submit') || btn.innerText.includes('Ipasa')) {
            btn.click();
          }
        });
      });
    }

    await answerLikert(page); // Page 1
    await answerLikert(page); // Page 2
    await answerLikert(page); // Page 3

    console.log(`✅ Submission #${index + 1} complete!\n`);

  } catch (err) {
    console.error(`❌ Error on submission #${index + 1}:`, err);
  }
}

const TOTAL_SUBMISSIONS = parseInt(process.env.TOTAL_SUBMISSIONS, 10);
(async () => {
  for (let i = 0; i < TOTAL_SUBMISSIONS; i++) {
    await fillForm(i);
  }
})();
