export function createElement(id: any, x1: any, y1: any, x2: any, y2: any, type: any, options: any, generator: any): {
    id: any;
    x1: any;
    y1: any;
    x2: any;
    y2: any;
    type: any;
    options: any;
    roughElement: any;
    points?: undefined;
    text?: undefined;
} | {
    id: any;
    type: any;
    points: {
        x: any;
        y: any;
    }[];
    options: any;
    x1?: undefined;
    y1?: undefined;
    x2?: undefined;
    y2?: undefined;
    roughElement?: undefined;
    text?: undefined;
} | {
    id: any;
    type: any;
    x1: any;
    y1: any;
    x2: any;
    y2: any;
    text: string;
    options?: undefined;
    roughElement?: undefined;
    points?: undefined;
};
export function getElementAtPosition(x: any, y: any, elements: any): any;
export function adjustElementCoordinates(element: any): {
    x1: any;
    y1: any;
    x2: any;
    y2: any;
};
export function cursorForPosition(position: any): "nwse-resize" | "nesw-resize" | "move";
export function resizedCoordinates(clientX: any, clientY: any, position: any, coordinates: any): {
    x1: any;
    y1: any;
    x2: any;
    y2: any;
} | null;
export function useHistory(initialState: any): any[];
export function drawElement(roughCanvas: any, context: any, element: any): void;
export function adjustmentRequired(type: any): boolean;
