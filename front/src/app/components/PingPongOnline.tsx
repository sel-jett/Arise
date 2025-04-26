'use client';
import { useRef, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';

const PingPong: React.FC = () => {
    const { sendMessage, lastMessage, readyState } = useWebSocket('ws://localhost:3000/ws');
    const sendJson = (data: any) => sendMessage(JSON.stringify(data));

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [playerId, setPlayerId] = useState<number | null>(null);
    const [winner, setWinner] = useState<number | null>(null);
    const [gameState, setGameState] = useState<{
        ball: { x: number, y: number },
        paddles: [{ y: number }, { y: number }]
    } | null>(null);
    const pressedKeys = useRef<Set<string>>(new Set());
    const lastSentInput = useRef<{ up: boolean, down: boolean } | null>(null);

    const getInputState = () => {
        const up = playerId === 0 ? pressedKeys.current.has('w') : pressedKeys.current.has('ArrowUp');
        const down = playerId === 0 ? pressedKeys.current.has('s') : pressedKeys.current.has('ArrowDown');
        return { up, down };
    };

    useEffect(() => {
        const sendInputIfChanged = () => {
            if (playerId === null) return;
            const input = getInputState();
            if (!lastSentInput.current || input.up !== lastSentInput.current.up || input.down !== lastSentInput.current.down) {
                sendJson({ type: 'input', ...input });
                lastSentInput.current = input;
            }
        };

        const down = (e: KeyboardEvent) => {
            pressedKeys.current.add(e.key);
            e.preventDefault();
            sendInputIfChanged();
        };
        const up = (e: KeyboardEvent) => {
            pressedKeys.current.delete(e.key);
            e.preventDefault();
            sendInputIfChanged();
        };

        window.addEventListener('keydown', down);
        window.addEventListener('keyup', up);
        return () => {
            window.removeEventListener('keydown', down);
            window.removeEventListener('keyup', up);
        };
    }, [playerId]);

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
            } else if (message.type === 'gameover') {
                setWinner(message.winner);
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
            {winner !== null && (
                <div className="flex flex-col items-center justify-center mt-4 space-y-4">
                    <h2 className="text-3xl font-bold text-white">🎉 Game Over! Player {winner + 1} Wins! 🏆</h2>
                    <button
                        className="px-6 py-2 bg-blue-500 hover:bg-blue-700 text-white text-lg font-semibold rounded-xl transition"
                        onClick={() => window.location.reload()}
                    >
                        Start Another Game
                    </button>
                </div>
            )}

            <div className="flex justify-center items-center min-h-screen bg-black">
                <canvas ref={canvasRef} width={1000} height={600} className="bg-white" />
            </div>
        </>
    );
};

export default PingPong;
