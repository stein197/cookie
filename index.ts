export = Cookie;

/**
 * Encapsulates {@link Document.cookie} property. Allows to work with it more easily. It can be used to manipulate
 * cookies instead of manipulating the raw `document.cookie` property. All data is percent-encoded when saving and
 * decoded back when retrieving.
 * @typeParam T - List of keys that the current `document.cookie` could have.
 * @example
 * Basic usage
 * ```ts
 * const cookie = new Cookie<["SomeData", "AnotherData"]>(document.cookie);
 * console.log(cookie.get("SomeData"));
 * cookie.set("SomeData", "some value");
 * cookie.unset("AnotherData");
 * ```
 */
class Cookie<T extends string[] = string[]> {

	private static readonly DEFAULT_OPTIONS: Partial<Options> = {
		path: "/"
	};

	private static readonly OPTIONS_KEY_TO_HTTP_KEY: {[K in keyof Options]: string} = {
		domain: "Domain",
		expires: "Expires",
		httpOnly: "httpOnly",
		maxAge: "Max-Age",
		partitioned: "Partitioned",
		path: "Path",
		sameSite: "SameSite",
		secure: "Secure",
	}

	/**
	 * Creates a wrapper around {@link Document.cookie} property.
	 * @param __document Document.
	 */
	public constructor(private readonly __document: Document) {}

	/**
	 * Returns all accessible cookies in the current `document` object.
	 * @returns All cookies. Returns empty object when there are no any cookies.
	 * @example
	 * ```ts
	 * // It could be empty
	 * this.get(); // {}
	 * // Or
	 * this.get(); // {key1: "value1", key2: "value2", ...}
	 * ```
	 */
	public get(): {[K in T[number]]?: string};

	/**
	 * Returns value by the provided key or `null` if there was no value set for the key.
	 * @param key Key of which value to return.
	 * @returns Value, associated with the key or `null` if there was no value set for the key.
	 * @example
	 * ```ts
	 * // It could be null
	 * this.get("key1"); // null
	 * // Or
	 * this.get("key2"); // "value2"
	 * ```
	 */
	public get<K extends T[number]>(key: K): string | null;

	public get(key?: string): any {
		const data = Cookie.parse<T>(this.__document.cookie);
		return key ? data[key as T[number]] ?? null : data;
	}

	/**
	 * Sets a cookie value for the specified key.
	 * @param key Key.
	 * @param value New value.
	 * @param options Additional options.
	 * @see {@link Options}
	 * @example
	 * ```ts
	 * this.set("key", "value", {
	 * 	expires: new Date()
	 * });
	 * ```
	 */
	public set<K extends T[number]>(key: K, value: string, options?: Partial<Options>): void;

	/**
	 * Sets multuple cookie values.
	 * @param data Values to set.
	 * @example
	 * ```ts
	 * this.set({
	 * 	key1: "value1",
	 * 	key2: {
	 * 		value: "value2",
	 * 		path: "/"
	 * 	}
	 * });
	 * ```
	 */
	public set(data: {[K in T[number]]?: string | {value: string} & Partial<Options>}): void;

	public set(a: any, b?: any, c?: any): void {
		const isSingle = typeof a === "string" && typeof b === "string";
		if (isSingle) {
			this.__document.cookie += Cookie.__stringifyItem(a, b, c ? c : {...Cookie.DEFAULT_OPTIONS, ...c});
		} else {
			for (const key in a) {
				const value = a[key];
				const valueType = typeof value;
				const realValue = valueType === "string" ? value : value.value;
				const options = valueType === "string" ? Cookie.DEFAULT_OPTIONS : {...Cookie.DEFAULT_OPTIONS, ...value};
				this.__document.cookie += Cookie.__stringifyItem(key, realValue, options);
			}
		}
	}

	/**
	 * Checks if the there is a cookie with specified key.
	 * @param key Key of which value to check.
	 * @returns `true` if there is a cookie associated with the specified key.
	 * @example
	 * ```ts
	 * this.has("ExistingCookie");    // true
	 * this.has("NonexistentCookie"); // false
	 * ```
	 */
	public has<K extends T[number]>(key: K): boolean {
		return this.get(key) != null;
	}

	/**
	 * Removes a cookie by the key.
	 * @param key Key to remove.
	 * @example
	 * ```ts
	 * this.unset("KeyToRemove");
	 * ```
	 */
	public unset<K extends T[number]>(key: K): void {
		this.set(key, "", {
			expires: new Date(0),
			maxAge: 0
		});
	}

	/**
	 * Tries to remove all cookies.
	 */
	public clear(): void {
		const data = this.get();
		for (const key in data) 
			this.unset(key);
	}

	/**
	 * Parses the given cookie string into an object. It automatically decodes percent-encoding.
	 * @param data String to parse.
	 * @returns Parsed data.
	 * @example
	 * ```ts
	 * Cookie.parse("key1=value1; key2=value2"); // {key1: "value1", key2: "value2"}
	 * ```
	 */
	public static parse<T extends string[] = string[]>(data: string): {[K in T[number]]?: string} {
		const result: any = {};
		if (!data)
			return result;
		const items = data.split(/\s*;\s*/);
		for (const item of items) {
			const [rawKey, rawValue] = item.split("=");
			let key: string, value: string;
			try {
				key = decodeURIComponent(rawKey);
			} catch {
				key = rawKey;
			}
			try {
				value = decodeURIComponent(rawValue);
			} catch {
				value = rawValue;
			}
			result[key] = value;
		}
		return result;
	}

	/**
	 * Stringifies the given data into an array of strings. The resulting array can then be used in a `Set-Cookie` HTTP
	 * header or it could be stringified into a plain string. It automatically encodes characters with percent-encoding.
	 * @param data Cookie data to stringify.
	 * @returns Array of strings.
	 * @example
	 * ```ts
	 * Cookie.stringify({key1: "value1", key2: {value: "value2", path: "/"}}); // ["key1=value1", "key2=value2; Path=/"]
	 * ```
	 */
	public static stringify(data: {[K in string]: string | {value: string} & Partial<Options>}): string[] {
		let result: string[] = [];
		for (const key in data) {
			const value = data[key];
			const realValue = typeof value === "string" ? value : value.value;
			const options = typeof value === "string" ? this.DEFAULT_OPTIONS : value;
			result.push(this.__stringifyItem(key, realValue, options));
		}
		return result;
	}

	private static __stringifyItem(key: string, value: string, options: Partial<Options>): string {
		let result = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
		for (const key in options) {
			const value = options[key as keyof Options];
			const valueType = typeof value;
			const httpKey = Cookie.OPTIONS_KEY_TO_HTTP_KEY[key as keyof Options];
			if (value instanceof Date)
				result += "; " + httpKey + "=" + value.toUTCString();
			else if (valueType === "boolean" && value)
				result += "; " + httpKey;
			else if (valueType === "string" || valueType === "number")
				result += "; " + httpKey + "=" + value;
		}
		return result;
	}
}

/**
 * Options for cookies
 */
type Options = {
	domain: string;
	expires: Date;
	httpOnly: boolean;
	maxAge: number;
	partitioned: boolean;
	path: string;
	sameSite: "Strict" | "Lax" | "None";
	secure: boolean;
}
