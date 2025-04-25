'use client';
import { useState } from 'react';
import PingPongLocal from '../components/PingPongLocal';
import PingPongOnline from '../components/PingPongOnline';


const PingPong: React.FC = () => {
    const [mode, setMode] = useState<'local' | 'online' | null>(null);

    if (!mode) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <button className="px-8 py-3 w-{100} text-white bg-blue-600 hover:bg-blue-700 rounded-2xl text-xl font-semibold shadow-lg mb-3" onClick={() => setMode('local')}>Play Local</button>
                <button className="px-8 py-3 w-{100} text-white bg-green-600 hover:bg-green-700 rounded-2xl text-xl font-semibold shadow-lg " onClick={() => setMode('online')}>Play Online</button>
            </div>
        );
    }

    return mode === 'local' ? <PingPongLocal /> : <PingPongOnline />;
};

export default PingPong;
