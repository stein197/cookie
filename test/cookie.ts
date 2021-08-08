import should from "should";
import {it, describe} from "mocha";
import * as cookie from "../src/cookie"

describe("cookie.parse()", () => {
	it("Empty or blank string should return an empty object", () => {
		should(cookie.parse("")).be.empty();
		should(cookie.parse(" 	 ")).be.empty();
	});
	it("Normal string should return correct object", () => {
		should(cookie.parse("a=1")).be.eql({
			a: "1"
		});
		should(cookie.parse("a=1; b=2")).be.eql({
			a: "1",
			b: "2"
		});
	});
	it("Parsing multibyte string does not encode/decode unicode characters", () => {
		should(cookie.parse("name=名稱; 名稱=value")).be.eql({
			name: "名稱",
			"名稱": "value"
		});
	});
	it("Parsing encoded string returns an object with decoded entries", () => {
		should(cookie.parse("%3B=%3D")).be.eql({
			";": "="
		});
		should(cookie.parse("name=%E5%90%8D%E7%A8%B1")).be.eql({
			name: "名稱"
		});
		should(cookie.parse("%E5%90%8D%E7%A8%B1=value")).be.eql({
			"名稱": "value"
		});
		should(cookie.parse("%3B=%3D; name=%E5%90%8D%E7%A8%B1; %E5%90%8D%E7%A8%B1=value")).be.eql({
			";": "=",
			name: "名稱",
			"名稱": "value"
		});
	});
	it("Parsing cookie with trailing \";\" returns correct object", () => {
		should(cookie.parse("a=1;")).be.eql({
			a: "1"
		});
	});
	it("Parsing cookie with leading \";\" returns correct object", () => {
		should(cookie.parse(";a=1")).be.eql({
			a: "1"
		});
	});
	it("Parsing cookie with no space after \";\" returns correct object", () => {
		should(cookie.parse("a=1;b=2")).be.eql({
			a: "1",
			b: "2"
		});
	});
	it("Parsing cookie with spaces around entries should trim them", () => {
		should(cookie.parse("a = 1 ; b = 2")).be.eql({
			a: "1",
			b: "2"
		});
	});
	it("Parsing cookie with multiple \";\" returns correct object", () => {
		should(cookie.parse("a=1;;;;b=2")).be.eql({
			a: "1",
			b: "2"
		});
	});
	it("Parsing cookie with no value returns object with empty entry", () => {
		should(cookie.parse("a=")).be.eql({
			a: ""
		});
	});
	it("Parsing cookie with no key returns empty object", () => {
		should(cookie.parse("=1")).be.empty();
	});
});

describe("Real-world examples", () => {
	it("cookie.parse()", () => {
		should(cookie.parse("remixlang=0; remixstid=753338851_2ibzOiSxzLSm0ElMj3zrAInFgJQxNNQjqyj8uWywrlL; remixbdr=1; remixgp=addfba4e54d8db72080ed119f3fb25fa; remixdt=7200; remixQUIC=1; remixua=33%7C-1%7C-1%7C2650595215; remixseenads=1; remixflash=0.0.0; remixscreen_width=1920; remixscreen_height=1080; remixscreen_dpr=1; remixscreen_depth=24; remixscreen_orient=1; remixscreen_winzoom=1")).be.eql({
			remixlang: "0",
			remixstid: "753338851_2ibzOiSxzLSm0ElMj3zrAInFgJQxNNQjqyj8uWywrlL",
			remixbdr: "1",
			remixgp: "addfba4e54d8db72080ed119f3fb25fa",
			remixdt: "7200",
			remixQUIC: "1",
			remixua: "33|-1|-1|2650595215",
			remixseenads: "1",
			remixflash: "0.0.0",
			remixscreen_width: "1920",
			remixscreen_height: "1080",
			remixscreen_dpr: "1",
			remixscreen_depth: "24",
			remixscreen_orient: "1",
			remixscreen_winzoom: "1",
		});
	});
});
