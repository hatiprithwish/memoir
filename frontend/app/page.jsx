"use client";

import { useAuth } from "@clerk/nextjs";
import { FileEdit } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const { isSignedIn } = useAuth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center space-y-8 max-w-2xl mx-auto">
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FileEdit className="w-16 h-16 mx-auto text-primary animate-bounce" />
          <motion.h1
            className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Collaborative Editor
          </motion.h1>
          <motion.p
            className="text-lg leading-8 text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Create and edit documents in real-time with your team. Experience
            seamless collaboration with line-by-line locking and multi-cursor
            support.
          </motion.p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link
            href={isSignedIn ? "notes" : "sign-in"}
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primary rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Create New Document
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
