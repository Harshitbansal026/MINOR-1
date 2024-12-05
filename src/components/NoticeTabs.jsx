'use client'
import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import NoticeList from './Official';
import { Label } from './ui/label';
import { Input } from './ui/input';
import Official from './Official';
import Unofficial from './Unofficial';
import Calendar from './Calendar';
import { useEdgeStore } from '@/lib/edgestore';

const NoticeTabs = () => {
    const [activeTab, setActiveTab] = useState("official");
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState('')
    const [role, setRole] = useState('')
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [department, setDepartment] = useState('');
    const [imageUrl, SetimageUrl] = useState();
    const [file, setFile] = useState();
    const [imgprogress,setImgProgress] = useState(0)
    const { edgestore } = useEdgeStore();

    useEffect(() => {
        const email = localStorage.getItem('user')
        if (email) {
            setUser(email)
        }
    }, [])
    useEffect(() => {
        if (user) {
            fetch('/api/getUserRole', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user }),
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error('Failed to fetch role')
                    }
                    return res.json()
                })
                .then((data) => {
                    if (data.role) {
                        setRole(data.role)
                    }
                })
                .catch((err) => {
                    console.error('Error:', err)
                })
        }
    }, [user])
    const handleAddPost = async () => {
        if (!title || !content || !department) {
            alert('All fields are required');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, department, imageUrl, userEmail: user }),
            });

            if (response.ok) {
                const data = await response.json();
                alert('Post added successfully!');
                setTitle('');
                setContent('');
                SetimageUrl('')
                setDepartment('');
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error('Failed to add post:', error);
            alert('Failed to add post.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Tabs defaultValue="official" className="w-full" onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-6">
                <TabsList>
                    <TabsTrigger value="official">Official Notices</TabsTrigger>
                    <TabsTrigger value="unofficial">Unofficial Notices</TabsTrigger>
                    <TabsTrigger value="calendar">Calendar</TabsTrigger>
                </TabsList>

                {activeTab !== "calendar" && user && (
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="">Post</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle className="text-lg font-semibold">Post a New Notice</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6 mt-4">
                                {/* Title Input */}
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-sm font-medium">
                                        Title
                                    </Label>
                                    <Input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        id="title"
                                        placeholder="Enter the notice title"
                                        className="w-full"
                                    />
                                </div>

                                {/* Content Input */}
                                <div className="space-y-2">
                                    <Label htmlFor="content" className="text-sm font-medium">
                                        Content
                                    </Label>
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        id="content"
                                        placeholder="Enter the notice content"
                                        className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                                        rows="4"
                                    />
                                </div>

                                {/* Department Input */}
                                <div className="space-y-2">
                                    <Label htmlFor="department" className="text-sm font-medium">
                                        Department
                                    </Label>
                                    <Input
                                        value={department}
                                        onChange={(e) => setDepartment(e.target.value)}
                                        id="department"
                                        placeholder="Enter the department name"
                                        className="w-full"
                                    />
                                </div>

                                {/* Image URL Input */}
                                <div className="space-y-2">
                                    <Label htmlFor="imageUrl" className="text-sm font-medium">
                                        Image URL
                                    </Label>
                                    <input
                                        type="file"
                                        onChange={(e) => {
                                            setFile(e.target.files?.[0]);
                                        }}
                                    />
                                    <Button
                                        onClick={async () => {
                                            if (file) {
                                                const res = await edgestore.publicFiles.upload({
                                                    file,
                                                    onProgressChange: (progress) => {
                                                        setImgProgress(progress)
                                                    },
                                                });
                                                SetimageUrl(res.url);
                                            }
                                        }}
                                    >
                                        Upload
                                    </Button>
                                    {imgprogress!==100 && imgprogress!==0 && <p className='text-red-500'>Image uploading {imgprogress}%</p>}
                                    {imgprogress==100 && <p className='text-red-500'>Image uploaded successfully</p>}
                                </div>
                            </div>
                            <DialogFooter className="mt-6">
                                <Button
                                    disabled={loading}
                                    onClick={handleAddPost}
                                    className="w-full md:w-auto"
                                >
                                    Save Changes
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                )}
            </div>
            <TabsContent value="official">
                <Official />
            </TabsContent>

            <TabsContent value="unofficial">
                <Unofficial />
            </TabsContent>

            <TabsContent value="calendar">
                <Calendar />
            </TabsContent>
        </Tabs>
    )
}

export default NoticeTabs