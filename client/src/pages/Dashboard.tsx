import Clock from "@/components/Clock";
import { useEffect, useState } from "react";
import axiosInstance from "@/api/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

type TimeRecord = {
    date: string;
    checkIn?: string;
    checkOut?: string;
};

function Dashboard() {
    const [status, setStatus] = useState<TimeRecord | null>(null);
    const [loading, setLoading] = useState(false);
    const { logout } = useAuth();

    const fetchStatus = async () => {
        try {
            const res = await axiosInstance.get("/timesheet/me");
            setStatus(res.data);
        } catch (err) {
            console.error("Failed to fetch timesheet:", err);
            setStatus(null);
        }
    };

    const handleCheckIn = async () => {
        setLoading(true);
        try {
            await axiosInstance.post("/timesheet/checkin");
            await fetchStatus();
        } catch (err) {
            console.error("Check-in failed:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckOut = async () => {
        setLoading(true);
        try {
            await axiosInstance.post("/timesheet/checkout");
            await fetchStatus();
        } catch (err) {
            console.error("Check-out failed:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    return (
        <div className="flex items-center min-h-screen min-w-md bg-slate-50">
            <div className="w-full max-w-md p-6 space-y-6 mx-auto">
                <h1 className="text-2xl font-bold text-center">Dashboard</h1>

                <button
                    className=" text-red-500"
                    onClick={() => {
                        logout();
                    }}
                >
                    Logout
                </button>
                <Card>
                    <CardContent className="p-6 text-center">
                        <h2 className="text-lg font-semibold mb-2">Current Time</h2>
                        <Clock />
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 space-y-4">
                        <h3 className="text-xl font-semibold">Today's Record</h3>
                        <div className="flex justify-between text-sm">
                            <span>Check-In:</span>
                            <span>{status?.checkIn || "Not yet"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Check-Out:</span>
                            <span>{status?.checkOut || "Not yet"}</span>
                        </div>

                        <div className="flex justify-center gap-4 pt-4">
                            <Button
                                onClick={handleCheckIn}
                                disabled={!!status?.checkIn || loading}
                            >
                                Check In
                            </Button>
                            <Button
                                onClick={handleCheckOut}
                                disabled={!status?.checkIn || !!status?.checkOut || loading}

                            >
                                Check Out
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default Dashboard