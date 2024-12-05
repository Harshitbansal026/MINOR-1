import {prisma} from '@/lib/db'
export async function GET() {
    try {
        const allPosts = await prisma.post.findMany({
            orderBy: { createdAt:"desc" },
            select:{
                id:true
            }
        });
        return new Response(JSON.stringify(allPosts), { status: 200 });
    } catch (error) {
        console.error('Error fetching official posts:', error);
        return new Response(JSON.stringify({ message: 'Failed to fetch official posts.' }), { status: 500 });
    }
}