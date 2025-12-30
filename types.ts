
export interface QROptions {
    width?: number;
    height?: number;
    margin?: number;
    data?: string;
    image?: string;
    qrOptions?: {
        typeNumber?: number;
        mode?: string;
        errorCorrectionLevel?: string;
    };
    imageOptions?: {
        hideBackgroundDots?: boolean;
        imageSize?: number;
        crossOrigin?: string;
        margin?: number;
        opacity?: number;
    };
    dotsOptions?: {
        type?: string;
        color?: string;
        gradient?: any;
    };
    backgroundOptions?: {
        color?: string;
        gradient?: any;
    };
    cornersSquareOptions?: {
        type?: string;
        color?: string;
        gradient?: any;
    };
    cornersDotOptions?: {
        type?: string;
        color?: string;
        gradient?: any;
    };
    [key: string]: any;
}

export interface Preset {
  name: string;
  options: Partial<QROptions>;
}

export interface LabelOptions {
  text: string;
  font: string;
  position: 'top' | 'bottom' | 'none';
  color: string;
}
