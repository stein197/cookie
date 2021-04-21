import { Attributes } from "Attributes";
import { TypedMap } from "TypedMap";
import { ValueEntry } from "ValueEntry";
import { KeyValueEntry } from "KeyValueEntry";

export namespace cookie {

	const DEFAULT_ATTRIBUTES: Partial<Attributes> = {
		path: "/"
	};

	export function get(key: string): string;
	export function get(): TypedMap;
	export function get(key?: string): string | TypedMap {
		if (!document.cookie)
			return null;
		return key ? getByKey(key) : getAll();
	}

	export function set(key: string, value: string, attributes: Partial<Attributes>): void;
	export function set(object: TypedMap<string | ValueEntry>): void;
	export function set(array: KeyValueEntry[]): void;
	export function set(a: any, b?: string, attributes?: Partial<Attributes>): void {
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
		document.cookie = `${key}=;expires=${zeroDate.toUTCString()};path=/`;
		let value: string = get(key);
		if (value)
			throw new Error(`Cannot delete cookie "${key}" with value "${value}"`);
	}

	export function clean(): void {
		for (let key in get())
			unset(key);
	}

	function getByKey(key: string): string {
		for (let [pairKey, pairValue] of pairs())
			if (pairKey === key)
				return pairValue;
		return null;
	}

	function getAll(): TypedMap {
		let result: TypedMap = {};
		for (let [key, value] of pairs())
			result[key] = value;
		return result;
	}

	function setForKey(key: string, value: string, attributes: Partial<Attributes>): void {
		attributes = {...DEFAULT_ATTRIBUTES, ...attributes};
		let str = `${key}=${value};path=${attributes.path};`;
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
	}

	function setAsMap(object: TypedMap<string | ValueEntry>): void {
		for (let key in object) {
			let entry = object[key];
			setForKey(key, typeof entry === "string" ? entry : entry.value, typeof entry === "string" ? null : entry);
		}
	}

	function setAsArray(array: KeyValueEntry[]): void {
		for (let entry of array)
			setForKey(entry.key, entry.value, entry);
	}

	function* pairs(): Generator<string[]> {
		let pairs: string[] = document.cookie.split(/\s*;\s*/g);
		for (let pair of pairs)
			yield pair.split("=");
	}
}
