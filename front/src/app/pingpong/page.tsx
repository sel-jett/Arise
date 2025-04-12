'use client';
import { useRef, useEffect } from 'react';


const PingPong: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
  
      const paddleWidth = 10;
      const paddleHeight = 100;
      const ballRadius = 8;
      const paddleLeftX = 20;
      const paddleRightX = canvas.width - 30;
      const paddleLeftY = canvas.height / 2 - paddleHeight / 2;
      const paddleRightY = canvas.height / 2 - paddleHeight / 2;
      const ballX = canvas.width / 2;
      const ballY = canvas.height / 2;
  

      ctx.clearRect(0, 0, canvas.width, canvas.height);
  

      ctx.fillStyle = 'black';
      ctx.fillRect(paddleLeftX, paddleLeftY, paddleWidth, paddleHeight);
      ctx.fillRect(paddleRightX, paddleRightY, paddleWidth, paddleHeight); 
  
      ctx.beginPath();
      ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'black';
      ctx.fill();
      ctx.closePath();
  
    }, []);

    return(
        <>
        <div className="flex justify-center items-center h-screen bg-black">
            <canvas ref={canvasRef} width={1000} height={600} className='bg-white'/> 
        </div>
        </>
    );
};

export default PingPong;