import { useState } from "react";
import CanvasAction from "../types/canvas/action";
import CanvasBrushType, { getBrush } from "../types/canvas/brush-type";

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

      if (stepIndex === null) break;
      if (!actions[actionIndex].steps[stepIndex]) break;
      if (prevActionIndex != actionIndex) {
          if (!actions[actionIndex].complete) break;
          if (actions[actionIndex].brush === CanvasBrushType.UNKNOWN) break;
      }

      previousIteration = [actionIndex, stepIndex];
  }

  return previousIteration;
}


/*
 TODO THREAD

 1. Create actions with onClick etc. events (game-canvas.tsx)
 2. Sending the actions (socket-client.js)
 3. Implementing the brushes (types/canvas/brush/*.ts)
*/


function draw(ctx: CanvasRenderingContext2D, actions: CanvasAction[]): void {
  const [oldRoot, setRoot] = useState<[number, number]>([0, 0]);
  const newRoot = furthestRootedIndex(actions, oldRoot);
  if (oldRoot.every((e, i) => e === newRoot[i])) return;
  setRoot(newRoot);

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

export default draw;