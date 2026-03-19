const axios = require('axios');

const BASE_URL = 'http://localhost:5000/participants/scan';
const TEST_EVENT_ID = 15;
const TEST_MEAL_ID = 13;
const TEST_TOKEN_1 = 'SBNHIDHA9153'; // Hardik
const TEST_TOKEN_2 = 'ROET  @HM911'; // Harsh
const WRONG_EVENT_TOKEN = 'WRONG_EVENT_TOKEN'; // We'll assume one exists or just use a fake one

async function runTests() {
  console.log('🚀 Starting Scanner Thorough Testing...\n');

  // Scenario 1: Valid Scan for Participant 1 (Hardik)
  console.log('--- Test 1: Valid First Scan ---');
  try {
    const res1 = await axios.post(BASE_URL, {
      token_id: TEST_TOKEN_1,
      event_id: TEST_EVENT_ID,
      meal_id: TEST_MEAL_ID
    });
    console.log('✅ Success:', res1.data.message, res1.data.summary);
  } catch (err) {
    console.log('❌ Failed:', err.response?.data?.error || err.message);
  }

  // Scenario 2: Duplicate Scan for Participant 1 (Hardik)
  console.log('\n--- Test 2: Duplicate Scan (Should Fail) ---');
  try {
    const res2 = await axios.post(BASE_URL, {
      token_id: TEST_TOKEN_1,
      event_id: TEST_EVENT_ID,
      meal_id: TEST_MEAL_ID
    });
    console.log('❌ Unexpected Success:', res2.data.message);
  } catch (err) {
    console.log('✅ Correctly Blocked:', err.response?.data?.error);
  }

  // Scenario 3: Valid Scan for Participant 2 (Harsh)
  console.log('\n--- Test 3: Second Participant Scan ---');
  try {
    const res3 = await axios.post(BASE_URL, {
      token_id: TEST_TOKEN_2,
      event_id: TEST_EVENT_ID,
      meal_id: TEST_MEAL_ID
    });
    console.log('✅ Success:', res3.data.message, res3.data.summary);
  } catch (err) {
    console.log('❌ Failed:', err.response?.data?.error || err.message);
  }

  // Scenario 4: Wrong Event ID
  console.log('\n--- Test 4: Participant from Different Event (Should Fail) ---');
  try {
    const res4 = await axios.post(BASE_URL, {
      token_id: TEST_TOKEN_1,
      event_id: 999, // Wrong Event ID
      meal_id: TEST_MEAL_ID
    });
    console.log('❌ Unexpected Success:', res4.data.message);
  } catch (err) {
    console.log('✅ Correctly Blocked:', err.response?.data?.error);
  }

  // Scenario 5: Invalid Token
  console.log('\n--- Test 5: Invalid Token (Should Fail) ---');
  try {
    const res5 = await axios.post(BASE_URL, {
      token_id: 'INVALID_TOKEN_123',
      event_id: TEST_EVENT_ID,
      meal_id: TEST_MEAL_ID
    });
    console.log('❌ Unexpected Success:', res5.data.message);
  } catch (err) {
    console.log('✅ Correctly Blocked:', err.response?.data?.error);
  }

  console.log('\n🏁 Testing Complete.');
}

runTests();
