import { Attributes } from "Attributes";
import { KeyValueEntry } from "KeyValyeEntry";
import { TypedMap } from "TypedMap";
import { ValueEntry } from "ValueEntry";

export namespace cookie {

	export const config = {
		cache: true
	};

	const DEFAULT_ATTRIBUTES: Attributes = {
		path: "/"
	};

	const cache: TypedMap = {};
	for (let [key, value] of pairs())
		cache[key] = value;

	export function get(key: string): string;
	export function get(): TypedMap;
	export function get(key?: string): string | TypedMap {
		if (!document.cookie)
			return null;
		return key ? getByKey(encodeURIComponent(key)) : getAll();
	}

	export function set(key: string, value: string, attributes?: Attributes): void;
	export function set(object: TypedMap<string | ValueEntry>): void;
	export function set(array: KeyValueEntry[]): void;
	export function set(a: any, b?: string, attributes?: Attributes): void {
		if (typeof a === "string")
			setForKey(a, b, attributes);
		else if (Array.isArray(a))
			setAsArray(a);
		else
			setAsMap(a);
	}
	
	export function unset(key: string): void | never {
		let zeroDate = new Date;
		zeroDate.setTime(0);
		document.cookie = `${encodeURIComponent(key)}=;expires=${zeroDate.toUTCString()};path=/`;
	}

	export function clean(): void {
		for (let key in get())
			unset(key);
	}

	function getByKey(key: string): string {
		if (config.cache)
			return cache[key];
		for (let [pairKey, pairValue] of pairs())
			if (pairKey === key)
				return pairValue;
		return null;
	}

	function getAll(): TypedMap {
		if (config.cache)
			return cache;
		let result: TypedMap = {};
		for (let [key, value] of pairs())
			result[key] = value;
		return result;
	}

	function setForKey(key: string, value: string, attributes?: Attributes): void {
		attributes = {...DEFAULT_ATTRIBUTES, ...attributes};
		let str = `${encodeURIComponent(key)}=${encodeURIComponent(value)};path=${attributes.path};`;
		if (attributes.expires)
			str += `expires=${typeof attributes.expires === "string" ? attributes.expires : attributes.expires.toUTCString()};`;
		if(attributes.maxAge)
			str += `max-age=${attributes.maxAge};`;
		if(attributes.domain)
			str += `domain=${attributes.domain};`;
		if (attributes.secure)
			str += "secure;";
		if (attributes.sameSite)
			str += "samesite;";
		document.cookie = str;
		cache[key] = value;
	}

	function setAsMap(object: TypedMap<string | ValueEntry>): void {
		for (let key in object) {
			let entry = object[key];
			if (typeof entry === "string")
				setForKey(key, entry);
			else
				setForKey(key, entry.value, entry);
		}
	}

	function setAsArray(array: KeyValueEntry[]): void {
		for (let entry of array)
			setForKey(entry.key, entry.value, entry);
	}

	function* pairs(): Generator<[string, string]> {
		let pairs: string[] = document.cookie.split(/\s*;\s*/g);
		for (let pair of pairs) {
			let [key, value] = pair.split("=");
			yield [decodeURIComponent(key), decodeURIComponent(value)];
		}
	}
}
