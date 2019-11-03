export async function waitForNextFrame() {
  return new Promise(yay => requestAnimationFrame(yay));
}
