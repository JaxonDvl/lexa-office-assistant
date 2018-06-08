function generateProjectKey(projectName) {
  let key = "";
  let possible = projectName.trim();

  for (let i = 0; i < 3; i++)
    key += possible.charAt(Math.floor(Math.random() * possible.length));

  return key.toUpperCase();
}

function generateUniqueProjectKey(projectName, listOfKeys) {
  let preventInfinite = 9999;
  let tryCount = 0;
  let key;

  while (!key && tryCount < preventInfinite) {
    key = generateProjectKey(projectName);
    if (listOfKeys.indexOf(key) !== -1) {
      key = null;
      tryCount++;
    }
  }
  return key;
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports.generateUniqueProjectKey = generateUniqueProjectKey;
module.exports.capitalize = capitalize;  