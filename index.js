const { resolve } = require("path");

function combineAliasFileName(aliases, file) {
  const aliasNames = Object.keys(aliases);
  const index = aliasNames.indexOf(file);

  if (index === -1) {
    const [hit] = aliasNames.filter(a => file.startsWith(a + "/"));

    if (hit) {
      const root = aliases[hit];
      const path = file.replace(hit, "");
      return `${root}${path}`;
    }
  }

  return aliases[file];
}

module.exports = function(bundler) {
  const resolver = bundler.resolver;
  const gA = resolver.__proto__.getAlias;

  resolver.__proto__.getAlias = function(filename, dir, aliases) {
    if (aliases && filename.startsWith("@")) {
      const alias = combineAliasFileName(aliases, filename);

      if (alias) {
        return resolve(dir, alias);
      }
    }

    return gA.call(resolver, filename, dir, aliases);
  };
};
