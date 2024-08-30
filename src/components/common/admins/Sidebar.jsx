import { BarChart2, CalendarDays, ShoppingBasket, Menu, PersonStanding, Receipt, School, Shapes, Timer, LucideReceiptText, ChartBarStacked, MapPin, Dumbbell, LucideClipboardType, LucideShieldAlert, Megaphone  } from 'lucide-react'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from "react-router-dom";

const SIDEBAR_ITEMS  = [
    {name: "Dashboard", icon:BarChart2, color:'#6366f1', href:'/admin/dashboard'},
    {name: "Students", icon:PersonStanding, color:'#6366f1', href:'view-student'},
    {name: "Term", icon:School, color:'#6366f1', href:'view-term'},
    {name: "Classes", icon:Shapes, color:'#6366f1', href:'view-class'},
    {name: "Events", icon:CalendarDays, color:'#6366f1', href:'view-event'},
    {name: "Invoice", icon:Receipt, color:'#6366f1', href:'view-invoice'},
    {name: "Duration", icon:Timer, color:'#6366f1', href:'view-duration'},
    {name: "Item", icon:ShoppingBasket, color:'#6366f1', href:'view-item'},
    {name: "Receipt", icon:LucideReceiptText, color:'#6366f1', href:'view-receipt'},
    {name: "Sport", icon:Dumbbell, color:'#6366f1', href:'view-sport'},
    {name: "Location", icon:MapPin, color:'#6366f1', href:'view-location'},
    {name: "Age Category", icon:ChartBarStacked, color:'#6366f1', href:'view-agecategory'},
    {name: "View-Complaints", icon:LucideClipboardType, color:'#6366f1', href:'view-complaints'},
    {name: "Injury Report", icon:LucideShieldAlert, color:'#6366f1', href:'add-report'},
    {name: "Coach Attendance", icon:Megaphone, color:'#6366f1', href:'view-coaches'},

]
export const Sidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    return (
        <motion.div
            className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${isSidebarOpen ? 'w-64' : 'w-16'} sm:${isSidebarOpen ? 'w-48' : 'w-14'} md:${isSidebarOpen ? 'w-56' : 'w-16'} lg:${isSidebarOpen ? 'w-64' : 'w-20'}`}
            animate={{ width: isSidebarOpen ? 256 : 64 }}
        >
            <div className='h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-2 flex flex-col border-r border-gray-700'>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className='p-1 rounded-full hover:bg-gray-700 transition-colors max-w-fit'
                >
                    <Menu size={22} />
                </motion.button>
                <nav className='mt-4 flex-grow overflow-auto'>
                    {SIDEBAR_ITEMS.map((item) => (
                        <Link key={item.href} to={item.href}>
                            <motion.div
                                className='flex items-center p-3 text-xs font-medium rounded-lg hover:bg-gray-700 transition-colors mb-1'
                            >
                                <item.icon size={16} style={{ color: item.color, minWidth: "20px" }} />

                                <AnimatePresence>
                                    {isSidebarOpen && (
                                        <motion.span
                                            className='ml-2 whitespace-nowrap'
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: "auto" }}
                                            exit={{ opacity: 0, width: 0 }}
                                            transition={{ duration: 0.2, delay: 0.3 }}
                                        >
                                            {item.name}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </Link>
                    ))}
                </nav>
            </div>
        </motion.div>
    );
};
export default Sidebar;
