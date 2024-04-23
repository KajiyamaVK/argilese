"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCityByUf = void 0;
var mysql = require("mysql2/promise");
function getCityByUf(uf) {
    return fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados/".concat(uf, "/municipios"), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(function (res) { return res.json(); })
        .then(function (data) {
        return data.map(function (city) { return ({ name: city.nome, id: city.id }); });
    })
        .catch(function (error) {
        console.error(error);
        return { error: 'Error fetching data: ' + error };
    });
}
exports.getCityByUf = getCityByUf;
function createTables(connection) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connection.execute("\n    CREATE TABLE IF NOT EXISTS stdStates (\n      id VARCHAR(2) PRIMARY KEY,\n      name VARCHAR(255) NOT NULL\n    );\n  ")];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, connection.execute("\n    CREATE TABLE IF NOT EXISTS stdCities (\n      id INT PRIMARY KEY,\n      name VARCHAR(255) NOT NULL,\n      state_id VARCHAR(2),\n      FOREIGN KEY (state_id) REFERENCES stdStates(id)\n    );\n  ")];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var ufs, connection, statesWithCities, _i, statesWithCities_1, _a, uf, cities, _b, cities_1, city;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    ufs = [
                        'AC',
                        'AL',
                        'AP',
                        'AM',
                        'BA',
                        'CE',
                        'DF',
                        'ES',
                        'GO',
                        'MA',
                        'MT',
                        'MS',
                        'MG',
                        'PA',
                        'PB',
                        'PR',
                        'PE',
                        'PI',
                        'RJ',
                        'RN',
                        'RS',
                        'RO',
                        'RR',
                        'SC',
                        'SP',
                        'SE',
                        'TO',
                    ];
                    return [4 /*yield*/, mysql.createConnection({
                            host: 'localhost',
                            user: 'root',
                            password: 'root',
                            database: 'argilese',
                            port: 3306,
                        })];
                case 1:
                    connection = _c.sent();
                    return [4 /*yield*/, createTables(connection)];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, Promise.all(ufs.map(function (uf) { return getCityByUf(uf).then(function (cities) { return ({ uf: uf, cities: cities }); }); }))];
                case 3:
                    statesWithCities = _c.sent();
                    _i = 0, statesWithCities_1 = statesWithCities;
                    _c.label = 4;
                case 4:
                    if (!(_i < statesWithCities_1.length)) return [3 /*break*/, 10];
                    _a = statesWithCities_1[_i], uf = _a.uf, cities = _a.cities;
                    // Insert or ignore state
                    return [4 /*yield*/, connection.execute("INSERT IGNORE INTO stdStates (id, name) VALUES (?, ?)", [uf, uf])
                        // Insert cities
                    ]; // Simplifying the state name for this example
                case 5:
                    // Insert or ignore state
                    _c.sent(); // Simplifying the state name for this example
                    _b = 0, cities_1 = cities;
                    _c.label = 6;
                case 6:
                    if (!(_b < cities_1.length)) return [3 /*break*/, 9];
                    city = cities_1[_b];
                    return [4 /*yield*/, connection.execute("INSERT INTO stdCities (id, name, state_id) VALUES (?, ?, ?)", [city.id, city.name, uf])];
                case 7:
                    _c.sent();
                    _c.label = 8;
                case 8:
                    _b++;
                    return [3 /*break*/, 6];
                case 9:
                    _i++;
                    return [3 /*break*/, 4];
                case 10: return [2 /*return*/];
            }
        });
    });
}
main();
