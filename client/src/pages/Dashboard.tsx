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
            console.log("Fetched timesheet status:", res.data);

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
        <div className="p-6 max-w-xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-center">Dashboard</h1>

            <button
                className="text-sm text-red-500"
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
                    <h3 className="text-md font-semibold">Today's Record</h3>
                    <div className="flex justify-between text-sm">
                        <span>Check-In:</span>
                        <span>{status?.checkIn || "Not yet"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Check-Out:</span>
                        <span>{status?.checkOut || "Not yet"}</span>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button
                            onClick={handleCheckIn}
                            disabled={!!status?.checkIn || loading}
                            className="disabled:opacity-50 disabled:text-gray-500"
                        >
                            Check In
                        </Button>
                        <Button
                            onClick={handleCheckOut}
                            disabled={!status?.checkIn || !!status?.checkOut || loading}
                            variant="secondary"
                            className="disabled:opacity-50 disabled:text-gray-500"

                        >
                            Check Out
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default Dashboard