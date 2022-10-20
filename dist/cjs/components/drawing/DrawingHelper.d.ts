declare const createElement: (id: string, x1: number, y1: number | null, x2: number | null, y2: number | null, type: string, options: any, generator: any) => {
    id: string;
    x1: number;
    y1: number | null;
    x2: number | null;
    y2: number | null;
    type: "line" | "rectangle";
    options: any;
    roughElement: any;
    points?: undefined;
    text?: undefined;
} | {
    id: string;
    type: "pencil";
    points: {
        x: number;
        y: number | null;
    }[];
    options: any;
    x1?: undefined;
    y1?: undefined;
    x2?: undefined;
    y2?: undefined;
    roughElement?: undefined;
    text?: undefined;
} | {
    id: string;
    type: "text";
    x1: number;
    y1: number | null;
    x2: number | null;
    y2: number | null;
    text: string;
    options?: undefined;
    roughElement?: undefined;
    points?: undefined;
};
declare const getElementAtPosition: (x: number, y: number, elements: any) => any;
declare const adjustElementCoordinates: (element: any) => {
    x1: any;
    y1: any;
    x2: any;
    y2: any;
};
declare const cursorForPosition: (position: string) => "nwse-resize" | "nesw-resize" | "move";
declare const resizedCoordinates: (clientX: number, clientY: number, position: string, coordinates: any) => {
    x1: number;
    y1: number;
    x2: any;
    y2: any;
} | {
    x1: any;
    y1: number;
    x2: number;
    y2: any;
} | {
    x1: number;
    y1: any;
    x2: any;
    y2: number;
} | {
    x1: any;
    y1: any;
    x2: number;
    y2: number;
} | null;
declare const useHistory: (initialState: any) => any[];
declare const drawElement: (roughCanvas: any, context: any, element: any) => void;
declare const adjustmentRequired: (type: string) => boolean;
export { createElement, getElementAtPosition, adjustElementCoordinates, cursorForPosition, resizedCoordinates, useHistory, drawElement, adjustmentRequired, };
