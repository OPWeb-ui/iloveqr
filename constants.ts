import type { QROptions, Preset, LabelOptions } from './types';

export const DEFAULT_OPTIONS: QROptions = {
  width: 1000,
  height: 1000,
  margin: 40,
  qrOptions: {
    typeNumber: 0,
    mode: 'Byte',
    errorCorrectionLevel: 'H',
  },
  imageOptions: {
    hideBackgroundDots: true,
    imageSize: 0.4,
    margin: 20,
    crossOrigin: 'anonymous',
  },
  dotsOptions: {
    color: '#A76BFF',
    type: 'rounded',
    gradient: {
      type: 'linear',
      rotation: Math.PI / 4,
      colorStops: [
        { offset: 0, color: '#8A2EFF' },
        { offset: 1, color: '#46C6FF' },
      ],
    },
  },
  backgroundOptions: {
    color: 'transparent',
  },
  cornersSquareOptions: {
    type: 'extra-rounded',
    gradient: {
      type: 'linear',
      rotation: Math.PI / 4,
      colorStops: [
        { offset: 0, color: '#8A2EFF' },
        { offset: 1, color: '#FF4BC8' },
      ],
    },
  },
  cornersDotOptions: {
    type: 'dot',
    color: '#A76BFF'
  },
};

export const DEFAULT_LABEL_OPTIONS: LabelOptions = {
  text: '',
  font: 'Poppins',
  position: 'bottom',
  color: '#FFFFFF',
};

export const COLOR_PALETTE: string[] = [
  '#000000', '#444444', '#6B7280', '#9CA3AF', '#E5E7EB', '#FFFFFF', 'transparent',
  '#EF4444', '#F97316', '#FBBF24', '#84CC16', '#22C55E', '#14B8A6', '#06B6D4',
  '#3B82F6', '#8B5CF6', '#EC4899', '#F43F5E'
].filter(c => c !== 'transparent').concat(['transparent']); // Keep transparent at the end


export const FONT_PRESETS: string[] = [
  'Poppins',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Roboto Mono',
  'Lobster',
  'Pacifico',
  'Anton',
  'Oswald',
  'Source Code Pro',
  'Merriweather',
  'Playfair Display',
  'Lora',
  'Nunito',
  'Raleway',
  'Ubuntu',
  'Bebas Neue',
  'Caveat',
  'Shadows Into Light',
  'Major Mono Display',
  'Inconsolata',
  'Fira Code',
  'Zilla Slab',
  'Arvo',
  'Cormorant Garamond',
  'Exo 2',
  'Teko',
  'Crimson Text',
  'Cabin',
  'Josefin Sans',
];

