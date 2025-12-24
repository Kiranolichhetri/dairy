import { Layout } from '@/components/layout/Layout';

const Privacy = () => (
  <Layout>
    <div className="container mx-auto px-4 py-16">
      <h1 className="font-display text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-muted-foreground mb-4">
        We value your privacy. This page explains how we collect, use, and protect your personal information when you use our website and services.
      </p>
      <h2 className="font-semibold text-xl mt-8 mb-2">Information Collection</h2>
      <p className="mb-4">We collect information you provide when you place orders, sign up, or contact us. This may include your name, address, email, and phone number.</p>
      <h2 className="font-semibold text-xl mt-8 mb-2">Use of Information</h2>
      <p className="mb-4">We use your information to process orders, provide customer support, and improve our services. We do not sell your data to third parties.</p>
      <h2 className="font-semibold text-xl mt-8 mb-2">Data Security</h2>
      <p className="mb-4">We implement security measures to protect your data. However, no method of transmission over the internet is 100% secure.</p>
      <h2 className="font-semibold text-xl mt-8 mb-2">Contact</h2>
      <p>If you have questions about our privacy policy, please contact us at info@khairawangdairy.com.</p>
    </div>
  </Layout>
);

export default Privacy;
