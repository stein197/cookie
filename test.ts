import * as assert from "assert";
import * as jsdom from "jsdom";
import * as Cookie from ".";

let dom = new jsdom.JSDOM();
let cookie = new Cookie(dom.window.document);

beforeEach(() => {
	dom = new jsdom.JSDOM();
	cookie = new Cookie(dom.window.document);
});

describe("Cookie.get()", () => {
	describe("Cookie.get(key)", () => {
		it("Should return empty object where there are no cookies", () => {
			assert.deepStrictEqual(cookie.get(), {});
		});
		it("Should return correct result", () => {
			dom.window.document.cookie = "key1=value1";
			dom.window.document.cookie = "key2=value2";
			assert.deepStrictEqual(cookie.get(), {
				key1: "value1",
				key2: "value2"
			});
		});
		it("Should return decoded values", () => {
			dom.window.document.cookie = "key=%22value%22";
			assert.deepStrictEqual(cookie.get(), {
				key: "\"value\""
			});
		});
	});
	describe("Cookie.get()", () => {
		it("Should return null when there is no cookie with the specified key", () => {
			assert.equal(cookie.get("key"), null);
		});
		it("Should return correct value", () => {
			dom.window.document.cookie = "key=value";
			assert.equal(cookie.get("key"), "value");
		});
		it("Should return decoded value", () => {
			dom.window.document.cookie = "key=%22value%22";
			assert.equal(cookie.get("key"), "\"value\"");
		});
	});
});

// TODO
describe("Cookie.set()", () => {

	// TODO
	describe("Cookie.set(key, value, options)", () => {});

	// TODO
	describe("Cookie.set(data)", () => {});
});

// TODO
describe("Cookie.has()", () => {});

// TODO
describe("Cookie.unset()", () => {});

// TODO
describe("Cookie.clear()", () => {});

// TODO
describe("Cookie.parse()", () => {});

// TODO
describe("Cookie.stringify()", () => {});

it("Complex examples", () => {
	
});
