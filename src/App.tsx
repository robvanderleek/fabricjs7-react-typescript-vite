import './App.css'
import {useEffect, useRef} from "react";
import {Canvas, Circle, controlsUtils, type FabricObject, Polygon, Polyline, type TPointerEventInfo} from "fabric";

export default function App() {
    const shape = useRef<FabricObject | undefined>(undefined);

    const handleMouseDownCircle = (canvas: Canvas, event: TPointerEventInfo) => {
        const pointer = event.scenePoint;
        const newCircle = new Circle({
            left: pointer.x,
            top: pointer.y,
            radius: 30,
            stroke: "black",
            strokeWidth: 2,
            selectable: true,
            hasControls: true,
        });
        canvas.add(newCircle);
        canvas.requestRenderAll();
    };

    const handleMouseDownPolyLine = (canvas: Canvas, event: TPointerEventInfo) => {
        if (shape.current) {
            const pointer = event.scenePoint;
            const line = shape.current as Polyline;
            line.points.push({x: pointer.x, y: pointer.y});
            canvas.requestRenderAll();
        } else {
            const pointer = event.scenePoint;
            shape.current = new Polygon([{x: pointer.x, y: pointer.y}, {x: pointer.x, y: pointer.y}], {
                stroke: 'green',
                selectable: true,
                hasControls: true,
                objectCaching: false,
                strokeWidth: 2,
            });
            canvas.add(shape.current);
            canvas.requestRenderAll();
        }
    }

    const handleMouseMovePolyLine = (canvas: Canvas, event: TPointerEventInfo) => {
        if (!shape.current) {
            return;
        }
        const pointer = event.scenePoint;
        const line = shape.current as Polyline;
        line.points[line.points.length - 1].x = pointer.x;
        line.points[line.points.length - 1].y = pointer.y;
        line.dirty = true;
        canvas.requestRenderAll();
    };

    const handleMouseDblClickPolyLine = (canvas: Canvas, disposer: VoidFunction) => {
        const poly = shape.current as Polygon;
        console.log('FINAL POLY POINTS:', poly.points);
        poly.setCoords();
        canvas.remove(poly);
        const poly2 = new Polygon(poly.points.slice(0, poly.points.length - 2), {
            stroke: 'blue',
            selectable: true,
            hasControls: true,
            objectCaching: false,
            strokeWidth: 4,
        });
        poly2.cornerStyle = 'circle';
        poly2.cornerColor = 'rgba(0,0,255,0.5)';
        poly2.hasBorders = false;
        poly2.controls = controlsUtils.createPolyControls(poly);
        canvas.add(poly2);
        shape.current = undefined;
        disposer();
    }

    useEffect(() => {
        const canvas = new Canvas("myCanvas");
        canvas.setDimensions({width: 800, height: 600});
        // canvas.on("mouse:down", (e) => handleMouseDownCircle(canvas, e));
        const mouseDownDisposer = canvas.on("mouse:down", (e) => handleMouseDownPolyLine(canvas, e));
        canvas.on('mouse:move', (e) => handleMouseMovePolyLine(canvas, e));
        canvas.on('mouse:dblclick', (e) => handleMouseDblClickPolyLine(canvas, mouseDownDisposer));
        return () => {
            canvas.dispose();
        }
    }, []);

    return (
        <div className="main">
            <h1>FabricJS</h1>
            <canvas id="myCanvas"/>
        </div>
    )
}