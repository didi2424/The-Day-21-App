"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";

const NavBar = () => {
  const { data: session } = useSession();

  const [providers, setProviders] = useState(null);
  const [toggleDropDown, setToggleDropDown] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" }); // Redirect to home page after sign-out
  };

  useEffect(() => {
    const setUpProviders = async () => {
      const response = await getProviders();
      setProviders(response);
    };
    setUpProviders();
  }, []);

  return (
    <nav className="flex-between  bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 w-full p-2 border-b border-purple-500/20">
      <Link href="/" className="flex gap-2 flex-center">
        <Image
          src="/assets/images/logo21.svg"
          alt="The Day Logo"
          width="60"
          height="60"
          className="object-contain drop-shadow-[0_0_5px_rgba(147,51,234,0.5)]"
        />
        <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          The Day 21 App
        </p>
      </Link>

      {/* Desktop Navigation */}
      <div className="sm:flex hidden">
        {session?.user ? (
          <div className="flex gap-3 md:gap-5 items-center">
            <Link href="/dashboard">
              <button className="bg-[#1a1a2e] text-purple-400 px-4 py-2 rounded-lg border border-purple-500/50 hover:border-purple-400 transition-all duration-300">
                Dashboard
              </button>
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="bg-[#1a1a2e] text-purple-400 px-4 py-2 rounded-lg border border-purple-500/50 hover:border-purple-400 transition-all duration-300"
            >
              Sign Out
            </button>

            <Link href="/profile">
              <Image
                src={session?.user.image}
                width="40"
                height="40"
                className="rounded-full border-2 border-purple-500/50 hover:border-purple-400 transition-all duration-300"
                alt="profile"
              />
            </Link>
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type="button"
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
                >
                  Sign In
                </button>
              ))}
          </>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="sm:hidden flex relative">
        {session?.user ? (
          <div className="flex">
            <Image
              src={session?.user.image}
              width="40"
              height="40"
              className="rounded-full border-2 border-purple-500/50 hover:border-purple-400 transition-all duration-300"
              alt="profile"
              onClick={() => setToggleDropDown((prev) => !prev)}
            />
            {toggleDropDown && (
              <div className="dropdown bg-[#1a1a2e] border border-purple-500/20 rounded-lg shadow-lg">
                <Link
                  href="/profile"
                  className="dropdown_link"
                  onClick={() => setToggleDropDown(false)}
                >
                  My Profile
                </Link>
                <Link
                  href="/create-task"
                  className="dropdown_link"
                  onClick={() => setToggleDropDown(false)}
                >
                  Create Task
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setToggleDropDown(false);
                    handleSignOut();
                  }}
                  className="mt-5 w-full black_btn"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type="button"
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className="black_btn"
                >
                  Sign In
                </button>
              ))}
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
