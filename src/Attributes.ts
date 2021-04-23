/**
 * Represent cookie's additional attribues
 */
export type Attributes = {
	/** Path to location this cookie is available. By default is `/` */
	path?: string,
	/** At which date cookie expires */
	expires?: string | Date,
	/** Max age of cookie in seconds */
	maxAge?: number,
	/** Domain within which the cookie is available */
	domain?: string,
	secure?: boolean,
	sameSite?: boolean
}
