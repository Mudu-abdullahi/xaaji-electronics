function AdminReports() {
  const servicePerformance = [
    {
      service: "Electrical Wiring",
      jobs: 24,
      revenue: "KSh 120,000",
    },
    {
      service: "Electrical Repair",
      jobs: 18,
      revenue: "KSh 85,000",
    },
    {
      service: "Lighting Installation",
      jobs: 15,
      revenue: "KSh 72,000",
    },
    {
      service: "Socket Installation",
      jobs: 10,
      revenue: "KSh 35,000",
    },
  ];

  const monthlyData = [
    {
      month: "January",
      revenue: "KSh 85,000",
      expenses: "KSh 42,000",
    },
    {
      month: "February",
      revenue: "KSh 105,000",
      expenses: "KSh 50,000",
    },
    {
      month: "March",
      revenue: "KSh 120,000",
      expenses: "KSh 55,000",
    },
    {
      month: "April",
      revenue: "KSh 145,000",
      expenses: "KSh 63,000",
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-yellow-600">
          Analytics
        </p>

        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Reports
        </h1>

        <p className="mt-2 text-gray-600">
          Understand business performance, revenue, expenses, and jobs.
        </p>
      </div>

      {/* Main Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Revenue
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            KSh 455,000
          </p>

          <p className="mt-3 text-sm text-gray-500">
            From completed services
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Expenses
          </p>

          <p className="mt-2 text-3xl font-bold text-red-600">
            KSh 210,000
          </p>

          <p className="mt-3 text-sm text-gray-500">
            Business operating costs
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Net Profit
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            KSh 245,000
          </p>

          <p className="mt-3 text-sm text-gray-500">
            Revenue minus expenses
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Completed Jobs
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            67
          </p>

          <p className="mt-3 text-sm text-gray-500">
            Successfully completed
          </p>
        </div>

      </div>

      {/* Revenue and Expenses */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="flex flex-col gap-4 border-b border-gray-200 p-6 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Revenue & Expenses
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Monthly business financial performance.
            </p>
          </div>

          <button className="rounded-lg border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
            Export Report
          </button>

        </div>

        <div className="overflow-x-auto">

          <table className="min-w-[700px] w-full">

            <thead className="bg-gray-50">

              <tr>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Month
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Revenue
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Expenses
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Net
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-gray-100">

              {monthlyData.map((data) => (

                <tr
                  key={data.month}
                  className="transition hover:bg-gray-50"
                >

                  <td className="px-6 py-5 font-semibold text-gray-900">
                    {data.month}
                  </td>

                  <td className="px-6 py-5 font-semibold text-green-600">
                    {data.revenue}
                  </td>

                  <td className="px-6 py-5 font-semibold text-red-600">
                    {data.expenses}
                  </td>

                  <td className="px-6 py-5 font-semibold text-blue-600">
                    KSh 43,000
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      </div>

      {/* Service Performance */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-200 p-6">

          <h2 className="text-lg font-bold text-gray-900">
            Service Performance
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Revenue and completed jobs by service.
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="min-w-[700px] w-full">

            <thead className="bg-gray-50">

              <tr>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Service
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Completed Jobs
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Revenue
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-gray-100">

              {servicePerformance.map((service) => (

                <tr
                  key={service.service}
                  className="transition hover:bg-gray-50"
                >

                  <td className="px-6 py-5 font-semibold text-gray-900">
                    {service.service}
                  </td>

                  <td className="px-6 py-5 text-gray-700">
                    {service.jobs}
                  </td>

                  <td className="px-6 py-5 font-semibold text-green-600">
                    {service.revenue}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      </div>

      {/* Business Summary */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl">
            💰
          </div>

          <h3 className="mt-5 text-lg font-bold text-gray-900">
            Revenue
          </h3>

          <p className="mt-2 leading-7 text-gray-600">
            Track money earned from electrical services and future shop
            product sales.
          </p>

        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-2xl">
            💳
          </div>

          <h3 className="mt-5 text-lg font-bold text-gray-900">
            Expenses
          </h3>

          <p className="mt-2 leading-7 text-gray-600">
            Monitor materials, transport, tools, rent, communication,
            and other business costs.
          </p>

        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
            📊
          </div>

          <h3 className="mt-5 text-lg font-bold text-gray-900">
            Profit
          </h3>

          <p className="mt-2 leading-7 text-gray-600">
            Compare income and expenses to understand the financial
            performance of the business.
          </p>

        </div>

      </div>
    </div>
  );
}

export default AdminReports;