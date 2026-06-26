export const registerDisplay = async () => {
  const res = await fetch("https://api.inwallz.in/api/display/register", {
    method: "POST"
  });

  return res.json();
};
