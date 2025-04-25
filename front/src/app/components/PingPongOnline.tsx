'use client';
import { useRef, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';

const PingPong: React.FC = () => {

    const { sendMessage, lastMessage, readyState } = useWebSocket('ws://localhost:3000/ws');
    const sendJson = (data: any) => sendMessage(JSON.stringify(data));

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [playerId, setPlayerId] = useState<number | null>(null);
    const [gameState, setGameState] = useState<{
        ball: { x: number, y: number },
        paddles: [{ y: number }, { y: number }]
    } | null>(null);
    const pressedKeys = useRef<Set<string>>(new Set());
    const lastYSent = useRef<number | null>(null);

    const speed = 10;



    useEffect(() => {
        const down = (e: KeyboardEvent) => pressedKeys.current.add(e.key);
        const up = (e: KeyboardEvent) => pressedKeys.current.delete(e.key);

        window.addEventListener('keydown', down);
        window.addEventListener('keyup', up);
        return () => {
            window.removeEventListener('keydown', down);
            window.removeEventListener('keyup', up);
        };
    }, []);

    useEffect(() => {
        if (playerId == null) return;

        const loop = () => {
            let moved = false;
            let y = gameState?.paddles?.[playerId]?.y ?? 250;

            if ((playerId === 0 && pressedKeys.current.has('w')) ||
                (playerId === 1 && pressedKeys.current.has('ArrowUp'))) {
                y = Math.max(0, y - speed);
                moved = true;
            }

            if ((playerId === 0 && pressedKeys.current.has('s')) ||
                (playerId === 1 && pressedKeys.current.has('ArrowDown'))) {
                y = Math.min(500, y + speed);
                moved = true;
            }

            if (moved && playerId == null && lastYSent.current !== y) {

                sendJson({ type: 'paddle', y });
                lastYSent.current = y;

            }

            requestAnimationFrame(loop);
        };

        loop();
    }, [playerId, gameState]);

    useEffect(() => {
        if (!lastMessage) return;
        try {
            const message = JSON.parse(lastMessage.data);

            if (message.type === 'player') {
                setPlayerId(message.index);
            } else if (message.type === 'state') {
                setGameState({
                    ball: message.ball,
                    paddles: message.paddles,
                });
            }
        } catch (err) {
            console.error('Invalid WS message:', lastMessage.data);
        }
    }, [lastMessage]);

    useEffect(() => {
        if (!gameState) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { ball, paddles } = gameState;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';


        ctx.fillRect(20, paddles[0].y, 10, 100);
        ctx.fillRect(970, paddles[1].y, 10, 100);


        ctx.beginPath();
        ctx.arc(ball.x, ball.y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }, [gameState]);

    return (
        <>
            <div>
                <p>Status: {readyState === 1 ? '🟢 Connected' : '🔴 Connecting...'}</p>
                <p>Last message: {lastMessage?.data}</p>
            </div>
            {playerId === null ? (
                <p>Waiting for player slot...</p>
            ) : (
                <p>You are Player {playerId + 1} ({playerId === 0 ? 'W/S' : '↑/↓'})</p>
            )}

            <div className="flex justify-center items-center min-h-screen bg-black">
                <canvas ref={canvasRef} width={1000} height={600} className="bg-white" />
            </div>


        </>
    );
};

export default PingPong;
