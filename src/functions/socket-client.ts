import { RefObject, useState } from "react";
import useSocket from "../hooks/use-socket";
import CanvasAction, { StepData } from "../types/canvas/action";
import CanvasBrushType from "../types/canvas/brush-type";
import draw from "./canvas";

type ActionBrushData = {
  brushType: CanvasBrushType
};

type ActionStepData = {
  stepIndex: number,
  stepData: StepData
};

function handleClientSocketEvents(canvasRef: RefObject<HTMLCanvasElement>, id: number): void {
  function socketEventName(name: string) {
    return `game.${id}.${name}`;
  }

  useSocket(socketEventName("draw.live"), drawLive);
  useSocket(socketEventName("draw"), drawComplete);
}

function drawLive(canvasRef: RefObject<HTMLCanvasElement>, actionIndex: number, data: ActionBrushData | ActionStepData) {
  // TODO rate limit
  const [actions, setActions] = useState<CanvasAction[]>([]);

  if (actions[actionIndex].complete) return;

  // If there is no action at the index, a new action is created. Also takes care of setting brushtype
  if (!actions[actionIndex]) {
    if ("brushType" in data) {
      actions[actionIndex] = new CanvasAction(data.brushType);
      return;
    } else {
      actions[actionIndex] = new CanvasAction();
    }
  }
  if ("stepData" in data) {
    actions[actionIndex].steps[data.stepIndex] = data.stepData;
  } else {
    actions[actionIndex].brush = data.brushType;
  }

  setActions(actions);

  const ctx = canvasRef.current?.getContext('2d');
  if (ctx) {
    draw(ctx, actions);
  }
}

function drawComplete(canvasRef: RefObject<HTMLCanvasElement>, actionIndex: number, action: CanvasAction) {
  const [actions, setActions] = useState<CanvasAction[]>([]);

  if (actions[actionIndex].complete) return;

  actions[actionIndex] = action;
  actions[actionIndex].complete = true;

  setActions(actions);

  const ctx = canvasRef.current?.getContext('2d');
  if (ctx) {
    draw(ctx, actions);
  }
}

export default handleClientSocketEvents;