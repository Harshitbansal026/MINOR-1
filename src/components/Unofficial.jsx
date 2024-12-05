'use client'
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Image from 'next/image'
import { ArrowBigUp, Building, MessageCircle, Send } from 'lucide-react'
import { format } from 'date-fns'
import { Separator } from './ui/separator'
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from './ui/input'
import { Button } from './ui/button'

const Unofficial = ({
}) => {
    const [posts, setPosts] = useState([]);
    const [id, setId] = useState('')
    const [user, setUser] = useState('')
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    useEffect(() => {
        const email = localStorage.getItem('user')
        if (email) {
            setUser(email)
        }
    }, [])
    useEffect(() => {
        if (user) {
            fetch('/api/getUser', {
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
                    if (data.id) {
                        setId(data.id)
                    }
                })
                .catch((err) => {
                    console.error('Error:', err)
                })
        }
    }, [user])
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('/api/unofficial');
                if (!response.ok) throw new Error('Failed to fetch official posts');
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error('Error fetching official posts:', error);
            }
        };

        fetchPosts();
    }, []);
    function formatDate(dateString) {
        const date = new Date(dateString);
        const formattedDate = format(date, 'dd MMM yyyy');
        const formattedTime = format(date, 'h:mm a');
        return `${formattedDate} ${formattedTime}`;
    }
    const handleUpvote = async (postId) => {
        try {
            const response = await fetch('/api/upvote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: id, postId }),
            });

            if (!response.ok) {
                const error = await response.json();
                console.error("Error upvoting post:", error.error);
                return;
            }
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId ? { ...post, upvotes: post.upvotes + 1 } : post
                )
            );
        } catch (error) {
            console.error('Error upvoting the post:', error);
        }
    };
    const fetchComments = async (postId) => {
        if (!postId) return;
        try {
            const response = await fetch("/api/getComment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ postId: postId }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch comments");
            }

            const data = await response.json();
            setComments(data);
        } catch (err) {
            setError(err.message);
        }
    };
    const handleComment = async (postId) => {
        setComments([])
        console.log(postId);
        await fetchComments(postId)
    }
    const handleCommentSubmit = async (postId) => {
        try {
            const res = await fetch("/api/comment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ postId, userId: id, comment }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to submit comment");
            }
            setComment("");
            await fetchComments(postId);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className='space-y-3'>
            {posts.map((i, k) => (
                <Card key={k} className="w-full max-w-md mx-auto">
                    <CardHeader className="flex flex-row items-center gap-4 p-4">
                        <Avatar className="w-10 h-10">
                            <AvatarImage src={i.postedBy.name.avatar} alt={i.postedBy.name} />
                            <AvatarFallback>{i.postedBy.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <p className="text-sm font-semibold">{i.postedBy.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {formatDate(i.createdAt)}
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-4">
                        {i.imageUrl && (
                            <div className="relative w-full h-64 overflow-hidden rounded-md">
                                <Image
                                    src={i.imageUrl}
                                    alt="Notice image"
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                        )}
                        <div className='space-y-1'>
                            <p className="font-semibold">{i.title}</p>
                            <p className="font-medium text-sm">{i.content}</p>
                            <p className="text-muted-foreground text-xs flex items-center gap-1"><Building className='h-3 w-3' />{i.department}</p>
                        </div>
                        <Separator />
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                                <ArrowBigUp onClick={() => handleUpvote(i.id)} className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-primary" />
                                <span className="text-sm font-medium">{i.upvotes || 0}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Sheet>
                                    <SheetTrigger>
                                        <MessageCircle
                                            onClick={() => handleComment(i.id)}
                                            className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-primary"
                                        />
                                    </SheetTrigger>
                                    <SheetContent className="flex flex-col">
                                        <SheetHeader>
                                            <SheetTitle>All Comments</SheetTitle>
                                            {comments.map((i, k) => (
                                                <Card key={k} className="w-full max-w-md">
                                                    <CardContent className="p-4">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center justify-between">
                                                                <h4 className="text-sm font-semibold text-primary">{i.name}</h4>
                                                                <span className="text-xs text-muted-foreground">17 Nov</span>
                                                            </div>
                                                            <p className="text-sm text-foreground">{i.comment}</p>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </SheetHeader>
                                        <SheetFooter className="mt-auto">
                                            <Input
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)} placeholder="Write your comment" className="" />
                                            <Button onClick={() => handleCommentSubmit(i.id)} variant="outline" size="sm" className="">
                                                <Send className='h-4 w-4' />
                                            </Button>
                                        </SheetFooter>
                                    </SheetContent>
                                </Sheet>
                                <span className="text-sm font-medium">
                                    {i.comment ? i.comment : 0}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
export default Unofficial