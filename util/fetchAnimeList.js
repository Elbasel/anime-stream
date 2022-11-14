export async function fetchAll(array) {
  const promiseList = [];
  const jsonList = [];

  array.forEach((elem) => {
    const fetchUrl = `https://gogoanime.consumet.org/anime-details/${elem}`;
    promiseList.push(fetch(fetchUrl));
  });

  const results = await Promise.all(promiseList);

  results.forEach((r) => jsonList.push(r.json()));

  const data = await Promise.all(jsonList);

  return data;
}
