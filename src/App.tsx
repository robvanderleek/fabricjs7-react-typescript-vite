import './App.css'
import {type ChangeEvent, useEffect, useRef, useState} from "react";
import {Canvas, type FabricObject, type TPointerEventInfo} from "fabric";
import {
    handleMouseDoubleClickPolyLine,
    handleMouseDownCircle,
    handleMouseDownPolyLine,
    handleMouseDownRectangle,
    handleMouseMovePolyLine
} from "./canvas.ts";

export default function App() {
    const [selectedShapeType, setSelectedShapeType] = useState<string | undefined>(undefined);
    const canvasRef = useRef<Canvas | undefined>(undefined);
    const activeShape = useRef<FabricObject | undefined>(undefined);

    useEffect(() => {
        canvasRef.current = new Canvas("myCanvas");
        canvasRef.current.setDimensions({width: 800, height: 600});
        return () => {
            canvasRef.current?.dispose();
        }
    }, []);

    useEffect(() => {
        const handleMouseDown = (event: TPointerEventInfo) => {
            const canvas = canvasRef.current as Canvas;
            switch (selectedShapeType) {
                case 'circle':
                    activeShape.current = undefined;
                    handleMouseDownCircle(canvas, event);
                    setSelectedShapeType(undefined);
                    break;
                case 'rectangle':
                    activeShape.current = undefined;
                    handleMouseDownRectangle(canvas, event);
                    setSelectedShapeType(undefined);
                    break;
                case 'polygon':
                    handleMouseDownPolyLine(canvas, event, activeShape);
                    break;
                default:
                    break;
            }
        }

        const handleMouseMove = (event: TPointerEventInfo) => {
            const canvas = canvasRef.current as Canvas;
            switch (selectedShapeType) {
                case 'polygon':
                    handleMouseMovePolyLine(canvas, event, activeShape);
                    break;
                default:
                    break;
            }
        }

        const handleMouseDoubleClick = () => {
            const canvas = canvasRef.current as Canvas;
            switch (selectedShapeType) {
                case 'polygon':
                    handleMouseDoubleClickPolyLine(canvas, activeShape);
                    setSelectedShapeType(undefined);
                    break;
                default:
                    break;
            }
        }

        if (canvasRef.current) {
            const canvas = canvasRef.current;
            canvas.on("mouse:down", handleMouseDown);
            canvas.on('mouse:move', handleMouseMove);
            canvas.on('mouse:dblclick', handleMouseDoubleClick);
        }

        return () => {
            if (canvasRef.current) {
                const canvas = canvasRef.current;
                canvas.off('mouse:down', handleMouseDown);
                canvas.off('mouse:move', handleMouseMove);
                canvas.off('mouse:dblclick', handleMouseDoubleClick);
            }
        };
    }, [canvasRef, selectedShapeType]);

    const handleShapeSelection = (e: ChangeEvent<HTMLInputElement>) => {
        setSelectedShapeType(e.target.value);
    }

    const clearCanvas = () => {
        if (canvasRef.current) {
            canvasRef.current.clear();
        }
    }

    const renderShapeButton = (shapeType: string) => {
        return (
            <label>
                <input type="radio" name="shape" value={shapeType} checked={selectedShapeType === shapeType}
                       onChange={handleShapeSelection}/>
                <span>{shapeType}</span>
            </label>
        );
    }

    return (
        <div className="main">
            <div className="container">
                <canvas id="myCanvas"/>
                <div className="sidebar">
                    <div className="shapes">
                        {renderShapeButton('circle')}
                        {renderShapeButton('rectangle')}
                        {renderShapeButton('polygon')}
                    </div>
                    <div className="actions">
                        <span onClick={clearCanvas}>clear</span>
                    </div>
                </div>
            </div>
        </div>
    );
}