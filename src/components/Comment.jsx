'use client'
import React, { useEffect, useState } from 'react'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { MessageCircle } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"

const Comment = () => {
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Fetch posts once when component mounts
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('/api/getAllPosts');
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }
                const data = await response.json();
                setPosts(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchPosts();
    }, []);

    // Fetch comments for a specific post
    const fetchComments = async (postId) => {
        if (!postId) return;

        setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    // Handle comment button click
    const handleCommentButtonClick = (postId) => {
        if (selectedPostId === postId) {
            // If the same post is clicked again, close the sheet
            setIsOpen(false);
            setComments([]);
            setSelectedPostId(null);
        } else {
            setSelectedPostId(postId);
            setIsOpen(true); // Open the sheet
            fetchComments(postId); // Fetch comments for the selected post
        }
    };

    // Handle sheet open change
    const handleSheetOpenChange = (open) => {
        setIsOpen(open);
        if (!open) {
            setComments([]);
            setSelectedPostId(null);
        }
    };

    if (loading && posts.length === 0) {
        return <div className="text-center p-4">Loading posts...</div>;
    }

    if (error && posts.length === 0) {
        return <div className="text-red-500 p-4">Error: {error}</div>;
    }

    return (
        <div className="p-4">
            {posts.map((post) => (
                <Card key={post.id} className="w-full mb-4">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>Post ID: {post.id}</div>
                            <Sheet
                                open={isOpen && selectedPostId === post.id}
                                onOpenChange={handleSheetOpenChange}
                            >
                                <SheetTrigger asChild>
                                    <button
                                        onClick={() => handleCommentButtonClick(post.id)}
                                        className="flex items-center gap-2 border-0 bg-transparent p-2 rounded-md hover:bg-accent/50 transition-colors"
                                    >
                                        <MessageCircle className="h-5 w-5 text-muted-foreground" />
                                    </button>
                                </SheetTrigger>
                                {/* Comments section */}
                                <SheetContent>
                                    <SheetHeader>
                                        <SheetTitle>Comments for Post {post.id}</SheetTitle>
                                        <div className="text-sm text-muted-foreground">
                                            {loading && <div>Loading comments...</div>}
                                            {error && <div className="text-red-500">{error}</div>}
                                            {!loading && comments.length === 0 && (
                                                <div>No comments yet.</div>
                                            )}
                                        </div>
                                    </SheetHeader>
                                    <div className="mt-6 space-y-4">
                                        {comments.map((comment) => (
                                            <Card
                                                key={comment.id}
                                                className="w-full hover:bg-accent/50 transition-colors"
                                            >
                                                <CardContent className="p-4">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <h4 className="text-sm font-semibold text-primary">
                                                                {comment.username || "Anonymous"}
                                                            </h4>
                                                            <span className="text-xs text-muted-foreground">
                                                                {new Date(comment.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <div className="text-sm text-foreground">
                                                            {comment.content}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default Comment;
