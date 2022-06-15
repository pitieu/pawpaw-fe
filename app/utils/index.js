const MAPBOX_ACCESS_TOKEN =
  'pk.eyJ1IjoidnVjbXMwMjAyIiwiYSI6ImNrYzd3YXN5YjB0bzQyeWxqaHk3cndkZWUifQ.Rrt9iMYACnqGK-rCblD0Ag';

export const removeDuplicateObjectFromArray = (array, key) => {
  var check = new Set();
  return array.filter(obj => {
    return !check.has(obj[key]) && check.add(obj[key]);
  });
};

export const timestampToString = (create_at, suffix) => {
  let diffTime = (new Date().getTime() - (create_at || 0)) / 1000;
  if (diffTime < 60) diffTime = 'Just now';
  else if (diffTime > 60 && diffTime < 3600) {
    diffTime =
      Math.floor(diffTime / 60) +
      (Math.floor(diffTime / 60) > 1
        ? suffix
          ? ' minutes'
          : 'm'
        : suffix
        ? ' minute'
        : 'm') +
      (suffix ? ' ago' : '');
  } else if (diffTime > 3600 && diffTime / 3600 < 24) {
    diffTime =
      Math.floor(diffTime / 3600) +
      (Math.floor(diffTime / 3600) > 1
        ? suffix
          ? ' hours'
          : 'h'
        : suffix
        ? ' hour'
        : 'h') +
      (suffix ? ' ago' : '');
  } else if (diffTime > 86400 && diffTime / 86400 < 30) {
    diffTime =
      Math.floor(diffTime / 86400) +
      (Math.floor(diffTime / 86400) > 1
        ? suffix
          ? ' days'
          : 'd'
        : suffix
        ? ' day'
        : 'd') +
      (suffix ? ' ago' : '');
  } else {
    diffTime = new Date(create_at || 0).toDateString();
  }
  return diffTime;
};

export const searchLocation = query => {
  return new Promise((resolve, reject) => {
    fetch(
      `http://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURI(
        query.trim(),
      )}.json?access_token=${MAPBOX_ACCESS_TOKEN}`,
    )
      .then(res => res.json())
      .then(data => {
        const address = [];
        const result = data;
        result.features.map(feature => {
          address.push({
            id: feature.id,
            place_name: feature.place_name,
            center: feature.center,
          });
        });
        resolve(address);
      })
      .catch(err => reject(err));
  });
};

export function capitalizeFirstLetter(str) {
  return str.replace(/^\w/, c => c.toUpperCase());
  // return str.charAt(0).toUpperCase() + str.slice(1);
}
