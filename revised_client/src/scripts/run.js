const fetch = require('node-fetch');
import withdrawfromResourceAccount from '../pages/page';

async function withdrawFromResourceAccount() {
    withdrawfromResourceAccount()
    .then(() => {
      console.log('Withdrawal completed successfully');
    })
    .catch(error => {
      console.error('Withdrawal failed:', error);
    });
}

// Set up an interval to run the function every 5 minutes
const interval = setInterval(async () => {
  try {
    await withdrawFromResourceAccount();
  } catch (error) {
    console.error('Error during withdrawal:', error);
  }
}, 5 * 1000); // 5 seconds

// Optionally, you can handle SIGINT signal to gracefully exit the script
process.on('SIGINT', () => {
  clearInterval(interval);
  console.log('Script terminated by user');
  process.exit();
});
