"use client";
import { useRouter } from 'next/router';
import TransactionDetail from '@/components/Transaction/TransactionDetail/TransactionDetail';

const TransactionDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id) return null;

  return (
    <div className="container mx-auto p-4">
      <TransactionDetail transactionId={id} />
    </div>
  );
};

export default TransactionDetailPage;
