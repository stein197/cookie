export = Cookie;

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

	public constructor(private readonly __document: Document) {}

	public get(): {[K in T[number]]?: string};

	public get<K extends T[number]>(key: K): string | null;

	public get(key?: string): any {
		const data = Cookie.parse<T>(this.__document.cookie);
		return key ? data[key as T[number]] ?? null : data;
	}

	public has<K extends T[number]>(key: K): boolean {
		return this.get(key) != null;
	}

	public set<K extends T[number]>(key: K, value: string, options: Partial<Options> = Cookie.DEFAULT_OPTIONS): void {
		this.__document.cookie += Cookie.__stringifyItem(key, value, options === Cookie.DEFAULT_OPTIONS ? options : {...Cookie.DEFAULT_OPTIONS, ...options});
	}

	public unset<K extends T[number]>(key: K): void {
		this.set(key, "", {
			expires: new Date(0),
			maxAge: 0
		});
	}

	public clear(): void {
		const data = this.get();
		for (const key in data) 
			this.unset(key);
	}

	public static parse<T extends string[] = string[]>(data: string): {[K in T[number]]?: string} {
		const result: any = {};
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
