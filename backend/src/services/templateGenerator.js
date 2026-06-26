const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");

async function generateTemplateImage(
  templatePath,
  overlayText,
  outputPath
) {
  const image = await loadImage(templatePath);

  const canvas = createCanvas(
    image.width,
    image.height
  );

  const ctx = canvas.getContext("2d");

  ctx.drawImage(image, 0, 0);

  // TEMP TEST POSITION
  ctx.font = "bold 60px Arial";
  ctx.fillStyle = "#ffffff";

  ctx.fillText(
    overlayText,
    100,
    image.height / 2
  );

  fs.writeFileSync(
    outputPath,
    canvas.toBuffer("image/png")
  );

  return outputPath;
  console.log("================================");
console.log("templatePath =", templatePath);
console.log("outputPath =", outputPath);
console.log("overlayText =", overlay_text);
console.log("template exists =", fs.existsSync(templatePath));
console.log("================================");
}

module.exports = {
  generateTemplateImage
};