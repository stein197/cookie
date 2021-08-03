/**
 * Represent cookie's additional attributes
 */
type Attributes = Partial<{
	/** Path to location this cookie is available. By default is `/` */
	path: string,
	/** At which date cookie expires */
	expires: string | Date,
	/** Max age of cookie in seconds */
	maxAge: number,
	/** Domain within which the cookie is available */
	domain: string,
	secure: boolean,
	sameSite: boolean
}>

/** Simple wrap around generic type {[key: string]: <type>} */
type TypedMap<T = string> = {[key: string]: T}

/** Cookie attributes plus value field */
type ValueEntry = Attributes & {value: string}

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

export function set(a: any, b?: string, attributes?: Attributes): void {
	if (typeof a === "string")
		setForKey(a, b, attributes);
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

/**
 * Parses cookie string into a key-value object.
 * @param data Cookie string.
 * @returns Parsed object.
 */
export function parse(data: string): TypedMap {
	const pairs: string[] = data.split(/\s*;\s*/g);
	const result: TypedMap = {};
	for (let pair of pairs) {
		let [key, value] = pair.split("=");
		result[decodeURIComponent(key)] = decodeURIComponent(value);
	}
	return result;
}

/**
 * Stringifies map of cookies.
 * @param data Data to be stringified.
 * @param asHeader If `true` the result will be an array of cookie headers ready to be used in "Set-Cookie" header.
 *                 Otherwise return string in the same format as in the `document.cookie` property.
 * @return Stringified cookie.
 */
// TODO
export function stringify(data: TypedMap<string | ValueEntry>, asHeader: boolean = true): string | string[] {}

/**
 * Checks if cookie are enabled in browser.
 * @returns `true` if cookies are enabled in browser.
 */
export function enabled(): boolean {
	if ("cookieEnabled" in navigator)
		return navigator.cookieEnabled;
	set("cookie", "true");
	let exists = get("cookie") === "true";
	unset("cookie");
	return exists;
}

function getByKey(key: string): string {
	const documentCookie: TypedMap = parse(document.cookie);
	for (let k in documentCookie)
		if (k === key)
			return documentCookie[k];
	return null;
}

function getAll(): TypedMap {
	return parse(document.cookie);
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
