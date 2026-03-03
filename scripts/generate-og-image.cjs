const { createCanvas, loadImage, registerFont } = require("canvas");
const fs = require("fs");
const path = require("path");

const WIDTH = 1200;
const HEIGHT = 630;

async function generateOGImage() {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  // --- Background ---
  ctx.fillStyle = "#FAF7F2";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // --- Decorative circles ---

  // Large rose pink circle on the right side
  ctx.beginPath();
  ctx.arc(950, 315, 360, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(232, 180, 168, 0.20)";
  ctx.fill();

  // Smaller sage green circle on the left side
  ctx.beginPath();
  ctx.arc(200, 200, 220, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(91, 123, 106, 0.10)";
  ctx.fill();

  // --- Load and draw character image ---
  const characterPath = path.join(
    __dirname,
    "..",
    "public",
    "doughby-character.png"
  );
  const characterImg = await loadImage(characterPath);

  // Size the character: make it prominent but not overwhelming
  const charSize = 400;
  const charX = 80;
  const charY = (HEIGHT - charSize) / 2 + 10;

  // Draw a subtle warm shadow/glow behind the character
  ctx.beginPath();
  ctx.arc(charX + charSize / 2, charY + charSize / 2 + 10, charSize / 2.3, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(232, 180, 168, 0.12)";
  ctx.fill();

  ctx.drawImage(characterImg, charX, charY, charSize, charSize);

  // --- Text on the right side ---
  const textX = 530;

  // Title: "Doughby"
  ctx.fillStyle = "#2D3B35";
  ctx.font = "bold 80px 'Arial Rounded MT Bold', 'Nunito', 'Arial', sans-serif";
  ctx.textBaseline = "top";
  ctx.fillText("Doughby", textX, 140);

  // Tagline: "Your sourdough starter is alive."
  ctx.fillStyle = "#5B7B6A";
  ctx.font = "600 32px 'Nunito', 'Arial', sans-serif";
  ctx.fillText("Your sourdough starter is alive.", textX, 245);

  // Sub-tagline: "Track feedings. Monitor health. Map your lineage."
  ctx.fillStyle = "#6B7B73";
  ctx.font = "400 22px 'Nunito', 'Arial', sans-serif";
  ctx.fillText("Track feedings. Monitor health.", textX, 300);
  ctx.fillText("Map your lineage.", textX, 330);

  // --- Subtle bottom accent line ---
  const gradient = ctx.createLinearGradient(100, 0, WIDTH - 100, 0);
  gradient.addColorStop(0, "rgba(91, 123, 106, 0.0)");
  gradient.addColorStop(0.3, "rgba(91, 123, 106, 0.15)");
  gradient.addColorStop(0.7, "rgba(232, 180, 168, 0.15)");
  gradient.addColorStop(1, "rgba(232, 180, 168, 0.0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(100, HEIGHT - 50, WIDTH - 200, 2);

  // --- Save ---
  const outputPath = path.join(__dirname, "..", "public", "og-image.png");
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(outputPath, buffer);
  console.log(`OG image saved to: ${outputPath}`);
  console.log(`Size: ${buffer.length} bytes (${(buffer.length / 1024).toFixed(1)} KB)`);
}

generateOGImage().catch((err) => {
  console.error("Failed to generate OG image:", err);
  process.exit(1);
});
