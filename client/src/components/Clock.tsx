import { useEffect, useRef, useState } from "react";
import axiosInstance from "../api/api";


const Clock = () => {
    const [displayTime, setDisplayTime] = useState<string>("--:--:--");
    const [isLoading, setIsLoading] = useState(true);
    const initialBerlinTime = useRef<Date | null>(null);
    const fetchTimestamp = useRef<number>(0);

    const fetchTime = async (retries = 3) => {
        try {
            setIsLoading(true);
            const response = await axiosInstance.get('/time/current');
            const serverTime = new Date(response.data.dateTime);
            initialBerlinTime.current = serverTime;
            fetchTimestamp.current = Date.now();
            setIsLoading(false);
        } catch (err) {
            console.error('Error fetching time from server', err);
            if (retries > 0) {
                setTimeout(() => fetchTime(retries - 1), 1000);
            } else {
                // Fallback to local time
                const localTime = new Date();
                initialBerlinTime.current = localTime;
                fetchTimestamp.current = Date.now();
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchTime();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!initialBerlinTime.current) return;

            const elapsed = Date.now() - fetchTimestamp.current;
            const berlinNow = new Date(initialBerlinTime.current.getTime() + elapsed);

            setDisplayTime(
                berlinNow.toLocaleTimeString("de-DE", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                })
            );
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    if (isLoading) {
        return <div className="clock">Loading...</div>;
    }

    return (
        <div className="clock">
            <div className="time">{displayTime}</div>
        </div>
    );
};

export default Clock;
