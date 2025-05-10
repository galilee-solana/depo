import toast from 'react-hot-toast';
import { TransactionToast } from '@/components/ui/TransactionToast';

export function ellipsify(str = '', len = 4) {
  if (str.length > 30) {
    return str.substring(0, len) + '..' + str.substring(str.length - len, str.length);
  }
  return str;
}

export function useTransactionToast() {
  return (signature: string) => {
    toast.success(<TransactionToast signature={signature} />);
  };
}
