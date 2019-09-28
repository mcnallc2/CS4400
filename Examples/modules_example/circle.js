const PI = 3.14159265359;

function area(radius) {
  return (radius ** 2) * PI;
}

function circumference(radius) {
  return 2 * radius * PI;
}

module.exports = {PI : PI, area : area, circumference : circumference};
