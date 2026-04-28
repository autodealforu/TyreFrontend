import SingleOrder from '@/components/single-order';

type Params = Promise<{ id: string }>;

export default async function SingleOrderPage({ params }: { params: Params }) {
  const { id } = await params;
  console.log('Order ID:', id);
  return <SingleOrder />;
}
