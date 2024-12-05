import { prisma } from "@/lib/db";

export async function POST(req) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return new Response(JSON.stringify({ error: "Email is required" }), {
                status: 400,
            });
        }

        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true },
        });

        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 404,
            });
        }

        // Fetch all posts by the user
        const posts = await prisma.post.findMany({
            where: { postedById: user.id },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                title: true,
                content: true,
                department: true,
                imageUrl: true,
                createdAt: true,
                updatedAt: true,
                postType: true,
                upvotes:true,
                comment:true,
                postedBy: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return new Response(JSON.stringify(posts), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching user posts:", error);
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500 }
        );
    }
}
