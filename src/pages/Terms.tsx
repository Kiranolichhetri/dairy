import { Layout } from '@/components/layout/Layout';

const Terms = () => (
  <Layout>
    <div className="container mx-auto px-4 py-16">
      <h1 className="font-display text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="text-muted-foreground mb-4">
        By using our website and services, you agree to the following terms and conditions. Please read them carefully.
      </p>
      <h2 className="font-semibold text-xl mt-8 mb-2">Use of Service</h2>
      <p className="mb-4">You agree to use our website for lawful purposes only. You must not misuse our services or attempt to access restricted areas.</p>
      <h2 className="font-semibold text-xl mt-8 mb-2">Orders & Payments</h2>
      <p className="mb-4">All orders are subject to acceptance and availability. Payment must be made in full before delivery.</p>
      <h2 className="font-semibold text-xl mt-8 mb-2">Limitation of Liability</h2>
      <p className="mb-4">We are not liable for any indirect or consequential damages arising from the use of our services.</p>
      <h2 className="font-semibold text-xl mt-8 mb-2">Contact</h2>
      <p>If you have questions about our terms, please contact us at info@khairawangdairy.com.</p>
    </div>
  </Layout>
);

export default Terms;
