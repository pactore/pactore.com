require('dotenv/config');

const https = require('https');
const express = require('express');

const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({
    secure: false,
    hostRewrite: true,
    autoRewrite: true,
});

const database = require('./core/database');
const midleware = require('./core/midleware');

const PORT = process.env.PORT ?? 3000;
const DOMAIN = process.env.DOMAIN ?? `localhost`;

const app = express();

app.use(require('cors')());
app.use(express.json());

app.post('/api/v1/site', midleware.auth, midleware.validator({
    subdomain: {
        type: 'string',
        min: 3
    },
    proxy: {
        type: 'string'
    }
}), async (req, res) => {
    const { subdomain, proxy } = req.body;

    const data = database.load();

    data[subdomain] = proxy;

    database.save(data);

    res.json({
        status: true,
        code: 200,
        i18n: 'SITE_SET'
    })
});

app.delete('/api/v1/site', midleware.auth, midleware.validator({
    subdomain: {
        type: 'string',
        min: 3
    },
}), async (req, res) => {
    const { subdomain } = req.body;

    const data = database.load();

    delete data[subdomain];

    database.save(data);

    res.json({
        status: true,
        code: 200,
        i18n: 'SITE_UNSET'
    })
});

app.all('*', (req, res) => {
    const host = req.hostname;

    const data = database.load();

    const item = data[host.replace(`.${DOMAIN}`, '')];

    if (item) {
        proxy.web(req, res, {
            target: item, agent: item.startsWith('https') ? new https.Agent({
                rejectUnauthorized: true,
            }) : undefined,
        });
    } else {
        res.status(404).send('Page not found.')
    }
});

app.listen(PORT, () => {
    console.log(`Angor started on port ${PORT}`);
});