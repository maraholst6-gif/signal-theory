#!/usr/bin/env node
require('dotenv').config({ path: './backend/.env' });
require('./test-email-queue.js');
