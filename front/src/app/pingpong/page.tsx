'use client';
import { useRef, useEffect, useState } from 'react';

const PingPong: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const leftPaddleY = useRef(250);
    const rightPaddleY = useRef(250);
    const pressedKeys = useRef<Set<string>>(new Set());

    const animationRef = useRef<number>(0);
    const ballX = useRef<number>(500);
    const ballY = useRef<number>(300);
    const ballDX = useRef<number>(4);
    const ballDY = useRef<number>(3);

    const [score1, setScore1] = useState(0);
    const [score2, setScore2] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);


    if (isGameOver) {
        ballDX.current = 0;
        ballDY.current = 0;
    }
    else {
        ballDX.current = Math.random() > 0.5 ? 4 : -4;
        ballDY.current = Math.random() > 0.5 ? 4 : -4;
    }



    const leftPaddleX = 20;
    const rightPaddleX = 970;
    const ballRadius = 10;
    const paddleHeight = 100;
    const paddleWidth = 10;


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
        if (isGameOver) return;
        console.log("still running ");
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resetBall = () => {
            ballX.current = canvas.width / 2;
            ballY.current = canvas.height / 2;
            ballDX.current = Math.random() > 0.5 ? 4 : -4;
            ballDY.current = Math.random() > 0.5 ? 4 : -4;
        };


        const render = () => {
            if (ballX.current <= 0) {
                setScore2(s => {
                    const newScore = s + 1;
                    if (newScore === 5) setIsGameOver(true);
                    return newScore;
                });
                resetBall();
            }

            if (ballX.current >= canvas.width) {
                setScore1(s => {
                    const newScore = s + 1;
                    if (newScore === 5) setIsGameOver(true);
                    return newScore;
                });
                resetBall();
            }


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
            ctx.fillRect(leftPaddleX, leftPaddleY.current, paddleWidth, paddleHeight);
            ctx.fillRect(rightPaddleX, rightPaddleY.current, paddleWidth, paddleHeight);
            ctx.beginPath();
            ctx.arc(ballX.current, ballY.current, ballRadius, 0, Math.PI * 2);
            ctx.fillStyle = 'black';
            ctx.fill();
            ctx.closePath();
            if (ballY.current <= 0 || ballY.current + ballRadius >= canvas.height)
                ballDY.current *= -1;
            if (
                ballX.current <= leftPaddleX + paddleWidth &&
                ballY.current + ballRadius >= leftPaddleY.current &&
                ballY.current <= leftPaddleY.current + paddleHeight
            ) {
                ballDX.current *= -1;
            }

            if (
                ballX.current + ballRadius >= rightPaddleX &&
                ballY.current + ballRadius >= rightPaddleY.current &&
                ballY.current <= rightPaddleY.current + paddleHeight
            ) {
                ballDX.current *= -1;
            }




            ballX.current += ballDX.current;
            ballY.current += ballDY.current;



            animationRef.current = requestAnimationFrame(render);
        };


        render();
    }, []);


    return (
        <>
            <div className="flex flex-col justify-center items-center h-screen bg-black">
                {isGameOver ? (
                    <div className="text-4xl font-bold mb-4">
                        Game Over
                    </div>
                ) : (
                    <div className="text-4xl font-bold mb-4">
                        {score1} : {score2}
                    </div>
                )}
                <canvas ref={canvasRef} width={1000} height={600} className="bg-white" />

            </div>
        </>
    );
};

export default PingPong;
