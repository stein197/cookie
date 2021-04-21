export type Attributes = {
	path: string,
	expires: string | Date,
	maxAge: number,
	domain: string,
	secure: boolean,
	sameSite: boolean
}
