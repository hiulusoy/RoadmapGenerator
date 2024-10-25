require('dotenv').config();
const http = require('http');
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const passport = require('passport');
const path = require('path');
const moment = require('moment');
const helmet = require('helmet');
const env = process.env.NODE_ENV || 'production';
const config = require(path.join(__dirname, '/config/config.js'))[env];
const clientFolderPath = path.join(__dirname, '../build');
const PORT = process.argv[2] || process.env.PORT || 3000;
const app = express();
var cors = require('cors');
const rateLimit = require('express-rate-limit');
const resourceMiddleware = require('../server/middlewares/resourceMiddleware');
const logger = require('./logger/logger'); // Winston logger dosyası
const socketIO = require('socket.io');
const jwt = require('jsonwebtoken'); // JWT kütüphanesini kullanıyoruz

// smsQ.js dosyasından startSMSQueueListener fonksiyonunu içe aktarın
const smsQService = require('./middlewares/netGsmSmsQ');

// Rate limiter'ı oluştur
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 dakika
    max: 100, // 15 dakika içinde en fazla 100 istek
    message: 'Çok fazla istek gönderdiniz, lütfen 15 dakika sonra tekrar deneyin!',
});

// SMS işleyicisini başlatın
console.log('SMS işleyici başlatılıyor...');
smsQService.startSMSQueueListener();
console.log('SMS işleyici başlatıldı.');

/** cron jobs start */

/** cron jobs finish */

app.use(cors());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(cookieParser());
app.use(
    express.json({
        limit: '10mb',
    })
);

// Morgan'ı Winston ile birlikte kullan
app.use(
    morgan('combined', {
        stream: {
            write: (message) => logger.info(message.trim()), // Her request'i Winston ile logla
        },
    })
);

// Host all client distributable files from the root
app.use(express.static(clientFolderPath));

// 'assets' klasörünü '/assets' route'unda statik olarak sunuyoruz
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// pass passport for configuration
// require('./config/passport')(db, app, passport)

// Uygulamanıza limiter'ı uygulayın
// app.use(limiter);

if (process.env.APP_SSL === 'true') {
    // If an incoming request uses a protocol other than HTTPS,
    // redirect that request to the same url but with HTTPS
    app.use(function (req, res, next) {
        if (req.headers['x-forwarded-proto'] !== 'https') {
            const redirectUrl = ['https://', req.get('Host'), req.url].join('');
            console.log(`Redirecting to: ${redirectUrl}`);
            res.redirect(redirectUrl);
        } else {
            next(); /* Continue to other routes if we're not redirecting */
        }
    });
}

// Configure a text handler to grab plain text bodies
app.use(function (req, res, next) {
    if (req.is('text/*')) {
        req['text'] = '';
        req.setEncoding('utf8');
        req.on('data', function (chunk) {
            req['text'] += chunk;
        });
        req.on('end', next);
    } else {
        next();
    }
});

// Define our API routes
const apiRoutes = require('./routes/api')(passport, config); // Burada apiRoutes bir express.Router() nesnesi olacak

app.use('/api', apiRoutes);

// Index route
app.get('*', function (req, res) {
    res.sendFile('index.html', {
        root: clientFolderPath,
    });
});

// Secure express app
app.use(
    helmet.hsts({
        maxAge: moment.duration(1, 'years').asMilliseconds(),
    })
);

// Logger
app.use((req, res, next) => {
    const logDetails = {
        method: req.method,
        url: req.url,
        body: req.body, // İstek gövdesini loglamak (JSON POST isteklerinde kullanışlı)
        query: req.query, // Query parametrelerini loglamak
        status: res.statusCode,
        timestamp: new Date().toISOString(),
    };

    logger.info(`Request Info: ${JSON.stringify(logDetails)}`);
    next();
});

// error handlers

// catch 404 and forward to error handler
if (app.get('env') !== 'local') {
    app.use(function (req, res, next) {
        let err = new Error('Not Found: ' + req.url);
        err['status'] = 404;
        next(err);
    });
}

// development error handler
// will print stacktrace
if (app.get('env') !== 'production') {
    app.use(function (err, req, res, next) {
        console.log(err.message);
        console.log(err.stack);
        res.status(err.status || 500).json({
            errors: {
                message: err.message,
                details: err.stack,
            },
        });
    });
} else {
    // production error handler
    // no stacktraces leaked to user
    app.use(function (err, req, res, next) {
        console.log(err);
        res.status(err.status || 500).json({
            error: {
                message: err.message,
            },
        });
    });
}

