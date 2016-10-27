
type Applicative = (value: string, name: string) => any;

export type Header = {
    has: (name: string) => boolean,
    get: (name: string) => ?string,
    getAll: (name: string) => Array<String>,
    set: (name: string, value: string) => void,
    append: (name: string, value: string) => void,
    delete: (name: string) => void,
    forEach: (a: Applicative, context?: mixed) => Array<any>
};

export type Response = {
    ok: boolean,
    url: string

    status: number,
    statusText: string,

    headers: Array<Header>,

    text: () => string,
    json: () => JSON,
    blob: () => Blob,
    arrayBuffer: () => ArrayBuffer,
    formData: () => FormData,

    clone: () => Response
}
