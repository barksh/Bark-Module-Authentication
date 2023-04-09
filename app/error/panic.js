"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.panic = void 0;
const connor_1 = require("connor");
const list_1 = require("./list");
const MODULE_NAME = 'Bark-Module-Authorization';
exports.panic = connor_1.Panic.withDictionary(MODULE_NAME, list_1.ERROR_LIST);
