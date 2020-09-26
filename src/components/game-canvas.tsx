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

function isSmallerIndexThan(startIndex: [number, number], endIndex: [number, number]) {
    const [actionStartIndex, stepStartIndex] = startIndex;
    const [actionEndIndex, stepEndIndex] = endIndex;

    return actionStartIndex < actionEndIndex ||
        actionStartIndex == actionEndIndex && stepStartIndex <= stepEndIndex;
}

function* actionStepIndexIt(actions: CanvasAction[], startIndex: [number, number] = [0, 0], maxIndex?: [number, number]): Generator<[number, number | null]> {
    const [actionStartIt, stepStartIt] = startIndex;
    const [actionMaxIt, stepMaxIt] = maxIndex || [undefined, undefined];

    const reverse = maxIndex && isSmallerIndexThan(maxIndex, startIndex);

    for (let actionIt = actionStartIt;
    reverse ? actionIt >= 0 : actionIt < actions.length;
    reverse ? actionIt-- : actionIt++) {
        if (typeof actionMaxIt === 'number' && (reverse ? actionIt < actionMaxIt : actionIt > actionMaxIt)) return;

        const action = actions[actionIt];
        const steps = action?.steps;
        if (!steps || steps.length == 0) {
            yield [actionIt, null];
        } else {
            for (let stepIt = (actionIt == actionStartIt) ? stepStartIt : (reverse ? steps.length - 1 : 0);
            reverse ? stepIt >= 0 : stepIt < steps.length;
            reverse ? stepIt-- : stepIt++) {
                if (actionMaxIt === actionIt && typeof stepMaxIt === 'number' && (reverse ? stepIt < stepMaxIt : stepIt > stepMaxIt)) return;

                yield [actionIt, stepIt];
            }
        }
    }
}

function furthestRootedIndex(actions: CanvasAction[],
    indexRoot: [number, number] = [0, 0]) {
    const chainIterator = actionStepIndexIt(actions, indexRoot);

    let previousIteration: [number, number] = indexRoot;
    for (let indexItR = chainIterator.next(); !indexItR.done; indexItR = chainIterator.next()) {
        const [actionIndex, stepIndex] = indexItR.value;
        const [prevActionIndex, prevStepIndex] = previousIteration;

        if (stepIndex === null || !actions[actionIndex].steps[stepIndex] ||
            (prevActionIndex != actionIndex && !actions[actionIndex].complete)) {
            break;
        }

        previousIteration = [actionIndex, stepIndex];
    }

    return previousIteration;
}

// Decision to make: ImageDataHistory represent BEFORE or AFTER drawing? Suggestion: Code drawing algorithm in draw(...), see what is assumed. Use that
// UPDATE: Currently BEFORE drawing. This means that [0, 0] is an empty canvas.
// UPDATE #2: ImageData will probably only save finished actions. In that case, remove this method.
function pastImageDataIndex(actions: CanvasAction[],
    history: ImageData[][], presentIndex: [number, number], onlyFullActions = false): [number, number] | null { // onlyFullActions not required? => Action.complete
    const imDaIterator = actionStepIndexIt(actions, presentIndex, [0, 0]);

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

function sameArray(array1: any[], array2: any[]) {
    return array1.length == array2.length && array1.every((e, index) => e === array2[index]);
}

// Might not need to store steps, only actions.
function initImDaHistory(ctx: CanvasRenderingContext2D, history: ImageData[][]): [number, number] {
    history[0][0] = generateImDaState(ctx);
    return [0, 0];
}

function draw(ctx: CanvasRenderingContext2D, actions: CanvasAction[]): void {
    // The root represents the last index which can be drawn without potentially skipping future incoming steps before the last incoming ones.
    // This mechanism effectively synchronizes drawing order.
    const [oldRoot, setRoot] = useState<[number, number]>([0, 0]);
    const newRoot = furthestRootedIndex(actions, oldRoot);
    if (sameArray(oldRoot, newRoot)) return;
    setRoot(newRoot);

    /*
    // TODO: ImageData needs to be managed by calling method when completing an action

    const [imDaHistory, setImDaHistory] = useState<ImageData[][]>([]);  // Might not work. Needs the pure data to save n restore // UPDATE: PROBABLY WORKS
    const latestImDaIndex = pastImageDataIndex(actions, imDaHistory, newRoot) || initImDaHistory(ctx, imDaHistory);
    */

    const oldRootIt = actionStepIndexIt(actions, oldRoot);
    oldRootIt.next(); // Skip actual oldRoot, we only want to draw new stuff
    const shiftedOldRoot: [number, number] = oldRootIt.next().value;

    for (let actionIndex = shiftedOldRoot[0]; actionIndex <= newRoot[0]; actionIndex++) {
        const action = actions[actionIndex];
        const steps = action.steps;

        const startStep = actionIndex == shiftedOldRoot[0] ? shiftedOldRoot[1] : 0;
        const endStep = actionIndex == newRoot[0] ? newRoot[1] + 1 : steps.length;

        const brush = getBrush(action.brush);
        if (!brush) {
            console.warn('Brush for action ' + actionIndex + ' unknown! Skipping...');
            continue;
        }

        brush.draw(ctx, steps.slice(startStep, endStep));
    }
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