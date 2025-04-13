'use client';
import { useRef, useEffect , useState} from 'react';


const PingPong: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [leftPaddleY, setLeftPaddleY] = useState(250); 
    const [RightPaddleY, setRightPaddleY] = useState(250);
    const speed = 20;

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            console.log(`Key pressed: ${e.key}`);
            if (e.key === 'ArrowUp')
                setRightPaddleY((curr) => Math.max(curr - speed, 0))     
            if (e.key === 'ArrowDown')
                setRightPaddleY((curr) => Math.min(curr + speed, 520))
            if (e.key === 'w')
                setLeftPaddleY((curr) => Math.max(curr - speed, 0))     
            if (e.key === 's')
                setLeftPaddleY((curr) => Math.min(curr + speed, 520))
            // console.log('right paddle y :', RightPaddleY);

          };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);

    },[]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
      
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      
        ctx.fillStyle = 'black';
        ctx.fillRect(20, leftPaddleY, 10, 80);
      
        ctx.fillRect(970, RightPaddleY, 10, 80);
      }, [leftPaddleY, RightPaddleY]);
      


    return(
        <>
        <div className="flex justify-center items-center h-screen bg-black">
            <canvas ref={canvasRef} width={1000} height={600} className='bg-white'/>
        </div>
        </>
    );
};

export default PingPong;