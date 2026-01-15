import autocannon from 'autocannon';

const run = autocannon({
  url: 'http://localhost:3000/webhook',
  connections: 100, // Simulating 100 concurrent users
  duration: 10,     // Run for 10 seconds
  method: 'POST',
  headers: {
    'content-type': 'application/json'
  },
  // We define the body as a real object, so no quoting errors ever again!
  body: JSON.stringify({
    issue: {
      key: "TEST-101",
      fields: {
        summary: "Database server is overheating",
        priority: { name: "High" },
        assignee: { emailAddress: "admin@company.com" }
      }
    }
  })
}, (err, result) => {
    if (err) {
        console.error("Error running load test:", err);
    } else {
        console.log("Load test complete!");
        // This prints the nice table you saw earlier
        console.log(autocannon.printResult(result)); 
    }
});

// Show a progress bar in the terminal
autocannon.track(run, { renderProgressBar: true });