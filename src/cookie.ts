import { Attributes } from "Attributes";
import { KeyValueEntry } from "KeyValyeEntry";
import { TypedMap } from "TypedMap";
import { ValueEntry } from "ValueEntry";

const DEFAULT_ATTRIBUTES: Attributes = {
	path: "/"
};

/**
 * Returns single cookie entry
 * @param key Cookie's key which value should be returned
 * @returns Cookie value or `null` if value
 *          associated with {@link key} does not exist
 */
export function get(key: string): string;

/**
 * Returns all the cookies stored in current location
 */
export function get(): TypedMap;

export function get(key?: string): string | TypedMap {
	if (!document.cookie)
		return null;
	return key ? getByKey(encodeURIComponent(key)) : getAll();
}

/**
 * Sets cookie's value with key `key`
 * @param key Which cookie should ba changed
 * @param value New value
 * @param attributes Additional attributes
 */
export function set(key: string, value: string, attributes?: Attributes): void;

/**
 * Sets cookies as map
 * @param object Map-like object. Values could be a string or cookie descriptor
 */
export function set(object: TypedMap<string | ValueEntry>): void;

/**
 * Sets cookie as array
 * @param array Array of standalone cookie entries
 */
export function set(array: KeyValueEntry[]): void;

export function set(a: any, b?: string, attributes?: Attributes): void {
	if (typeof a === "string")
		setForKey(a, b, attributes);
	else if (Array.isArray(a))
		setAsArray(a);
	else
		setAsMap(a);
}

/**
 * Deletes cookie by provided key
 * @param key Key by which cookie should be removed
 */
export function unset(key: string): void {
	let zeroDate = new Date;
	zeroDate.setTime(0);
	document.cookie = `${encodeURIComponent(key)}=;expires=${zeroDate.toUTCString()};path=/`;
}

/**
 * Tries to delete all cookies in page (or domain)
 */
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
