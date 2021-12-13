"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GesAPI = void 0;
const axios_1 = __importDefault(require("axios"));
class GesAPI {
    constructor(credentials) {
        this.credentials = credentials;
    }
    static async login(username, password) {
        const token = await GesAPI.generateAccessToken(username, password);
        if (!token) {
            throw new Error('Bad credentials');
        }
        return new GesAPI(token);
    }
    static async generateAccessToken(username, password) {
        var _a, _b, _c;
        try {
            const credentials = Buffer.from(`${username}:${password}`, 'utf8').toString('base64');
            await (0, axios_1.default)({
                method: 'GET',
                url: 'https://authentication.kordis.fr/oauth/authorize?response_type=token&client_id=skolae-app',
                headers: {
                    Authorization: `Basic ${credentials}`,
                },
                maxRedirects: 0,
            });
            return null;
        }
        catch (e) {
            if (!((_c = (_b = (_a = e.request) === null || _a === void 0 ? void 0 : _a.res) === null || _b === void 0 ? void 0 : _b.headers) === null || _c === void 0 ? void 0 : _c.location)) {
                throw new Error('Bad password');
            }
            const { location } = e.request.res.headers;
            const hash = location.slice(location.indexOf('#') + 1);
            const properties = hash
                .split('&')
                .map((property) => property.split('='))
                .reduce((acc, [name, value]) => (Object.assign(Object.assign({}, acc), { [name]: value })), {});
            return {
                access_token: properties.access_token,
                token_type: properties.token_type,
                expires_in: properties.expires_in,
                scope: properties.scope,
                uid: properties.uid,
            };
        }
    }
    getYears() {
        return this.get('/me/years');
    }
    getProfile() {
        return this.get('/me/profile');
    }
    getAgenda(start, end) {
        return this.get(`/me/agenda?start=${start.valueOf()}&end=${end.valueOf()}`);
    }
    getAbsences(year) {
        return this.get(`/me/${year}/absences`);
    }
    getGrades(year) {
        return this.get(`/me/${year}/grades`);
    }
    getCourses(year) {
        return this.get(`/me/${year}/courses`);
    }
    getProjects(year) {
        return this.get(`/me/${year}/projects`);
    }
    getProject(id) {
        return this.get(`/me/projects/${id}`);
    }
    joinProjectGroup(projectRcId, projectId, projectGroupId) {
        return this.post(`/me/courses/${projectRcId}/projects/${projectId}/groups/${projectGroupId}`);
    }
    quitProjectGroup(projectRcId, projectId, projectGroupId) {
        return this.delete(`/me/courses/${projectRcId}/projects/${projectId}/groups/${projectGroupId}`);
    }
    getProjectGroupMessages(projectGroupId) {
        return this.get(`/me/projectGroups/${projectGroupId}/messages`);
    }
    sendProjectGroupMessage(projectGroupId, message) {
        return this.post(`/me/projectGroups/${projectGroupId}/messages`, {
            data: {
                projectGroupId,
                message,
            },
        });
    }
    getNextProjectSteps() {
        return this.get('/me/nextProjectSteps');
    }
    async request(method, url, request_config = {}) {
        const { headers } = request_config, others = __rest(request_config, ["headers"]);
        const { data } = await axios_1.default.request(Object.assign({ url: `https://api.kordis.fr${url}`, method, headers: Object.assign(Object.assign({}, headers), { Authorization: `${this.credentials.token_type} ${this.credentials.access_token}` }) }, others));
        return data.result;
    }
    get(url) {
        return this.request('GET', url);
    }
    post(url, request_config = {}) {
        return this.request('POST', url, request_config);
    }
    put(url, request_config = {}) {
        return this.request('PUT', url, request_config);
    }
    delete(url) {
        return this.request('DELETE', url);
    }
}
exports.GesAPI = GesAPI;
