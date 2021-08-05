import should from "should";
import {it} from "mocha";
import * as cookie from "../src/cookie"

it("Stub 1", () => should(cookie.stringify({a: "1"})).be.equal("a=1"));
it("Stub 2", () => should(cookie.stringify({a: "1"}, false)).be.equal("a=1;path=/"));
