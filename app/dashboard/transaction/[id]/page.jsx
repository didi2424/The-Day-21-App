'use client';

import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import NavbarAdmin from '@/components/NavBar/NavbarAdmin';
import Provider from "@/components/Provider";
import { MdArrowBack } from "react-icons/md";

export default function TransactionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const transactionId = params.id;

  return (
    <Provider>
      <div className="min-h-screen">
        <header className="p-4">
          <NavbarAdmin />
        </header>

        <main className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <MdArrowBack className="mr-2" />
              Back to Transactions
            </button>
          </div>

          <div className="bg-white rounded-lg shadow">
            <TransactionDetail transactionId={transactionId} />
          </div>
        </main>
      </div>
    </Provider>
  );
}
