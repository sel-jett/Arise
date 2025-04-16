'use client';
import { useRef, useEffect, useState } from 'react';

const PingPong: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const leftPaddleY = useRef(250);
    const rightPaddleY = useRef(250);
    const pressedKeys = useRef<Set<string>>(new Set());
    const animationRef = useRef<number>(0);
    const speed = 20;

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => pressedKeys.current.add(e.key);
        const handleKeyUp = (e: KeyboardEvent) => pressedKeys.current.delete(e.key);

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            cancelAnimationFrame(animationRef.current!);
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const render = () => {

            if (pressedKeys.current.has('w')) {
                leftPaddleY.current = Math.max(0, leftPaddleY.current - speed);
            }
            if (pressedKeys.current.has('s')) {
                leftPaddleY.current = Math.min(520, leftPaddleY.current + speed);
            }
            if (pressedKeys.current.has('ArrowUp')) {
                rightPaddleY.current = Math.max(0, rightPaddleY.current - speed);
            }
            if (pressedKeys.current.has('ArrowDown')) {
                rightPaddleY.current = Math.min(520, rightPaddleY.current + speed);
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'black';
            ctx.fillRect(20, leftPaddleY.current, 10, 80);
            ctx.fillRect(970, rightPaddleY.current, 10, 80);

            animationRef.current = requestAnimationFrame(render);
        };

        render();
    }, []);


    return (
        <>
            <div className="flex justify-center items-center h-screen bg-black">
                <canvas ref={canvasRef} width={1000} height={600} className="bg-white" />
            </div>
        </>
    );
};

export default PingPong;
