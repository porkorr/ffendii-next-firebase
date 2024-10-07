export const formatDateTime = (value) => {
  let dateObject;
  if (value?.toDate) {
    dateObject = value.toDate();
  } else if (typeof value === "string") {
    dateObject = new Date(value);
  } else {
    return "Invalid date";
  }

  const optionsDate = { day: "2-digit", month: "2-digit", year: "2-digit" };
  const optionsTime = { hour: "2-digit", minute: "2-digit" };

  const date = dateObject.toLocaleDateString("th-TH", optionsDate);
  const time = dateObject.toLocaleTimeString("th-TH", optionsTime);

  return `${date} ${time}`;
};

export const getYouTubeVideoId = (url) => {
  const regex = /[?&]v=([^&#]*)/;
  const match = url?.match(regex);
  return match ? match[1] : null;
};

export const randomText = (data) => {
  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex].text;
};
