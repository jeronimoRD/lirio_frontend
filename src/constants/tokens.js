const colors = {
  brand: '#A81245',
  'brand-tint': '#FBF0F1',
  'brand-line': '#E8C9CE',
  beige: '#DCC7A8',
  screen: '#FCFAF8',
  'muted-surface': '#F0ECE7',
  'icon-well': '#F4EEE7',
  line: '#EAE6E1',
  ink: '#292724',
  'ink-secondary': '#6E6B68',
  'ink-muted': '#A09B95',

  'admin-brand': '#A91243',
  'admin-ink': '#241E1B',
  'admin-brown': '#4A3728',
  'admin-muted': '#7A6E65',
  'admin-line': '#EDE7E1',
  'admin-screen': '#FAF8F6',
  'admin-tint': '#F8E7ED',
  'admin-success': '#1F6B47',
  'admin-success-bg': '#E4F1EA',
  'admin-danger': '#C2391F',
  'admin-danger-bg': '#FBE6E1',
  'admin-danger-line': '#E9AFA6',
  'admin-faint': '#A09B95',
};

const radius = {
  row: '18px',
  card: '20px',
  tile: '24px',
  hero: '28px',
};

/**
 * Colores sólidos de portada que el usuario puede elegir en Editar perfil.
 * Deben coincidir con BANNER_PALETTE en backend/src/users/banner-palette.ts:
 * el servidor valida el valor contra esa lista.
 */
const bannerPalette = [
  { name: 'Vino', hex: '#A81245' },
  { name: 'Rosa', hex: '#E8C9CE' },
  { name: 'Champán', hex: '#DCC7A8' },
  { name: 'Crema', hex: '#F4EEE7' },
  { name: 'Tinta', hex: '#292724' },
  { name: 'Piedra', hex: '#6E6B68' },
  { name: 'Terracota', hex: '#B4654A' },
  { name: 'Oliva', hex: '#7C7A54' },
];

const glass = {
  fill: 'rgba(252, 250, 248, 0.55)',
  header: 'rgba(252, 250, 248, 0.6)',
  edge: 'rgba(255, 255, 255, 0.5)',
  brandFill: 'rgba(168, 18, 69, 0.10)',
  brandEdge: 'rgba(168, 18, 69, 0.18)',
  garmentFill: 'rgba(252, 250, 248, 0.4)',
  outfitFill: 'rgba(168, 18, 69, 0.78)',
  toast: 'rgba(41, 39, 36, 0.88)',
};

module.exports = { colors, radius, glass, bannerPalette };
