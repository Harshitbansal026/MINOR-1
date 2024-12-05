import ProfileCard from '@/components/ProfileCard'
import UserPosts from '@/components/UserPosts'
import React from 'react'

const page = () => {
    return (
        <div className='flex flex-col items-center gap-10 mt-5'>
            <ProfileCard/>
            <div>
                <h1 className='text-center font-semibold mb-5'>Your Posts</h1>
                <UserPosts/>
            </div>
        </div>
    )
}

export default page