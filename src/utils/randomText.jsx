export const randomText = (data) => {
  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex].text;
};
