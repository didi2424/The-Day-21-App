"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { IoNotificationsOutline } from "react-icons/io5";

function NavbarAdmin() {
    const [searchTerm, setSearchTerm] = useState('');
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

    // Handle input change
    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <nav className="flex-between ">
            <Link href="/" className="flex gap-2 flex-center">
                <Image
                    src="/assets/images/logo21.svg"
                    alt="The Day Logo"
                    width="60"
                    height="60"
                    className="object-contain"
                />
                <p className="logo_text">The Day 21 App</p>
            </Link>

            <div className="flex gap-7">
                <Link href="/dashboard">
                    <p className={` ${isActive('/dashboard')} `}>Dashboard</p>
                </Link>

                <Link href="/dashboard/inventory">
                    <p className={` ${isActive('/dashboard/inventory')} `}>Inventory</p>
                </Link>

                <Link href="/dashboard/transaction">
                    <p className={` ${isActive('/dashboard/transaction')} `}>Transaction</p>
                </Link>

                <Link href="/dashboard/customers">
                    <p className={` ${isActive('/dashboard/customers')} `}>Customers</p>
                </Link>
                
                <Link href="/dashboard/message">
                    <p className={` ${isActive('/dashboard/message')} `}>Message</p>
                </Link>
                
            </div>

            <div className="flex gap-4 items-center ">
               
                <div className="iconwrapcircleborder">
                    <IoNotificationsOutline size={24} /> {/* Adjust icon size */}
                </div>

                {session?.user ? (
                    <Link href="/profile">
                        <Image
                            src={session?.user.image}
                            width="40"
                            height="40"
                            className="rounded-full"
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
