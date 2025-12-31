import Layout from '@/components/Layout';

export default function AboutPage() {
  return (
    <Layout title="About" description="About the Open Data Portal">
      <div className="container-main py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            About the Open Data Portal
          </h1>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Welcome to our Open Data Portal, a platform for discovering, accessing,
              and sharing public datasets. Our mission is to make data accessible to
              everyone and foster innovation through open data.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              We believe in the power of open data to drive transparency, enable research,
              and spark innovation. By providing easy access to high-quality datasets, we
              aim to empower researchers, developers, and citizens alike.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              Technology
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              This portal is built using <a href="https://ckan.org" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">CKAN</a>,
              the world-leading open-source data management system, combined with{' '}
              <a href="https://portaljs.org" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">PortalJS</a>,
              a modern frontend framework for data portals.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              Get Involved
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              We welcome contributions from the community. Whether you have data to share,
              feedback on the platform, or want to help improve our portal, we would love
              to hear from you.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              Contact
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              For questions or feedback, please reach out through our official channels.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
