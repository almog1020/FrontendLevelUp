export const normalizeCsId = (id: string) => (id.startsWith("cs_") ? id : `cs_${id}`);
