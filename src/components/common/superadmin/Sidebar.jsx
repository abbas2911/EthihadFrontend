import { BarChart2, CalendarDays, ShoppingBasket, Menu, PersonStanding, Receipt, School, Shapes, Timer, LucideReceiptText, UserRoundPlus  } from 'lucide-react'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from "react-router-dom";

const SIDEBAR_ITEMS  = [
    {name: "Dashboard", icon:BarChart2, color:'#6366f1', href:'/superadmin/dashboard'},
    {name: "Admin", icon:UserRoundPlus, color:'#6366f1', href:'view-admin'},
    {name: "Coach", icon:UserRoundPlus, color:'#6366f1', href:'view-coach'},
    
    {name: "Students", icon:PersonStanding, color:'#6366f1', href:'view-student'},
    {name: "Term", icon:School, color:'#6366f1', href:'view-term'},
    {name: "Classes", icon:Shapes, color:'#6366f1', href:'view-class'},
    {name: "Events", icon:CalendarDays, color:'#6366f1', href:'view-event'},
    {name: "Invoice", icon:Receipt, color:'#6366f1', href:'view-invoice'},
    {name: "Duration", icon:Timer, color:'#6366f1', href:'view-duration'},
    {name: "Item", icon:ShoppingBasket, color:'#6366f1', href:'view-item'},
    {name: "Receipt", icon:LucideReceiptText, color:'#6366f1', href:'view-receipt'},



]
export const Sidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <motion.div
        className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${isSidebarOpen ? 'w-64' : 'w-20'}`
        }
        animate={{ width: isSidebarOpen ? 256:80}}
    >
        <div className='h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700'>
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9}}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className='p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit'
            >
                <Menu size={ 24 }/>
            </motion.button>

            <nav className='mt-8 flex-grow'>
                {SIDEBAR_ITEMS.map((item) => (
                    <Link key={item.href} to={item.href}>
                        <motion.div
                            className='flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2'
                        >
                            <item.icon size={ 20 } style={{ color: item.color, minWidth: "20px" }} />

                            <AnimatePresence>
                                {isSidebarOpen && (
                                    <motion.span
                                        className='ml-4 whitespace-nowrap'
                                        initial={{ opacity: 0, width: 0}}
                                        animate={{ opacity: 1, width: "auto"}}
                                        exit={{ opacity: 0, width: 0}}
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
export default Sidebar
