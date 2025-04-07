import { useEffect, useState } from "react";
import axiosInstance from "@/api/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";

interface User {
    id: number;
    username: string;
}

interface TimeRecord {
    date: string;
    checkIn?: string;
    checkOut?: string;
}

export default function AdminPanel() {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [editing, setEditing] = useState<TimeRecord[]>([]);
    const { logout } = useAuth();

    useEffect(() => {
        axiosInstance.get("/admin/users").then((res) => setUsers(res.data));
    }, []);

    useEffect(() => {
        if (!selectedUserId) return;
        const fetchUserTimesheet = async () => {
            const res = await axiosInstance.get("/admin/timesheets");
            const userRecords = res.data.find((entry: any) => entry.userId === selectedUserId)?.records || [];
            setEditing(userRecords);
        };
        fetchUserTimesheet();
    }, [selectedUserId]);


    const updateField = (index: number, field: "checkIn" | "checkOut", value: string) => {
        setEditing((prev) => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                [field]: value
            };
            return updated;
        });
    };

    const handleSave = async (record: TimeRecord) => {
        if (!selectedUserId) return;
        const payload: Partial<TimeRecord> = {
            checkIn: record.checkIn || "",
            checkOut: record.checkOut || "",
        };
        await axiosInstance.patch(`/admin/timesheets/${selectedUserId}/${record.date}`, payload);
    };

    return (
        <div className="flex items-center min-h-screen min-w-md bg-slate-50">
            <div className="w-full max-w-xl p-6 space-y-6 mx-auto">
                <h1 className="text-2xl font-bold text-center">Admin Panel</h1>
                <button
                    className="text-sm text-red-500"
                    onClick={() => {
                        logout();
                    }}
                >
                    Logout
                </button>

                <Card>
                    <CardContent className="p-4 space-y-4 flex flex-col items-center">
                        <h2 className="text-lg font-semibold">Select a User:</h2>
                        <Select onValueChange={(val) => setSelectedUserId(Number(val))}>
                            <SelectTrigger className="w-3xs text-white">
                                <SelectValue placeholder={<span className="text-white">Select a user</span>} />
                            </SelectTrigger>
                            <SelectContent >
                                {users.map((user) => (
                                    <SelectItem key={user.id} value={String(user.id)}>
                                        {user.username}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>

                {selectedUserId && (
                    <Card>
                        <CardContent className="p-4 space-y-4">
                            <h2 className="text-lg font-semibold">Timesheet Records</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="py-2 px-3">Date</th>
                                            <th className="py-2 px-3">Check-In</th>
                                            <th className="py-2 px-3">Check-Out</th>
                                            <th className="py-2 px-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {editing.map((record, index) => (
                                            <tr key={record.date} className="border-b">
                                                <td className="py-2 px-3 whitespace-nowrap">{record.date}</td>
                                                <td className="py-2 px-3">
                                                    <Input
                                                        value={record.checkIn || ""}
                                                        onChange={(e) => updateField(index, "checkIn", e.target.value)}
                                                        className="w-28 border rounded px-2 py-1 text-sm"
                                                    />
                                                </td>
                                                <td className="py-2 px-3">
                                                    <Input
                                                        value={record.checkOut || ""}
                                                        onChange={(e) => updateField(index, "checkOut", e.target.value)}
                                                        className="w-28 border rounded px-2 py-1 text-sm"
                                                    />
                                                </td>
                                                <td className="py-2 px-3">
                                                    <Button onClick={() => handleSave(record)} size="sm">
                                                        Save
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
