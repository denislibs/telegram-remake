// tweb's letter-avatar gradients: a vertical linear-gradient(top, bottom) from a
// 7-colour palette, picked by a stable hash of the peer (tweb uses peerId % 7).
// Values copied 1:1 from tweb's `avatar-color` includes (red/orange/violet/green/
// cyan/blue/pink).
const AVATAR_GRADIENTS: [string, string][] = [
  ['#FF845E', '#D45246'], // red
  ['#FEBB5B', '#F68136'], // orange
  ['#B694F9', '#6C61DF'], // violet
  ['#9AD164', '#46BA43'], // green
  ['#53EDD6', '#28C9B7'], // cyan
  ['#5CAFFA', '#408ACF'], // blue
  ['#FF8AAC', '#D95574'], // pink
]

export function peerAvatarGradient(seed: string): string {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  const [top, bottom] = AVATAR_GRADIENTS[h % AVATAR_GRADIENTS.length]
  return `linear-gradient(${top}, ${bottom})`
}
