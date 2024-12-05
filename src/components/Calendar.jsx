import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Card } from './ui/card';

const events = [
    { date: '2024-03-20', title: 'Mid-term Examinations Begin', type: 'exam' },
    { date: '2024-03-25', title: 'College Annual Day', type: 'event' },
    { date: '2024-04-01', title: 'New Semester Registration', type: 'academic' },
    { date: '2024-04-15', title: 'Sports Day', type: 'event' },
    { date: '2024-11-28', title: 'Minor evaluation', type: 'academic' },
    
];

export default function Calendar() {
    return (
        <Card className=" rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
                <CalendarIcon size={24} className=" mr-2" />
                <h2 className="text-2xl font-semibold">Academic Calendar</h2>
            </div>
            <div className="space-y-4">
                {events.map((event, index) => (
                    <div key={index} className="flex items-start space-x-4 p-3 rounded-lg ">
                        <div className="flex-shrink-0 w-16 text-center">
                            <div className="text-sm font-semibold flex flex-col">
                                <p>{new Date(event.date).toLocaleDateString('en-US', { month: 'short'})}</p>
                                <p className='text-xl'>{new Date(event.date).toLocaleDateString('en-US', {day: 'numeric' })}</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-medium ">{event.title}</h3>
                            <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1
                ${event.type === 'exam' ? 'bg-red-100 text-red-800' :
                                    event.type === 'event' ? 'bg-green-100 text-green-800' :
                                        'bg-blue-100 text-blue-800'}`}>
                                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}