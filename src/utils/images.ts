export const getImages = async (apiURL: string) => {
  try {
    const images = await fetch(apiURL).then((res) => res.json());
    return images;
  } catch (error) {
    return [];
  }
};
