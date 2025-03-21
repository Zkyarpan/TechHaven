import React from "react";

const AboutUs = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-green-700 overflow-hidden">
        <div className="absolute inset-0">
          <div className="bg-gradient-to-b from-green-800 to-green-600 opacity-90 absolute inset-0"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            About TechHaven
          </h1>
          <p className="mt-6 text-xl text-green-100 max-w-3xl">
            Your trusted partner for premium laptops and tech solutions since
            2015.
          </p>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Our Story */}
        <div className="mb-16">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Our Story
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                TechHaven was founded in 2015 by a group of tech enthusiasts who
                were frustrated with the lack of reliable options for purchasing
                high-quality laptops online. We started as a small operation in
                a garage, selling refurbished laptops to local university
                students.
              </p>
              <p className="mt-4 text-lg text-gray-500">
                Today, we've grown into a trusted retailer of premium laptops
                and tech accessories, serving customers worldwide with a
                commitment to quality, transparency, and exceptional customer
                service.
              </p>
            </div>
            <div className="mt-10 lg:mt-0">
              <div className="bg-green-100 rounded-lg overflow-hidden shadow-lg">
                <div className="h-64 bg-green-600 flex items-center justify-center">
                  <svg
                    className="h-32 w-32 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm-1-5a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    From Garage to Global
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Our humble beginnings taught us the value of building
                    relationships with our customers that last beyond the
                    transaction.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Mission */}
        <div className="mb-16">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Our Mission
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-500">
              To provide tech enthusiasts and professionals with carefully
              curated, high-performance laptops that meet their specific needs,
              backed by exceptional service and support.
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="pt-6">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="h-2 bg-green-500"></div>
                  <div className="px-6 py-8">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-600 text-white mx-auto">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <h3 className="mt-4 text-center text-lg font-medium text-gray-900">
                      Quality First
                    </h3>
                    <p className="mt-2 text-center text-base text-gray-500">
                      We rigorously test all products before they reach our
                      customers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="h-2 bg-green-500"></div>
                  <div className="px-6 py-8">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-600 text-white mx-auto">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <h3 className="mt-4 text-center text-lg font-medium text-gray-900">
                      Innovation
                    </h3>
                    <p className="mt-2 text-center text-base text-gray-500">
                      We're always on the lookout for the latest tech
                      advancements.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="h-2 bg-green-500"></div>
                  <div className="px-6 py-8">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-600 text-white mx-auto">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="mt-4 text-center text-lg font-medium text-gray-900">
                      Customer Focus
                    </h3>
                    <p className="mt-2 text-center text-base text-gray-500">
                      We build long-term relationships through exceptional
                      service.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-8">
            Our Leadership Team
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-green-200 flex items-center justify-center">
                <svg
                  className="h-24 w-24 text-green-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Jane Smith
                </h3>
                <p className="text-sm text-green-600 mb-3">Founder & CEO</p>
                <p className="text-base text-gray-500">
                  Tech industry veteran with over 15 years of experience in
                  product development and e-commerce.
                </p>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-green-200 flex items-center justify-center">
                <svg
                  className="h-24 w-24 text-green-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  David Johnson
                </h3>
                <p className="text-sm text-green-600 mb-3">CTO</p>
                <p className="text-base text-gray-500">
                  Former software engineer at major tech companies, leading our
                  technical operations and innovations.
                </p>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-green-200 flex items-center justify-center">
                <svg
                  className="h-24 w-24 text-green-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Sarah Williams
                </h3>
                <p className="text-sm text-green-600 mb-3">
                  Head of Customer Experience
                </p>
                <p className="text-base text-gray-500">
                  Customer service expert dedicated to ensuring every client has
                  an exceptional experience with TechHaven.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-green-700 rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-12 sm:px-12 lg:flex lg:items-center lg:py-16">
            <div className="lg:w-0 lg:flex-1">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Get in touch with us
              </h2>
              <p className="mt-4 max-w-3xl text-lg text-green-100">
                Have questions about our products or company? Our team is ready
                to help!
              </p>
            </div>
            <div className="mt-8 lg:mt-0 lg:ml-8">
              <div className="sm:flex">
                <button
                  type="button"
                  className="block w-full rounded-md border border-transparent px-5 py-3 bg-white text-base font-medium text-green-700 shadow hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-700 sm:px-10"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
