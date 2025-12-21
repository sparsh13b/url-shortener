import UAParser from "ua-parser-js";

export function parseUserAgent(userAgent?: string) {
    if (!userAgent) {
        return {
            device: null,
            browser: null,
            os: null,
        };
    }

    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    return {
        device: result.device.type || "desktop",
        browser: result.browser.name || "unknown",
        os: result.os.name || "unknown",
    };
}