const Roles = jest.fn();

let roles = {};

Roles.addUsersToRoles = jest.fn((userId, inputRoles, key) => {
  roles[userId] = roles[userId] || {};
  roles[userId][key] = roles[userId][key] || [];
  roles[userId][key] = roles[userId][key].concat(inputRoles);
  return roles[userId][key];
});

Roles.userIsInRole = jest.fn((userId, role, key) =>
  !!roles[userId] && !!roles[userId][key] && roles[userId][key].includes(role));

Roles.__clear = jest.fn(() => {
  roles = {};
});

module.exports = { Roles };
