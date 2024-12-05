"use client"

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { InboxIcon as EnvelopeIcon, ImageIcon as IdentificationIcon } from "lucide-react";

const ProfileCard = () => {
    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        role: "",
        enrNumber: "",
        createdAt: "",
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const email = localStorage.getItem("user");
                if (!email) {
                    console.error("User email not found in localStorage");
                    return;
                }
                const response = await fetch("/api/getUser", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                });
                if (response.ok) {
                    const data = await response.json();
                    setProfileData({
                        name: data.name,
                        email: data.email,
                        role: data.role,
                        enrNumber: data.enr,
                        createdAt: new Date(data.createdAt).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        }),
                    });
                } else {
                    console.error("Failed to fetch user details");
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <Card className="w-full max-w-4xl mx-auto">
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row items-start justify-between space-y-4 sm:space-y-0 sm:space-x-6">
                        <div className="flex-grow space-y-4">
                            <div className="flex items-center space-x-4">
                                <h2 className="text-2xl font-bold">{profileData.name}</h2>
                                <Badge
                                    variant={
                                        profileData.role === "teacher" ? "default" : "secondary"
                                    }
                                    className="capitalize"
                                >
                                    {profileData.role}
                                </Badge>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <EnvelopeIcon className="w-5 h-5 text-gray-500" />
                                    <span className="text-sm">{profileData.email}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-mono">
                                        {profileData.enrNumber && profileData.enrNumber}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div>
                            {/* <ChangePass /> */}
                            <p className="md:mt-10 mt-2 text-xs">
                                Joined on: {profileData.createdAt}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfileCard;