import React, { useState, useRef, RefObject } from 'react';
import PropTypes from 'prop-types';

import StylesGame from '../styles/game.module.css';
import useSocket from '../hooks/use-socket';
import CanvasBrush from '../types/canvas/brush';
import { getBrush, CanvasBrushType } from '../types/canvas/brush-type';
import CanvasAction from '../types/canvas/action';

type PropType = {
    id: number
}

function draw(canvas: RefObject<HTMLCanvasElement>, force: boolean): void {
    const ctx = canvas.current?.getContext('2d');
    
    // Get brush, let brush do work on canvas

    return;
}

const GameCanvas: React.FC<PropType> = ({ id }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const generateSocketEventName = (eventName: string) => `game.${id}.${eventName}`;

    useSocket(generateSocketEventName("draw.live"), (actionIndex: number, positionIndex: number, data: Record<string, unknown>, brushType?: CanvasBrushType) => {
        const [actions, setActions] = useState<CanvasAction[]>([]);

        let redrawNeeded = false;
        if (actionIndex < actions.length - 1) {
            redrawNeeded = true;
        }
        if (!actions[actionIndex]) {
            actions[actionIndex] = new CanvasAction(brushType);
        } else if (brushType) {
            actions[actionIndex].brush = brushType;
        }
        if (positionIndex < actions[actionIndex].positions.length) {
            redrawNeeded = true;
        }

        actions[actionIndex].positions[positionIndex] = data;
        setActions(actions);

        if (redrawNeeded) {
            draw(canvasRef, true);
        } else {
            draw(canvasRef, false);
        }
    });

    return <canvas ref={canvasRef} width="600" height="400"></canvas>;
};

GameCanvas.propTypes = {
    id: PropTypes.number.isRequired
};

export default GameCanvas;