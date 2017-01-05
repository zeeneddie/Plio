const amazonAllowedName = /^[a-zA-Z0-9_.-]+$/g;

export const nameIsAllowed = (name) => amazonAllowedName.test(name);
