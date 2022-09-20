import 'ignore-styles'

import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { TTTRequest, TTTResponse } from './interface';
import { advance } from './ttt';
import fs from 'fs'
import path from 'path'
import React from 'react'
import ReactDOMServer from 'react-dom/server'

import App from '../../src/App'

// Allow for interaction with dotenv
dotenv.config();

// Setup express
const APP: Express = express();
const PORT = process.env.PORT;

// JSON Middleware
APP.use(express.json())

APP.get('/', (req, res) => res.send("Welcome from server!"))

APP.use('/ttt', express.static(path.resolve('root', 'warmup1', 'build')))

APP.get('/ttt', (req, res, next) => {
    fs.readFile(path.resolve('/root/warmup1/build/index.html'), 'utf-8', (err, data) => {
        if (err) {
            console.log(err)
            return res.status(500).send("Unexpected error!")
        }

        const name = req.query.name

        let rootHTML = name ? `<div id="info">Hello ${name}, ${new Date()}</div>` : ""
        rootHTML += ReactDOMServer.renderToString(React.createElement(App, { isHome: !name }))

        return res.send(data.replace(`<div id="root"></div>`, `<div id="root">${rootHTML}</div >`))
    })
})

// TTT API
APP.post('/ttt/play', (req: Request<TTTRequest>, res: Response<TTTResponse>) => {
    console.log(req.body)

    const resBody = advance(req.body.grid)

    console.log(resBody)

    res.send(resBody)
});

// Start server
APP.listen(PORT, () => console.log(`Server started on port ${PORT}`));