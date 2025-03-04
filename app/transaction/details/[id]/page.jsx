'use client';
import { useParams, useRouter } from 'next/navigation';
import TransactionDetail from '@/components/TransactionDetail/TransactionDetail';
import Provider from "@/components/Provider";
import { MdArrowBack } from "react-icons/md";

export default function TransactionDetailPage() {
  const router = useRouter();
  const params = useParams();

  const handleBack = () => {
    router.push('/dashboard/transaction?view=transaction');
  };

  return (
    <Provider>
      <div className="h-screen w-screen bg-gray-900 text-gray-100">
        {/* Keep this Back Button */}
        <div className="p-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <MdArrowBack size={24} />
            <span>Back to Transaction List</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="p-4">
          <div className="bg-gray-800 rounded-2xl shadow-lg">
            <TransactionDetail transactionId={params.id} />
          </div>
        </div>
      </div>
    </Provider>
  );
}