export const PRESETS: Preset[] = [
  {
    name: 'Aurora',
    options: {
      dotsOptions: {
        color: '#FFFFFF',
        type: 'rounded',
        gradient: {
          type: 'linear',
          rotation: 0.785,
          colorStops: [{ offset: 0, color: '#8A2EFF' }, { offset: 1, color: '#FF4BC8' }],
        },
      },
      backgroundOptions: { color: 'transparent' },
      cornersSquareOptions: { type: 'extra-rounded', color: '#A76BFF' },
    },
  },
  {
    name: 'Classic',
    options: {
      dotsOptions: { color: '#000000', type: 'square', gradient: undefined },
      backgroundOptions: { color: '#FFFFFF' },
      cornersSquareOptions: { type: 'square', color: '#000000', gradient: undefined },
      image: '',
    },
  },
  {
    name: 'Cotton Candy',
    options: {
      dotsOptions: { color: '#F472B6', type: 'classy-rounded', gradient: undefined },
      backgroundOptions: { color: '#FEF2F2' },
      cornersSquareOptions: { type: 'extra-rounded', color: '#F472B6', gradient: undefined },
      image: '',
    },
  },
   {
    name: 'Ocean',
    options: {
      dotsOptions: {
        color: '#FFFFFF',
        type: 'dots',
        gradient: {
          type: 'linear',
          rotation: 0,
          colorStops: [{ offset: 0, color: '#00F260' }, { offset: 1, color: '#0575E6' }],
        },
      },
      backgroundOptions: { color: '#FFFFFF' },
      cornersSquareOptions: { type: 'extra-rounded', color: '#0575E6' },
      image: '',
    },
  },
  {
    name: 'Graphite',
    options: {
      dotsOptions: {
        color: '#FFFFFF',
        type: 'dots',
        gradient: {
          type: 'linear',
          rotation: 0,
          colorStops: [{ offset: 0, color: '#333333' }, { offset: 1, color: '#000000' }],
        },
      },
      backgroundOptions: { color: '#EEEEEE' },
      cornersSquareOptions: { type: 'extra-rounded', color: '#111111' },
      image: '',
    },
  },
  {
    name: 'Solar Flare',
    options: {
      dotsOptions: {
        color: '#FFFFFF',
        type: 'classy',
        gradient: {
          type: 'linear',
          rotation: 0.785,
          colorStops: [{ offset: 0, color: '#FFD60A' }, { offset: 1, color: '#FF3C78' }],
        },
      },
      backgroundOptions: { color: 'transparent' },
      cornersSquareOptions: { type: 'extra-rounded', color: '#FF3C78' },
      image: '',
    },
  },
  {
    name: 'Emerald',
    options: {
      dotsOptions: {
        color: '#008269',
        type: 'dots',
        gradient: undefined,
      },
      backgroundOptions: { color: '#F0FFF4' },
      cornersSquareOptions: { type: 'extra-rounded', color: '#008269' },
      image: '',
    },
  },
  {
    name: 'Cyberpunk',
    options: {
      dotsOptions: {
        color: '#FFFFFF',
        type: 'square',
        gradient: {
          type: 'linear',
          rotation: 2.356,
          colorStops: [{ offset: 0, color: '#00FFFF' }, { offset: 1, color: '#FF00FF' }],
        },
      },
      backgroundOptions: { color: '#0A0014' },
      cornersSquareOptions: { type: 'square', color: '#FF00FF' },
      image: '',
    },
  },
  {
    name: 'Mint Chocolate',
    options: {
      dotsOptions: {
        type: 'dots',
        gradient: {
          type: 'linear',
          rotation: 0,
          colorStops: [{ offset: 0, color: '#4A2E2A' }, { offset: 1, color: '#2C1A17' }],
        },
      },
      backgroundOptions: { color: '#F0FFF0' },
      cornersSquareOptions: { type: 'extra-rounded', color: '#4A2E2A', gradient: undefined },
      image: '',
    },
  },
  {
    name: 'Royal Gold',
    options: {
      dotsOptions: {
        type: 'classy',
        gradient: {
          type: 'linear',
          rotation: 0.785,
          colorStops: [{ offset: 0, color: '#FFD700' }, { offset: 1, color: '#B8860B' }],
        },
      },
      backgroundOptions: { color: '#2d004f' },
      cornersSquareOptions: { type: 'dot', color: '#B8860B', gradient: undefined },
      image: '',
    },
  },
  {
    name: 'Strawberry Daiquiri',
    options: {
      dotsOptions: {
        type: 'rounded',
        gradient: {
          type: 'linear',
          rotation: 0.785,
          colorStops: [{ offset: 0, color: '#FF005E' }, { offset: 1, color: '#FF6347' }],
        },
      },
      backgroundOptions: { color: '#FFF0F5' },
      cornersSquareOptions: { type: 'extra-rounded', color: '#FF005E', gradient: undefined },
      image: '',
    },
  },
  {
    name: 'Glitch Matrix',
    options: {
      dotsOptions: {
        type: 'dots',
        gradient: {
          type: 'linear',
          rotation: Math.PI / 2,
          colorStops: [{ offset: 0, color: '#39FF14' }, { offset: 1, color: '#008F11' }],
        },
      },
      backgroundOptions: { color: '#050505' },
      cornersSquareOptions: { type: 'square', color: '#39FF14', gradient: undefined },
      image: '',
    },
  },
];