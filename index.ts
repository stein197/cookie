export = Cookie;

class Cookie<T extends string[] = string[]> {

	private static readonly DEFAULT_OPTIONS: Partial<Options> = {
		path: "/"
	};

	public constructor(private readonly __document: Document) {}

	public get<K extends T[number]>(key: K): string | null {
		const data = Cookie.parse<T>(this.__document.cookie);
		return data[key] ?? null;
	}

	public set<K extends T[number]>(key: K, value: string, options: Partial<Options> = Cookie.DEFAULT_OPTIONS): void {}

	public unset<K extends T[number]>(key: K): void {}

	public static parse<T extends string[] = string[]>(cookie: string): {[K in T[number]]?: string} {}

	public static stringify(data): string {}
}

type Options = {
	path: string;
	expires: string | Date;
	maxAge: number;
	domain: string;
	secure: boolean;
	samesite: boolean;
	httponly: boolean;
}