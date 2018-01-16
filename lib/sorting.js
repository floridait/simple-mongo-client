function alphaSortCollectionNames(a, b) {
  if (a.s.name < b.s.name) return -1;
  if (a.s.name > b.s.name) return 1;
  return 0;
}

module.exports = {
  alphaSortCollectionNames,
};
