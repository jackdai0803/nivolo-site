// Accent the existing rig pose. Each gesture starts and ends at rest so the
// accessory animation, blinks and gallery pause all keep their original clock.
const gestureGroups = {
  nod: ['anubis', 'athena', 'hades', 'focused', 'sick', 'sleepy', 'melting', 'kintsugi', 'early-supporter'],
  lift: ['horus', 'zeus', 'blaze', 'party', 'champion', 'starstruck', 'glitch'],
  drift: ['poseidon', 'medusa', 'ghost', 'deepsea', 'rainy', 'white-lotus', 'orchid', 'spider-lily'],
  lean: ['artemis', 'apollo', 'jade', 'porcelain', 'jasmine', 'plum-blossom', 'osmanthus', 'crabapple'],
};
const gestures = new Map(Object.entries(gestureGroups).flatMap(([gesture, ids]) => ids.map(id => [id, gesture])));

export function accentPose(pose, id, elapsed) {
  const result = { ...pose };
  const gesture = gestures.get(id) || 'sway';
  const period = gesture === 'lift' ? 3700 : gesture === 'nod' ? 5400 : 4600;
  const phase = (elapsed % period) / period;
  // Give the bird a quiet beat between gestures.
  const beat = Math.sin(Math.PI * Math.min(1, phase / .68)) ** 2;
  const sway = Math.sin(phase * Math.PI * 2) * beat;
  if (gesture === 'nod') {
    result.y += 12 * beat;
    result.rotate += 1.8 * beat;
    result.sy -= .018 * beat;
    result.sx += .012 * beat;
  } else if (gesture === 'lift') {
    result.y -= 20 * beat;
    result.left += 9 * beat;
    result.right -= 11 * beat;
  } else if (gesture === 'drift') {
    result.x += 12 * sway;
    result.rotate += 2.3 * sway;
    result.right -= 5 * beat;
  } else {
    result.rotate += (gesture === 'lean' ? -2.8 : 2.1) * sway;
    result.left += 6 * beat;
  }
  return result;
}
