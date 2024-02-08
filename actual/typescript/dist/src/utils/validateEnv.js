"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const envalid_1 = require("envalid");
function validateEnv() {
    (0, envalid_1.cleanEnv)(process.env, {
        DATABASE_URL: (0, envalid_1.str)({
            default: "mysql://nandanjp:kujoforall@localhost:3306/photos"
        }),
        NODE_ENV: (0, envalid_1.str)({
            choices: ["development", "production"]
        }),
        PORT: (0, envalid_1.port)({ default: 3000 }),
        JWT_SECRET: (0, envalid_1.str)({ default: "" })
    });
}
exports.default = validateEnv;
;
