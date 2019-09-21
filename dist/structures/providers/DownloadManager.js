"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const fs_1 = __importDefault(require("fs"));
class DownloadManager {
    download(url, path) {
        return new Promise((res, rej) => {
            node_fetch_1.default(url).then((r) => {
                const fileStream = fs_1.default.createWriteStream(path);
                r.body.pipe(fileStream);
                r.body.on('error', rej);
                fileStream.on('finish', res);
            });
        });
    }
}
exports.default = DownloadManager;
