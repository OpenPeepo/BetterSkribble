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

// TODO: LITERALLY SPREAD 3/4 OF THIS FILE SOMEWHERE ELSE

function* actionStepIndexIt(actions: CanvasAction[], indexLimit?: [number, number], start = [0, 0]): Generator<[number, number | null]> {
    const [actionStartIt, stepStartIt] = start;
    const [actionLimitIt, stepLimitIt] = indexLimit || [undefined, undefined];

    const reverse = actionLimitIt !== undefined && actionLimitIt < actionStartIt ||
        stepLimitIt !== undefined && stepLimitIt < stepStartIt;

    for (let actionIt = actionStartIt;
        reverse ? actionIt >= 0 : actionIt < actions.length;
        reverse ? actionIt-- : actionIt++) {
        const action = actions[actionIt];

        const steps = action?.steps;
        if (!steps || steps.length == 0) {
            yield [actionIt, null];
            continue;
        }

        for (let stepIt = (actionIt == actionStartIt) ? stepStartIt : (reverse ? steps.length - 1 : 0);
            reverse ? stepIt >= 0 : stepIt < steps.length;
            reverse ? stepIt-- : stepIt++) {
            yield [actionIt, stepIt];

            if (!actionLimitIt || !stepLimitIt) continue;

            if (actionIt == actionLimitIt && (reverse ? stepIt <= stepLimitIt : stepIt >= stepLimitIt) ||
                    (reverse ? actionIt < actionLimitIt : actionIt > actionLimitIt)) {
                return;
            }
        }
    }
}

function furthestRootedIndex(actions: CanvasAction[],
    indexRoot: [number, number] = [0, 0], maxIndex?: [number, number]) {
    const chainIterator = actionStepIndexIt(actions, maxIndex, indexRoot);

    let previousIteration: [number, number] | null = null;
    for (let indexItR = chainIterator.next(); !indexItR.done; indexItR = chainIterator.next()) {
        const [actionIndex, stepIndex] = indexItR.value;

        if (stepIndex === null || !actions[actionIndex].steps[stepIndex]) {
            break;
        }

        previousIteration = [actionIndex, stepIndex];
    }

    return previousIteration;
}

function pastImageDataIndex(actions: CanvasAction[],
    history: ImageData[][], presentIndex: [number, number], onlyFullActions = false): [number, number] | null {
    const imDaIterator = actionStepIndexIt(actions, [0, 0], presentIndex);

    // Skip present index
    if (imDaIterator.next().done) return null;

    for (let indexItR = imDaIterator.next(); !indexItR.done; indexItR = imDaIterator.next()) {
        const [actionIndex, stepIndex] = indexItR.value;
        if (stepIndex === null) continue;

        if (history[actionIndex][stepIndex]) {
            if (onlyFullActions && (actions[actionIndex] && stepIndex !== actions[actionIndex].steps.length - 1)) continue;

            return [actionIndex, stepIndex];
        }
    }

    return null;
}

function generateImDaState(ctx: CanvasRenderingContext2D): ImageData {
    return ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function draw(canvas: RefObject<HTMLCanvasElement>, actions: CanvasAction[],
    actionIndex = actions.length - 1,
    stepIndex = actions[actionIndex].steps.length): void {
    const currentCanvas = canvas.current;
    if (!currentCanvas) return;

    const ctx = currentCanvas.getContext('2d');
    if (!ctx) return;

    const [lastRoot, setLastRoot] = useState<[number, number]>();
    const [imDaHistory, setImDaHistory] = useState<ImageData[][]>([]);

    // Step 1
    //d Declare last action index i in a complete chain from the start (max actionIndex)
    //d Declare last step index j in a complete chain from the start (max arraylength)
    // Step 2
    //t Render everything from the latest imagedata state before both indices up to a[i][j],
    //d if it.brush.completeOnly skip imgData UNLESS (!) last element of action

    for (let actionIt = actionIndex; actionIndex < actions.length; actionIt++) {
        const action = actions[actionIt];
        const actionSteps = action.steps;

        if (actionSteps.length === 0) {
            return;
        }

        const brush = getBrush(action.brush);
        let imageDataStepIndex = 0;

        // instead of using actionIndex, actionResetIndex ?
        if (brush?.redrawOnly === false) {
            let completeStepIndex = 0;

            // Find first index without following element
            for (; actionSteps[completeStepIndex + 1]; completeStepIndex++);
            // Find the latest saved history for said index
            imageDataStepIndex = completeStepIndex;
            while (imageDataStepIndex > 0 && !imDaHistory[actionIndex][imageDataStepIndex - 1]) {
                imageDataStepIndex--;
            }
        }

        let imDa = imDaHistory[actionIndex][imageDataStepIndex];
        if (!imDa) {
            if (actionIndex <= 0) {
                imDa = generateImDaState();
            }
            // Use a actionResetIndex here
            const latestCompleteImDaSteps = imDaHistory[actionIndex - 1];
            imDa = ((latestCompleteImDaSteps && latestCompleteImDaSteps.length > 0) && (actionIndex <= 0)) ? generateImDaState() : latestCompleteImDaSteps[latestCompleteImDaSteps.length - 1];
        }



        for (let stepIt = completeStepIndex; stepIt < actionSteps.length; stepIt++) {
            const step = actionSteps[stepIt];

            brush?.draw(ctx, [...step]);
        }
    }


    return;
}

const GameCanvas: React.FC<PropType> = ({ id }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    handleSocketEvents(id);

    return <canvas ref={canvasRef} width="600" height="400"></canvas>;
};

function handleSocketEvents(id: number) {
    const socketEventName = (name: string) => `game.${id}.${name}`;
    
    useSocket(socketEventName("draw.live"), (actionIndex: number, stepIndex: number, data: Record<string, unknown>, brushType?: CanvasBrushType) => {
        // TODO rate limit
        const [actions, setActions] = useState<CanvasAction[]>([]);

        let actionReIndex: number | undefined;
        let stepReIndex: number | undefined;
        // A lower action index than current progress requires an action-level redraw from that point onwards
        if (actionIndex < actions.length - 1) {
            actionReIndex = actionIndex;
        }
        // If there is no action at the index, a new action is created. Also takes care of setting brushtype
        if (!actions[actionIndex]) {
            actions[actionIndex] = new CanvasAction(brushType);
        } else if (brushType) {
            actions[actionIndex].brush = brushType; // Probably shouldn't get called ever? Consider removal
        }
        // A lower step index possibly requires a redraw from the before-action state of the canvas
        if (stepIndex < actions[actionIndex].steps.length) {
            stepReIndex = stepIndex;
        }

        actions[actionIndex].steps[stepIndex] = data;
        setActions(actions);

        draw(canvasRef, actionReIndex, stepReIndex);
    });
}

GameCanvas.propTypes = {
    id: PropTypes.number.isRequired
};

export default GameCanvas;