import http from 'k6/http';
import { check, sleep } from 'k6';

// Metric: 1000 users over 30 seconds
export const options = {
    stages: [
        { duration: '5s', target: 50 }, // Ramp up to 50 users
        { duration: '10s', target: 200 }, // Stay at 200 users
        { duration: '5s', target: 0 }, // Ramp down
    ],
};

const BASE_URL = 'http://localhost:4000'; // Adjust if needed

export default function () {
    // 1. Create a short URL
    const payload = JSON.stringify({
        url: 'https://google.com',
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const createRes = http.post(`${BASE_URL}/api/shorten`, payload, params);

    check(createRes, {
        'created status is 201': (r) => r.status === 201,
    });

    if (createRes.status === 201) {
        const slug = createRes.json().slug;

        // 2. Access the short URL (Redirect)
        const redirectRes = http.get(`${BASE_URL}/${slug}`, {
            redirects: 0, // We want to check the 302/301 itself
        });

        check(redirectRes, {
            // Express might return 302 (Found) or 301 (Moved Permanently)
            'redirect status is 302/301': (r) => r.status === 302 || r.status === 301,
            'latency < 50ms': (r) => r.timings.duration < 50,
        });
    }

    sleep(1);
}
