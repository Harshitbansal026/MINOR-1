'use client'
import React, { useState } from 'react'
import { InboxIcon as EnvelopeIcon, ImageIcon as IdentificationIcon, UserIcon, KeyIcon } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const ChangePass = () => {
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
    const handlePasswordChange = (event) => {
        event.preventDefault()
        console.log("Password change requested")
        setIsPasswordDialogOpen(false)
    }
    return (
        <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <KeyIcon className="w-4 h-4 mr-2" />
                    Change Password
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                </DialogHeader>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" required />
                    </div>
                    <Button type="submit" className="w-full">Update Password</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default ChangePass