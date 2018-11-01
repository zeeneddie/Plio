const Roles = jest.fn();

let roles = {};

Roles.addUsersToRoles = jest.fn((userId, inputRoles, key) => {
  roles[userId] = roles[userId] || {};
  roles[userId][key] = roles[userId][key] || [];
  roles[userId][key] = roles[userId][key].concat(inputRoles);
  return roles[userId][key];
});

Roles.userIsInRole = jest.fn((userId, role, key) => {
  const _roles = Array.isArray(role) ? role : [role];
  return !!roles[userId] &&
    !!roles[userId][key] &&
    _roles.every(r => roles[userId][key].includes(r));
});

Roles.__clear = jest.fn(() => {
  roles = {};
});

module.exports = { Roles };
