const http = require('http');
const url = require('url');
const querystring = require('querystring');

const PORT = 3000;
const HOST = 'localhost';

// Simple in-memory storage for testing
let testData = {
    users: [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ],
    counter: 0
};

// Helper function to parse JSON from request body
function parseBody(req, callback) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        try {
            const parsedBody = JSON.parse(body);
            callback(null, parsedBody);
        } catch (error) {
            callback(error, null);
        }
    });
}

// Helper function to send JSON response
function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end(JSON.stringify(data, null, 2));
}

// Create HTTP server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;
    const query = parsedUrl.query;

    console.log(`${method} ${req.url} - ${new Date().toISOString()}`);

    // Handle CORS preflight
    if (method === 'OPTIONS') {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        });
        res.end();
        return;
    }

    // Route handling
    switch (path) {
        case '/':
            sendJSON(res, 200, {
                message: 'Test Server is running!',
                timestamp: new Date().toISOString(),
                endpoints: [
                    'GET / - This welcome message',
                    'GET /health - Health check',
                    'GET /users - Get all users',
                    'GET /users/:id - Get user by ID (use /users?id=1)',
                    'POST /users - Create new user',
                    'GET /counter - Get counter value',
                    'POST /counter/increment - Increment counter',
                    'GET /echo?message=hello - Echo message',
                    'POST /echo - Echo request body'
                ]
            });
            break;

        case '/health':
            sendJSON(res, 200, {
                status: 'healthy',
                uptime: process.uptime(),
                timestamp: new Date().toISOString(),
                memory: process.memoryUsage()
            });
            break;

        case '/users':
            if (method === 'GET') {
                if (query.id) {
                    const user = testData.users.find(u => u.id === parseInt(query.id));
                    if (user) {
                        sendJSON(res, 200, { success: true, user });
                    } else {
                        sendJSON(res, 404, { success: false, error: 'User not found' });
                    }
                } else {
                    sendJSON(res, 200, { success: true, users: testData.users });
                }
            } else if (method === 'POST') {
                parseBody(req, (error, body) => {
                    if (error) {
                        sendJSON(res, 400, { success: false, error: 'Invalid JSON' });
                        return;
                    }
                    
                    const newUser = {
                        id: testData.users.length + 1,
                        name: body.name || 'Unknown',
                        email: body.email || 'unknown@example.com'
                    };
                    
                    testData.users.push(newUser);
                    sendJSON(res, 201, { success: true, user: newUser });
                });
            } else {
                sendJSON(res, 405, { success: false, error: 'Method not allowed' });
            }
            break;

        case '/counter':
            if (method === 'GET') {
                sendJSON(res, 200, { success: true, counter: testData.counter });
            } else {
                sendJSON(res, 405, { success: false, error: 'Method not allowed' });
            }
            break;

        case '/counter/increment':
            if (method === 'POST') {
                testData.counter++;
                sendJSON(res, 200, { success: true, counter: testData.counter });
            } else {
                sendJSON(res, 405, { success: false, error: 'Method not allowed' });
            }
            break;

        case '/echo':
            if (method === 'GET') {
                const message = query.message || 'No message provided';
                sendJSON(res, 200, {
                    success: true,
                    echo: message,
                    query: query,
                    timestamp: new Date().toISOString()
                });
            } else if (method === 'POST') {
                parseBody(req, (error, body) => {
                    if (error) {
                        sendJSON(res, 400, { success: false, error: 'Invalid JSON' });
                        return;
                    }
                    
                    sendJSON(res, 200, {
                        success: true,
                        echo: body,
                        timestamp: new Date().toISOString()
                    });
                });
            } else {
                sendJSON(res, 405, { success: false, error: 'Method not allowed' });
            }
            break;

        default:
            sendJSON(res, 404, {
                success: false,
                error: 'Route not found',
                path: path,
                availableRoutes: ['/', '/health', '/users', '/counter', '/echo']
            });
            break;
    }
});

// Start server
server.listen(PORT, HOST, () => {
    console.log(`🚀 Test Server running at http://${HOST}:${PORT}/`);
    console.log('📝 Available endpoints:');
    console.log('   GET  / - Welcome message and endpoint list');
    console.log('   GET  /health - Server health check');
    console.log('   GET  /users - Get all users');
    console.log('   GET  /users?id=1 - Get user by ID');
    console.log('   POST /users - Create new user');
    console.log('   GET  /counter - Get counter value');
    console.log('   POST /counter/increment - Increment counter');
    console.log('   GET  /echo?message=hello - Echo query message');
    console.log('   POST /echo - Echo request body');
    console.log('\n💡 Test with:');
    console.log('   curl http://localhost:3000/');
    console.log('   curl http://localhost:3000/health');
    console.log('   curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d \'{"name":"Test User","email":"test@example.com"}\'');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down server...');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n👋 Shutting down server...');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});