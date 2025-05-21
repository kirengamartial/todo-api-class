const axios = require('axios');

/**
 * Load test for the Todo API to measure response time under different user loads
 * The test simulates multiple concurrent users making API requests
 * Usage: node src/tests/performance/loadTest.js
 */

// Configuration
const API_URL = 'http://localhost:3000/api/todos';
const TIMEOUT = 10000; // 10 seconds timeout for requests
const USER_LOADS = [100, 200, 500, 1000, 2000, 5000, 10000]; 

// Helper function to create a single todo
const createTodo = async (id) => {
  try {
    const startTime = Date.now();
    const response = await axios.post(API_URL, {
      title: `Load Test Todo ${id}`,
      description: `This is a todo created for load testing #${id}`,
      completed: false
    }, {
      timeout: TIMEOUT
    });
    const endTime = Date.now();
    
    return { 
      success: true, 
      duration: endTime - startTime
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Helper function to fetch all todos
const getAllTodos = async () => {
  try {
    const startTime = Date.now();
    const response = await axios.get(API_URL, { timeout: TIMEOUT });
    const endTime = Date.now();
    
    return {
      success: true,
      duration: endTime - startTime,
      count: response.data.count || 0
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Function to simulate concurrent users making requests
const simulateUsers = async (numberOfUsers) => {
  console.log(`\nSimulating ${numberOfUsers} concurrent users...`);
  
  const startTime = Date.now();
  let successCount = 0;
  let failureCount = 0;
  let totalResponseTime = 0;
  
  // Create an array of promises to simulate concurrent requests
  const promises = Array(numberOfUsers).fill().map((_, index) => {
    return getAllTodos().then(result => {
      if (result.success) {
        successCount++;
        totalResponseTime += result.duration;
      } else {
        failureCount++;
      }
    });
  });
  
  // Wait for all requests to complete
  await Promise.allSettled(promises);
  
  const endTime = Date.now();
  const totalDuration = endTime - startTime;
  
  // Calculate and return metrics
  const successRate = (successCount / numberOfUsers) * 100;
  const avgResponseTime = successCount > 0 ? totalResponseTime / successCount : 0;
  const requestsPerSecond = (successCount / (totalDuration / 1000)).toFixed(2);
  
  return {
    userCount: numberOfUsers,
    totalDuration: totalDuration,
    successCount,
    failureCount,
    successRate: successRate.toFixed(2),
    avgResponseTime: avgResponseTime.toFixed(2),
    requestsPerSecond
  };
};

// Main execution function
const runLoadTest = async () => {
  console.log('====== TODO API LOAD TESTING ======');
  
  // Run tests for different user loads
  const results = [];
  
  for (const userCount of USER_LOADS) {
    try {
      // Let the system stabilize between tests
      if (results.length > 0) {
        console.log('Waiting 5 seconds between tests...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
      
      const result = await simulateUsers(userCount);
      results.push(result);
      
      console.log(`
Results for ${userCount} users:
  Total Duration: ${result.totalDuration}ms
  Success Rate: ${result.successRate}%
  Average Response Time: ${result.avgResponseTime}ms
  Requests/second: ${result.requestsPerSecond}
  Success/Failure: ${result.successCount}/${result.failureCount}
      `);
    } catch (error) {
      console.error(`Error during test with ${userCount} users:`, error.message);
    }
  }
  
  // Print summary table
  console.log('\n====== PERFORMANCE TEST SUMMARY ======');
  console.log('Users\tAvg Response(ms)\tSuccess Rate(%)\tRequests/sec');
  console.log('------------------------------------------------------');
  
  results.forEach(result => {
    console.log(`${result.userCount}\t${result.avgResponseTime}\t\t${result.successRate}\t\t${result.requestsPerSecond}`);
  });
  
  // Generate CSV for potential graphing
  console.log('\nCSV Output:');
  console.log('users,avg_response_time,success_rate,requests_per_second');
  results.forEach(result => {
    console.log(`${result.userCount},${result.avgResponseTime},${result.successRate},${result.requestsPerSecond}`);
  });
};

// Execute if called directly
if (require.main === module) {
  runLoadTest().catch(console.error);
}

module.exports = {
  createTodo,
  getAllTodos,
  simulateUsers,
  runLoadTest
};
