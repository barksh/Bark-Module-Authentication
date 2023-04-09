"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountModel = void 0;
const password_1 = require("@sudoo/password");
const uuid_1 = require("@sudoo/uuid");
const mongoose_1 = require("mongoose");
const two_factor_1 = require("../../util/two-factor");
const account_1 = require("../declare/account");
const AccountSchema = new mongoose_1.Schema({
    active: {
        type: Boolean,
        required: true,
        default: true,
    },
    identifier: {
        type: String,
        required: true,
        index: true,
    },
    automation: {
        type: Boolean,
        required: true,
        default: false,
    },
    administrator: {
        type: Boolean,
        required: true,
        default: false,
    },
    attemptPoints: {
        type: Number,
        required: true,
        default: account_1.defaultInitialAttemptPoints,
    },
    limbo: {
        type: Boolean,
        required: true,
        default: false,
    },
    twoFactor: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: true,
    },
    mint: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
        required: true,
    },
}, {
    timestamps: {
        createdAt: true,
        updatedAt: true,
    },
    methods: {
        useAttemptPoint(point) {
            this.attemptPoints = this.attemptPoints - Math.abs(point);
            return this;
        },
        addAttemptPoint(point) {
            this.attemptPoints = this.attemptPoints + Math.abs(point);
            return this;
        },
        resetAttempt(amount = account_1.defaultInitialAttemptPoints) {
            this.attemptPoints = amount;
            return this;
        },
        generateAndSetTwoFA(systemName) {
            const key = (0, two_factor_1.generateTwoFactorKey)();
            const url = (0, two_factor_1.generateTwoFactorURL)(systemName, this.identifier, key);
            this.twoFactor = key;
            return url;
        },
        verifyTwoFA(code) {
            const key = this.twoFactor;
            if (!key) {
                return false;
            }
            return (0, two_factor_1.verifyTwoFactorCode)(key, code);
        },
        setPassword(password) {
            const saltilizer = password_1.Saltilizer.create(this.salt);
            const saltedPassword = saltilizer.encrypt(password);
            this.password = saltedPassword;
            this.resetMint();
            return this;
        },
        resetMint() {
            this.mint = uuid_1.UUIDVersion1.generate().toString();
            return this;
        },
        verifyPassword(password) {
            const saltilizer = password_1.Saltilizer.create(this.salt);
            const saltedPassword = saltilizer.encrypt(password);
            return this.password === saltedPassword;
        },
    }
});
exports.AccountModel = (0, mongoose_1.model)('Account', AccountSchema);
