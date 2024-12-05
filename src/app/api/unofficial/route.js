import {prisma} from '@/lib/db'
export async function GET() {
    try {
        const unofficialPosts = await prisma.post.findMany({
            where: { postType:"UNOFFICIAL" },
            include:{
                postedBy:{
                    select:{
                        name:true
                    }
                }
            },
            orderBy: { createdAt: "desc" },
        });
        return new Response(JSON.stringify(unofficialPosts), { status: 200 });
    } catch (error) {
        console.error('Error fetching unofficial posts:', error);
        return new Response(JSON.stringify({ message: 'Failed to fetch unofficial posts.' }), { status: 500 });
    }
}
