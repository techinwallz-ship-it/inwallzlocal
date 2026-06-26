export const registerDisplay = async () => {
  const res = await fetch("http://203.101.40.119:5000/api/display/register", {
    method: "POST"
  });

  return res.json();
};
