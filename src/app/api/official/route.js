import {prisma} from '@/lib/db'
export async function GET() {
    try {
        const officialPosts = await prisma.post.findMany({
            where: { postType:"OFFICIAL" },
            include:{
                postedBy:{
                    select:{
                        name:true
                    }
                }
            },
            orderBy: { createdAt:"desc" },
        });
        return new Response(JSON.stringify(officialPosts), { status: 200 });
    } catch (error) {
        console.error('Error fetching official posts:', error);
        return new Response(JSON.stringify({ message: 'Failed to fetch official posts.' }), { status: 500 });
    }
}