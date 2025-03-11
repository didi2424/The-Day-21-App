"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { IoNotificationsOutline } from "react-icons/io5";

function NavbarAdmin() {
    const { data: session } = useSession();
    const [currentPath, setCurrentPath] = useState("");

    // Get the current pathname when component mounts
    useEffect(() => {
        setCurrentPath(window.location.pathname); // Set current path
    }, []);

    // Function to check if the current route matches the link
    const isActive = (path) => {
        return currentPath === path ? ' topactive_btn ' : 'topnotactive_btn'; // Apply styles for active path
    };
    return (
        <nav className="flex-between  border-b border-purple-500/20 ">
            <Link href="/" className="flex gap-2 flex-center">
                <Image
                    src="/assets/images/logo21.svg"
                    alt="The Day Logo"
                    width="60"
                    height="60"
                    className="object-contain drop-shadow-[0_0_5px_rgba(147,51,234,0.5)]"
                />
                <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">The Day 21 App</p>
            </Link>

            <div className="flex gap-7">
                <Link href="/dashboard">
                    <p className={`nav-link ${isActive('/dashboard')} `}>Dashboard</p>
                </Link>

                <Link href="/dashboard/inventory">
                    <p className={`nav-link ${isActive('/dashboard/inventory')} `}>Inventory</p>
                </Link>

                <Link href="/dashboard/transaction">
                    <p className={`nav-link ${isActive('/dashboard/transaction')} `}>Transaction</p>
                </Link>

                <Link href="/dashboard/customers">
                    <p className={`nav-link ${isActive('/dashboard/customers')} `}>Customers</p>
                </Link>
                
                <Link href="/dashboard/message">
                    <p className={`nav-link ${isActive('/dashboard/message')} `}>Message</p>
                </Link>
            </div>

            <div className="flex gap-4 items-center">
                <div className="iconwrapcircleborder p-2 rounded-full border border-purple-500/50 hover:border-purple-400 transition-all duration-300 bg-black/20">
                    <IoNotificationsOutline size={24} className="text-purple-400" />
                </div>

                {session?.user ? (
                    <Link href="/profile">
                        <Image
                            src={session?.user.image}
                            width="40"
                            height="40"
                            className="rounded-full border-2 border-purple-500/50 hover:border-purple-400 transition-all duration-300"
                            alt="profile"
                        />
                    </Link>
                ) : (
                    <></>
                )}
            </div>
        </nav>
    );
}

export default NavbarAdmin;
