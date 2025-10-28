const unwrap = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

const STORAGE_HASH = 'YSxTEMPLATE';

const STORAGE_KEY = `vuetres-template-${STORAGE_HASH}`;

export { unwrap, STORAGE_KEY };