function generateResourceNameAndDescription(method, path) {
    const segments = path.split('/').filter(Boolean); // Split the path into segments
    const resourceName = segments.length ? segments[0] : 'root'; // Get the first segment as the resource name
    const actionSegment = segments.find((seg) => !seg.includes(':')) || ''; // Exclude dynamic segments like :id
    const isSearch = path.toLowerCase().includes('search') || path.toLowerCase().includes('filter');

    let name;
    let description;

    // Determine the action based on HTTP method and path keywords
    switch (method) {
        case 'GET':
            if (isSearch) {
                name = 'Arama';
                description = 'Kaynaklar üzerinde arama veya filtreleme yapar.';
            } else {
                name = actionSegment ? 'Detay Görüntüleme' : 'Listeleme';
                description = actionSegment ? 'Belirli bir kaynağın detaylarını getirir.' : 'Kaynak listesini getirir.';
            }
            break;
        case 'POST':
            if (isSearch) {
                name = 'Arama Sonucu Oluşturma';
                description = 'Arama kriterlerine göre yeni sonuçlar oluşturur.';
            } else {
                name = 'Oluşturma';
                description = 'Yeni bir kaynak oluşturmak için kullanılır.';
            }
            break;
        case 'PUT':
        case 'PATCH':
            name = 'Güncelleme';
            description = 'Mevcut bir kaynağı güncellemek için kullanılır.';
            break;
        case 'DELETE':
            name = 'Silme';
            description = 'Belirli bir kaynağı silmek için kullanılır.';
            break;
        default:
            name = 'İşlem';
            description = 'Belirli bir işlemi gerçekleştirir.';
            break;
    }

    // Generalize name and description based on the resource name and action
    name = `${capitalize(resourceName)} ${name}`;
    description = `${capitalize(resourceName)} ile ilgili ${description.toLowerCase()}`;

    return {name, description};
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

async function syncRoutesWithDatabase(router) {
    const routes = router.stack
        .filter((r) => r.route) // Filter out middlewares that are not routes
        .map((r) => {
            const methods = Object.keys(r.route.methods).map((m) => m.toUpperCase()); // Get HTTP methods
            const path = r.route.path;
            const generatedResources = methods.map((method) => {
                const {name, description} = generateResourceNameAndDescription(method, path); // Generate name and description
                return {method, path, name, description};
            });
            return generatedResources;
        })
        .flat(); // Flatten the array in case of multiple methods on the same route

    for (const route of routes) {
        try {
            // Register the resource in the database
            await resourceMiddleware.registerResource(route.method, route.path, route.name, route.description);
        } catch (error) {
            console.error(`Resource registration failed for ${route.method} ${route.path}:`, error);
        }
    }
}

// set base path to be used in modules
global['__base'] = __dirname + '/';

const server = http.createServer(app);
server.timeout = 100000;

const io = socketIO(server, {
    path: process.env.SOCKET_IO_PATH || '/socket.io',
    cors: {
        origin: '*',
    },
});

app.set('socketio', io); // Socket.IO'yu uygulamaya ekliyoruz

// Kullanıcı oturum açtıktan sonra Socket.IO bağlantısını başlatmak için
io.on('connection', (socket) => {
    console.log('Bir istemci bağlandı');

    // Gelen JWT token'ı al
    const token = socket.handshake.auth.token;

    if (!token) {
        console.error('Token sağlanmadı.');
        socket.disconnect();
        return;
    }

    // JWT token'ı doğrulama
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;
        const tenantId = decodedToken.tenantId;

        socket.userId = userId;
        console.log(`Kullanıcı ${userId} Socket.IO ile bağlandı`);

        // Kullanıcıya özel oda oluşturma
        socket.join(`tenant_${tenantId}`);

        // Mesaj gönderme event'ini dinleme
        socket.on('send-message', async ({jid, content}) => {
            try {
                const WhatsappService = require('./services/whatsappService');
                const whatsappService = new WhatsappService();
                const response = await whatsappService.sendMessage(tenantId, jid, content.text);
                socket.emit('message-sent', response);
            } catch (error) {
                console.error('Mesaj gönderme hatası:', error.message);
                socket.emit('error', 'Mesaj gönderilemedi');
            }
        });

    } catch (err) {
        console.error('Token doğrulanamadı:', err.message);
        socket.disconnect();
    }
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}, environment: ${env}`);
    console.log('start date ' + moment().subtract(1, 'days').format('yyyyMMDD').toString());
    console.log('end date ' + moment().format('yyyyMMDD').toString());
    syncRoutesWithDatabase(apiRoutes);
});

module.exports = app;
