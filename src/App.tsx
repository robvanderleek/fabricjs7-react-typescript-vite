import './App.css'
import {useEffect, useRef} from "react";
import {Canvas, Circle, type FabricObject, type TPointerEventInfo} from "fabric";

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

    useEffect(() => {
        const canvas = new Canvas("myCanvas");
        canvas.setDimensions({width: 400, height: 300});
        canvas.on("mouse:down", (e) => handleMouseDownCircle(canvas, e));
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