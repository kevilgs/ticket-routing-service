import axios from 'axios';

const TOTAL_REQUESTS = 500;
const URL = 'http://localhost:3000/webhook';

const runTest = async () => {
    console.log(`Starting CI Load Test: ${TOTAL_REQUESTS} requests...`);
    
    const start = Date.now();

    const requests = Array.from({ length: TOTAL_REQUESTS }, (_, i) => {
        return axios.post(URL, {
            issue: {
                key: `TEST-${i}`,
                fields: {
                    summary: `CI Test Ticket #${i}`,
                    priority: { name: "Low" },
                    assignee: { emailAddress: "ci-bot@example.com" }
                }
            }
        })
        .then(res => ({ status: 'success', code: res.status }))
        .catch(err => ({ 
            status: 'fail', 
            code: err.response ? err.response.status : 'NETWORK_ERROR' 
        }));
    });

    const results = await Promise.all(requests);
    const duration = (Date.now() - start) / 1000;

    const successes = results.filter(r => r.status === 'success').length;
    const failures = results.filter(r => r.status === 'fail').length;

    console.log('------------------------------------------------');
    console.log(`CI Test Finished in ${duration.toFixed(2)}s`);
    console.log(`Success: ${successes}`);
    console.log(`Failed:  ${failures}`);
    console.log('------------------------------------------------');

    if (failures > 0) {
        console.error("Test Failed: API returned errors.");
        process.exit(1);
    } else {
        process.exit(0);
    }
};

runTest();
