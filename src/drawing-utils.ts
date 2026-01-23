import {
    Canvas,
    Circle,
    controlsUtils,
    type FabricObject,
    Polygon,
    type Polyline,
    Rect,
    type TPointerEventInfo
} from "fabric";
import type {RefObject} from "react";

function addObjectToCanvas(canvas: Canvas, obj: FabricObject) {
    canvas.add(obj);
    canvas.setActiveObject(obj);
    obj.on('selected', (e) => {
        e.target.set('stroke', 'red');
    });
    obj.on('deselected', (e) => {
        e.target.set('stroke', 'black');
    });
}

export function handleMouseDownCircle(canvas: Canvas, event: TPointerEventInfo) {
    const pointer = event.scenePoint;
    const circle = new Circle({
        left: pointer.x,
        top: pointer.y,
        radius: 30,
        stroke: "red",
        fill: "lightgray",
        strokeWidth: 2,
        selectable: true,
        hasControls: true,
    });
    addObjectToCanvas(canvas, circle);
}

export function handleMouseDownRectangle(canvas: Canvas, event: TPointerEventInfo) {
    const pointer = event.scenePoint;
    const rectangle = new Rect({
        left: pointer.x,
        top: pointer.y,
        width: 60,
        height: 40,
        stroke: "red",
        fill: "lightgray",
        strokeWidth: 2,
        selectable: true,
        hasControls: true,
    });
    addObjectToCanvas(canvas, rectangle);
}

export function handleMouseDownPolyLine(canvas: Canvas, event: TPointerEventInfo,
                                        activeShape: RefObject<FabricObject | undefined>) {
    if (activeShape.current) {
        const pointer = event.scenePoint;
        const line = activeShape.current as Polyline;
        line.points.push({x: pointer.x, y: pointer.y});
        canvas.requestRenderAll();
    } else {
        const pointer = event.scenePoint;
        activeShape.current = new Polygon([{x: pointer.x, y: pointer.y}, {x: pointer.x, y: pointer.y}], {
            stroke: 'gold',
            strokeWidth: 2,
            fill: 'lightyellow',
            selectable: true,
            hasControls: true,
            objectCaching: false,
        });
        canvas.add(activeShape.current);
        canvas.requestRenderAll();
    }
}

export function handleMouseMovePolyLine(canvas: Canvas, event: TPointerEventInfo,
                                        activeShape: RefObject<FabricObject | undefined>) {
    if (!activeShape.current) {
        return;
    }
    const pointer = event.scenePoint;
    const line = activeShape.current as Polyline;
    line.points[line.points.length - 1].x = pointer.x;
    line.points[line.points.length - 1].y = pointer.y;
    line.dirty = true;
    canvas.requestRenderAll();
}

export function handleMouseDoubleClickPolyLine(canvas: Canvas, activeShape: RefObject<FabricObject | undefined>) {
    const poly = activeShape.current as Polygon;
    poly.setCoords();
    canvas.remove(poly);
    const polygonPoints = poly.points.slice(0, poly.points.length - 2);
    console.log('Polygon points:', polygonPoints);
    const poly2 = new Polygon(poly.points.slice(0, poly.points.length - 2), {
        stroke: 'red',
        fill: 'lightgray',
        selectable: true,
        hasControls: true,
        strokeWidth: 2,
    });
    poly2.cornerStyle = 'circle';
    poly2.cornerColor = 'rgba(0,0,255,0.5)';
    poly2.hasBorders = true;
    poly2.controls = controlsUtils.createPolyControls(poly2);
    addObjectToCanvas(canvas, poly2);
    activeShape.current = undefined;
}