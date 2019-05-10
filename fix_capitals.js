function fix_capitals(string)
{
  string = string.toLowerCase()
  var all = string.split(" ");
  var x = all.length
  for (var i = 0; i < x; i++) {
      all[i] = all[i][0].toUpperCase() + all[i].substr(1);
  }

  return all.join(" ");
}

module.exports = fix_capitals